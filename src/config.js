export const WORLD={width:2200,height:1400,heart:{x:1100,y:700,radius:38,maxHp:1000},prepSeconds:38,warningSeconds:7,baseWaveSeconds:48,gridSize:48};
export const PLAYER={speed:235,radius:14,maxHp:140,fireRate:0.18,bulletSpeed:720,damage:24,dashSpeed:660,dashDuration:0.15,dashCooldown:1.6};
export const BUILDINGS={
 wall:{label:'벽',wood:18,stone:8,hp:260,gridW:1,gridH:1,color:'#6d7c8c',description:'적과 플레이어의 이동을 막는 기본 방어벽입니다. 1×1 슬롯을 사용합니다.'},
 turret:{label:'터렛',wood:28,stone:26,crystal:5,hp:190,gridW:1,gridH:1,color:'#6da6bd',description:'사거리 안의 적을 자동으로 공격합니다. 발전기 범위 안에서는 공격력이 상승합니다. 1×1 슬롯.'},
 trap:{label:'함정',wood:12,stone:14,hp:100,gridW:1,gridH:1,color:'#8b6d62',description:'밟고 지나가는 적에게 지속 피해를 줍니다. 발전기 전력을 받으면 더 강해집니다. 1×1 슬롯.'},
 generator:{label:'발전기',wood:30,stone:22,crystal:8,hp:210,gridW:2,gridH:2,color:'#8d79b8',description:'주변 터렛과 함정에 전력을 공급합니다. 넓은 정사각형 토대 2×2, 총 4칸을 사용합니다.'}
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