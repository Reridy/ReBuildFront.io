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

function makeBot(slot){return{id:`bot-${crypto.randomUUID()}`,slot,name:['MIKA','RON','EVE','NOVA'][slot]||`BOT-${slot+1}`,bot:true,x:1100+slot*25,y:700+slot*20,hp:100,order:'defend'};}
function ensureRoom(id){if(!rooms.has(id))rooms.set(id,{id,players:new Map(),bots:new Map(),world:{heartHp:1000,wave:0,phase:'prep'},updatedAt:Date.now()});return rooms.get(id);}
function fillBots(room){const occupied=new Set([...room.players.values()].map(p=>p.slot));room.bots.clear();for(let slot=0;slot<MAX_PLAYERS;slot++){if(!occupied.has(slot))room.bots.set(slot,makeBot(slot));}}
function snapshot(room){return{roomId:room.id,world:room.world,players:[...room.players.values()],bots:[...room.bots.values()]};}
function firstFreeSlot(room){const used=new Set([...room.players.values()].map(p=>p.slot));for(let i=0;i<MAX_PLAYERS;i++)if(!used.has(i))return i;return -1;}

io.on('connection',socket=>{
  socket.on('join-room',({roomId='public-1',name='Player'}={})=>{
    const room=ensureRoom(String(roomId).slice(0,32));
    const slot=firstFreeSlot(room);
    if(slot<0){socket.emit('room-full');return;}
    const player={id:socket.id,slot,name:String(name).slice(0,20),bot:false,x:1100,y:800,hp:140,input:{x:0,y:0,aim:0,fire:false,build:null}};
    room.players.set(socket.id,player);fillBots(room);socket.join(room.id);socket.data.roomId=room.id;socket.emit('joined',{slot,roomId:room.id});io.to(room.id).emit('state',snapshot(room));
  });

  socket.on('input',input=>{
    const room=rooms.get(socket.data.roomId);const p=room?.players.get(socket.id);if(!p)return;
    p.input={x:Math.max(-1,Math.min(1,Number(input?.x)||0)),y:Math.max(-1,Math.min(1,Number(input?.y)||0)),aim:Number(input?.aim)||0,fire:Boolean(input?.fire),build:input?.build??null};
  });

  socket.on('order',order=>{
    const room=rooms.get(socket.data.roomId);if(!room)return;
    const allowed=new Set(['follow','defend','gather','repair']);if(!allowed.has(order))return;
    for(const bot of room.bots.values())bot.order=order;
  });

  socket.on('disconnect',()=>{
    const room=rooms.get(socket.data.roomId);if(!room)return;room.players.delete(socket.id);fillBots(room);if(room.players.size===0){rooms.delete(room.id);return;}io.to(room.id).emit('state',snapshot(room));
  });
});

setInterval(()=>{
  for(const room of rooms.values()){
    for(const p of room.players.values()){
      const m=Math.hypot(p.input.x,p.input.y)||1;const speed=235/TICK_RATE;p.x=Math.max(0,Math.min(2200,p.x+(p.input.x/m)*speed));p.y=Math.max(0,Math.min(1400,p.y+(p.input.y/m)*speed));
    }
    for(const bot of room.bots.values()){
      const dx=1100-bot.x,dy=700-bot.y,m=Math.hypot(dx,dy)||1;bot.x+=dx/m*2.2;bot.y+=dy/m*2.2;
    }
    room.updatedAt=Date.now();io.to(room.id).emit('state',snapshot(room));
  }
},1000/TICK_RATE);

server.listen(PORT,()=>console.log(`RE:BUILDFRONT server listening on ${PORT}`));
