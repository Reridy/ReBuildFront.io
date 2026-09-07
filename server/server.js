import express from 'express';
import http from 'node:http';
import {Server} from 'socket.io';
import {randomBytes,randomUUID,scryptSync,timingSafeEqual} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname=dirname(fileURLToPath(import.meta.url));
const DATA_DIR=join(__dirname,'data'),USER_FILE=join(DATA_DIR,'users.json');
mkdirSync(DATA_DIR,{recursive:true});
if(!existsSync(USER_FILE))writeFileSync(USER_FILE,'[]');
const readUsers=()=>{try{return JSON.parse(readFileSync(USER_FILE,'utf8'))}catch{return[]}};
const saveUsers=users=>writeFileSync(USER_FILE,JSON.stringify(users,null,2));
const hashPassword=password=>{const salt=randomBytes(16).toString('hex'),hash=scryptSync(password,salt,64).toString('hex');return`${salt}:${hash}`};
const checkPassword=(password,stored)=>{try{const[salt,hex]=stored.split(':'),a=Buffer.from(hex,'hex'),b=scryptSync(password,salt,64);return a.length===b.length&&timingSafeEqual(a,b)}catch{return false}};
const cleanName=v=>String(v||'').replace(/[^\p{L}\p{N}_\- ]/gu,'').trim().slice(0,20);
const cleanText=(v,max=180)=>String(v||'').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,max);
const supportedLang=new Set(['en','ko','ja','zh']);

const app=express();app.use(express.json({limit:'64kb'}));
const server=http.createServer(app);const io=new Server(server,{cors:{origin:'*'}});
const PORT=process.env.PORT||3000,MAX_PLAYERS=15,TICK_RATE=20;
const rooms=new Map(),sessions=new Map();let guestCounter=1;

function publicUser(u){return{id:u.id,username:u.username,language:u.language||'en',providers:u.providers||[]}}
function issueSession(user){const token=randomBytes(32).toString('hex');sessions.set(token,{userId:user.id,createdAt:Date.now()});return token}
function auth(req){const raw=req.headers.authorization||'',token=raw.startsWith('Bearer ')?raw.slice(7):'';const s=sessions.get(token);if(!s)return null;const user=readUsers().find(u=>u.id===s.userId);return user?{token,user}:null}

app.get('/health',(_req,res)=>res.json({ok:true,rooms:rooms.size,users:readUsers().length}));
app.post('/api/auth/signup',(req,res)=>{const username=cleanName(req.body?.username),password=String(req.body?.password||''),language=supportedLang.has(req.body?.language)?req.body.language:'en';if(username.length<3||password.length<8)return res.status(400).json({error:'INVALID_CREDENTIALS'});const users=readUsers();if(users.some(u=>u.username.toLowerCase()===username.toLowerCase()))return res.status(409).json({error:'USERNAME_TAKEN'});const user={id:randomUUID(),username,passwordHash:hashPassword(password),language,providers:[],createdAt:Date.now(),profile:{customTemplates:[],settings:{}}};users.push(user);saveUsers(users);res.status(201).json({token:issueSession(user),user:publicUser(user)})});
app.post('/api/auth/login',(req,res)=>{const username=cleanName(req.body?.username),password=String(req.body?.password||''),user=readUsers().find(u=>u.username.toLowerCase()===username.toLowerCase());if(!user||!checkPassword(password,user.passwordHash))return res.status(401).json({error:'INVALID_LOGIN'});res.json({token:issueSession(user),user:publicUser(user)})});
app.delete('/api/account',(req,res)=>{const a=auth(req);if(!a)return res.status(401).json({error:'UNAUTHORIZED'});const users=readUsers().filter(u=>u.id!==a.user.id);saveUsers(users);sessions.delete(a.token);res.json({ok:true})});
app.put('/api/account/preferences',(req,res)=>{const a=auth(req);if(!a)return res.status(401).json({error:'UNAUTHORIZED'});const users=readUsers(),u=users.find(x=>x.id===a.user.id);if(supportedLang.has(req.body?.language))u.language=req.body.language;u.profile=u.profile||{};u.profile.settings={...(u.profile.settings||{}),...(req.body?.settings||{})};if(Array.isArray(req.body?.customTemplates))u.profile.customTemplates=req.body.customTemplates.slice(0,12);saveUsers(users);res.json({user:publicUser(u)})});
app.post('/api/ad/reward',(_req,res)=>res.json({ok:true,reward:'CUSTOM_IMAGE_UPLOAD',token:randomBytes(12).toString('hex'),mode:process.env.AD_PROVIDER?'provider':'development'}));

function roomSummary(r){return{id:r.id,name:r.name,description:r.description,map:r.map,difficulty:r.difficulty,maxPlayers:r.maxPlayers,players:r.players.size,language:r.language,hostName:r.hostName,started:r.started}}
app.get('/api/rooms',(_req,res)=>res.json([...rooms.values()].filter(r=>!r.started).map(roomSummary)));
app.post('/api/rooms',(req,res)=>{const name=cleanText(req.body?.name,40)||'Room',description=cleanText(req.body?.description,160),map=req.body?.map==='test'?'test':'test',difficulty:['easy','normal','hard'].includes(req.body?.difficulty)?req.body.difficulty:'normal',maxPlayers=Math.max(1,Math.min(MAX_PLAYERS,Number(req.body?.maxPlayers)||4)),language=supportedLang.has(req.body?.language)?req.body.language:'en',id=randomUUID().slice(0,8);const room={id,name,description,map,difficulty,maxPlayers,language,hostId:null,hostName:null,players:new Map(),started:false,world:{heartHp:1000,wave:0,phase:'prep'},updatedAt:Date.now()};rooms.set(id,room);res.status(201).json(roomSummary(room))});

function ensureRoom(id){if(rooms.has(id))return rooms.get(id);const room={id:String(id).slice(0,32),name:'Room',description:'',map:'test',difficulty:'normal',maxPlayers:4,language:'en',hostId:null,hostName:null,players:new Map(),started:false,world:{heartHp:1000,wave:0,phase:'prep'},updatedAt:Date.now()};rooms.set(room.id,room);return room}
function snapshot(r){return{room:roomSummary(r),members:[...r.players.values()].map(p=>({id:p.id,name:p.name,ready:p.ready,host:p.id===r.hostId,slot:p.slot,x:p.x,y:p.y,hp:p.hp}))}}
function freeSlot(r){const used=new Set([...r.players.values()].map(p=>p.slot));for(let i=0;i<r.maxPlayers;i++)if(!used.has(i))return i;return-1}
function findByName(r,name){return[...r.players.values()].find(p=>p.name.toLowerCase()===String(name).toLowerCase())}
function allReady(r){const people=[...r.players.values()];return people.length>0&&people.filter(p=>p.id!==r.hostId).every(p=>p.ready)}
function broadcastRoom(r){io.to(r.id).emit('room-state',snapshot(r))}

io.on('connection',socket=>{
  socket.on('join-room',({roomId,name,language}={})=>{const r=ensureRoom(roomId||'public-1');if(r.started)return socket.emit('room-error',{code:'STARTED'});const slot=freeSlot(r);if(slot<0)return socket.emit('room-full');let playerName=cleanName(name)||`User${guestCounter++}`;if(findByName(r,playerName))playerName=`${playerName}-${slot+1}`.slice(0,20);const p={id:socket.id,slot,name:playerName,ready:false,language:supportedLang.has(language)?language:'en',x:1100,y:800,hp:140,input:{x:0,y:0}};r.players.set(socket.id,p);if(!r.hostId){r.hostId=socket.id;r.hostName=p.name;p.ready=true}socket.join(r.id);socket.data.roomId=r.id;socket.emit('joined',{roomId:r.id,name:p.name,host:p.id===r.hostId});broadcastRoom(r)});
  socket.on('room-config',cfg=>{const r=rooms.get(socket.data.roomId);if(!r||r.hostId!==socket.id||r.started)return;r.name=cleanText(cfg?.name,40)||r.name;r.description=cleanText(cfg?.description,160);r.map=cfg?.map==='test'?'test':r.map;r.difficulty=['easy','normal','hard'].includes(cfg?.difficulty)?cfg.difficulty:r.difficulty;r.maxPlayers=Math.max(r.players.size,Math.min(MAX_PLAYERS,Number(cfg?.maxPlayers)||r.maxPlayers));r.language=supportedLang.has(cfg?.language)?cfg.language:r.language;broadcastRoom(r)});
  socket.on('ready',value=>{const r=rooms.get(socket.data.roomId),p=r?.players.get(socket.id);if(!r||!p||p.id===r.hostId)return;p.ready=Boolean(value);broadcastRoom(r)});
  socket.on('start-game',()=>{const r=rooms.get(socket.data.roomId);if(!r||r.hostId!==socket.id||!allReady(r))return;r.started=true;io.to(r.id).emit('game-start',{room:roomSummary(r)});broadcastRoom(r)});
  socket.on('input',input=>{const r=rooms.get(socket.data.roomId),p=r?.players.get(socket.id);if(!p)return;p.input={x:Math.max(-1,Math.min(1,Number(input?.x)||0)),y:Math.max(-1,Math.min(1,Number(input?.y)||0))}});
  socket.on('chat',payload=>{const r=rooms.get(socket.data.roomId),sender=r?.players.get(socket.id);if(!r||!sender)return;const text=cleanText(payload?.text);if(!text)return;if(payload?.type==='whisper'){const target=findByName(r,cleanName(payload?.target));if(!target)return socket.emit('chat-error',{code:'PLAYER_NOT_FOUND'});const message={id:randomUUID(),type:'whisper',sender:sender.name,target:target.name,text,createdAt:Date.now()};socket.emit('chat-message',message);if(target.id!==socket.id)io.to(target.id).emit('chat-message',message);return}io.to(r.id).emit('chat-message',{id:randomUUID(),type:'global',sender:sender.name,text,createdAt:Date.now()})});
  socket.on('disconnect',()=>{const r=rooms.get(socket.data.roomId);if(!r)return;r.players.delete(socket.id);if(r.hostId===socket.id){const next=[...r.players.values()][0];r.hostId=next?.id||null;r.hostName=next?.name||null;if(next)next.ready=true}if(!r.players.size){rooms.delete(r.id);return}broadcastRoom(r)})
});

setInterval(()=>{for(const r of rooms.values()){if(!r.started)continue;for(const p of r.players.values()){const ix=p.input.x,iy=p.input.y;if(!ix&&!iy)continue;const m=Math.hypot(ix,iy)||1,step=235/TICK_RATE;let nx=Math.max(14,Math.min(2186,p.x+ix/m*step)),ny=Math.max(14,Math.min(1386,p.y+iy/m*step));for(const other of r.players.values()){if(other.id===p.id)continue;const dx=nx-other.x,dy=ny-other.y,d=Math.hypot(dx,dy)||1;if(d<28){nx=other.x+dx/d*28;ny=other.y+dy/d*28}}p.x=nx;p.y=ny}r.updatedAt=Date.now();io.to(r.id).emit('state',snapshot(r))}},1000/TICK_RATE);
server.listen(PORT,()=>console.log(`RE:BUILDFRONT server listening on ${PORT}`));
