import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';

const app=express();
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:'*'}});
const PORT=process.env.PORT||3000;
const TICK_RATE=20;
const MAX_PLAYERS=4;
const rooms=new Map();

app.get('/health',(_req,res)=>res.json({ok:true,rooms:rooms.size}));

const cleanName=value=>String(value||'Player').replace(/[<>]/g,'').trim().slice(0,20)||'Player';
const cleanMessage=value=>String(value||'').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,180);
function makeBot(slot){return{id:`bot-${crypto.randomUUID()}`,slot,name:['MIKA','RON','EVE','NOVA'][slot]||`BOT-${slot+1}`,bot:true,x:1100+slot*25,y:700+slot*20,hp:100};}
function ensureRoom(id){if(!rooms.has(id))rooms.set(id,{id,players:new Map(),bots:new Map(),world:{heartHp:1000,wave:0,phase:'prep'},updatedAt:Date.now()});return rooms.get(id);}
function fillBots(room){const occupied=new Set([...room.players.values()].map(p=>p.slot));room.bots.clear();for(let slot=0;slot<MAX_PLAYERS;slot++){if(!occupied.has(slot))room.bots.set(slot,makeBot(slot));}}
function snapshot(room){return{roomId:room.id,world:room.world,players:[...room.players.values()],bots:[...room.bots.values()]};}
function firstFreeSlot(room){const used=new Set([...room.players.values()].map(p=>p.slot));for(let i=0;i<MAX_PLAYERS;i++)if(!used.has(i))return i;return -1;}
function findHumanByName(room,name){const lower=String(name).toLowerCase();return [...room.players.values()].find(p=>p.name.toLowerCase()===lower);}

io.on('connection',socket=>{
  socket.on('join-room',({roomId='public-1',name='Player'}={})=>{
    const room=ensureRoom(String(roomId).slice(0,32));
    const slot=firstFreeSlot(room);
    if(slot<0){socket.emit('room-full');return;}
    let playerName=cleanName(name);
    const usedNames=new Set([...room.players.values(),...room.bots.values()].map(p=>p.name.toLowerCase()));
    if(usedNames.has(playerName.toLowerCase()))playerName=`${playerName}-${slot+1}`.slice(0,20);
    const player={id:socket.id,slot,name:playerName,bot:false,x:1100,y:800,hp:140,input:{x:0,y:0,aim:0,fire:false,build:null}};
    room.players.set(socket.id,player);fillBots(room);socket.join(room.id);socket.data.roomId=room.id;socket.emit('joined',{slot,roomId:room.id,name:player.name});io.to(room.id).emit('state',snapshot(room));
  });

  socket.on('input',input=>{
    const room=rooms.get(socket.data.roomId);const p=room?.players.get(socket.id);if(!p)return;
    p.input={x:Math.max(-1,Math.min(1,Number(input?.x)||0)),y:Math.max(-1,Math.min(1,Number(input?.y)||0)),aim:Number(input?.aim)||0,fire:Boolean(input?.fire),build:input?.build??null};
  });

  socket.on('chat',payload=>{
    const room=rooms.get(socket.data.roomId);const sender=room?.players.get(socket.id);if(!room||!sender)return;
    const text=cleanMessage(payload?.text);if(!text)return;
    const targetName=cleanName(payload?.target||'');
    if(payload?.type==='whisper'&&targetName){
      const target=findHumanByName(room,targetName);
      if(!target){socket.emit('chat-error',{code:'PLAYER_NOT_FOUND',target:targetName});return;}
      const message={id:crypto.randomUUID(),type:'whisper',sender:sender.name,target:target.name,text,createdAt:Date.now()};
      socket.emit('chat-message',message);
      if(target.id!==socket.id)io.to(target.id).emit('chat-message',message);
      return;
    }
    io.to(room.id).emit('chat-message',{id:crypto.randomUUID(),type:'global',sender:sender.name,text,createdAt:Date.now()});
  });

  socket.on('disconnect',()=>{
    const room=rooms.get(socket.data.roomId);if(!room)return;room.players.delete(socket.id);fillBots(room);if(room.players.size===0){rooms.delete(room.id);return;}io.to(room.id).emit('state',snapshot(room));
  });
});

setInterval(()=>{
  for(const room of rooms.values()){
    for(const p of room.players.values()){
      const ix=p.input.x,iy=p.input.y;if(!ix&&!iy)continue;
      const m=Math.hypot(ix,iy)||1,speed=235/TICK_RATE;
      let nx=Math.max(14,Math.min(2186,p.x+(ix/m)*speed)),ny=Math.max(14,Math.min(1386,p.y+(iy/m)*speed));
      for(const other of room.players.values()){
        if(other.id===p.id)continue;
        const dx=nx-other.x,dy=ny-other.y,d=Math.hypot(dx,dy),min=28;
        if(d<min){const n=d||1;nx=other.x+dx/n*min;ny=other.y+dy/n*min;}
      }
      p.x=nx;p.y=ny;
    }
    for(const bot of room.bots.values()){
      const dx=1100-bot.x,dy=700-bot.y,m=Math.hypot(dx,dy)||1;bot.x+=dx/m*2.2;bot.y+=dy/m*2.2;
    }
    room.updatedAt=Date.now();io.to(room.id).emit('state',snapshot(room));
  }
},1000/TICK_RATE);

server.listen(PORT,()=>console.log(`RE:BUILDFRONT server listening on ${PORT}`));
