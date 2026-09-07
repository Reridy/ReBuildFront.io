export const WORLD={width:2200,height:1400,heart:{x:1100,y:700,radius:38,maxHp:1000},prepSeconds:38,warningSeconds:7,baseWaveSeconds:48};
export const PLAYER={speed:235,radius:14,maxHp:140,fireRate:0.18,bulletSpeed:720,damage:24,dashSpeed:660,dashDuration:0.12,dashCooldown:1.6};
export const BUILDINGS={
 wall:{label:'벽',wood:18,stone:8,hp:260,size:42,color:'#6d7c8c'},
 turret:{label:'터렛',wood:28,stone:26,crystal:5,hp:190,size:34,color:'#6da6bd'},
 trap:{label:'함정',wood:12,stone:14,hp:100,size:38,color:'#8b6d62'},
 generator:{label:'발전기',wood:30,stone:22,crystal:8,hp:210,size:40,color:'#8d79b8'}
};
export const ENEMIES={
 grunt:{hp:75,speed:72,damage:13,radius:14,reward:2,color:'#d76262'},
 runner:{hp:48,speed:126,damage:9,radius:11,reward:2,color:'#e68d58'},
 brute:{hp:260,speed:44,damage:28,radius:21,reward:5,color:'#a64f54'},
 spitter:{hp:95,speed:58,damage:12,radius:13,reward:4,color:'#9f6bb0'},
 boss:{hp:1500,speed:36,damage:48,radius:35,reward:35,color:'#d4466a'}
};
export const AI_ROLES=[
 {name:'MIKA',role:'Builder',accent:'#86d3ff'},
 {name:'RON',role:'Vanguard',accent:'#ff9f7c'},
 {name:'EVE',role:'Gatherer',accent:'#9ee59e'}
];