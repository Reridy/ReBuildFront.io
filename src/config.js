export const WORLD={width:2200,height:1400,heart:{x:1100,y:700,radius:38,maxHp:1000},prepSeconds:38,warningSeconds:7,baseWaveSeconds:48,gridSize:48};
export const PLAYER={speed:235,radius:14,maxHp:140,swordDamage:36,swordRange:64,swordCooldown:.42,fireRate:.22,bulletSpeed:720,gunDamage:25,dashSpeed:660,dashDuration:.15,dashCooldown:1.6,gatherRange:82};

export const RESOURCES={
 wood:{label:'Wood',icon:'▰',color:'#79b77f'},
 stone:{label:'Stone',icon:'◆',color:'#9aa5af'},
 fiber:{label:'Fiber',icon:'≋',color:'#9ed58e'},
 iron:{label:'Iron',icon:'⬢',color:'#aeb8c2'},
 crystal:{label:'Crystal',icon:'✦',color:'#9edfff'},
 quartz:{label:'Quartz',icon:'◇',color:'#d8c9ff'},
 herb:{label:'Herb',icon:'✤',color:'#83c99a'},
 resin:{label:'Resin',icon:'●',color:'#d6a86f'},
 scrap:{label:'Scrap',icon:'▣',color:'#c69673'},
 copper:{label:'Copper',icon:'⬡',color:'#d8956b'}
};

export const ZONES=[
 {id:'greenwood',name:'Greenwood',x:0,y:0,w:760,h:700,color:'#183328',accent:'#5ea66e',resources:['wood','fiber'],nodeTypes:['tree','bush'],description:'목재와 섬유가 풍부한 숲 지대.'},
 {id:'stonefall',name:'Stonefall Quarry',x:760,y:0,w:720,h:520,color:'#293039',accent:'#8f9aa4',resources:['stone','iron'],nodeTypes:['rock','iron'],description:'석재와 철광이 집중된 채석 지대.'},
 {id:'crystalreach',name:'Crystal Reach',x:1480,y:0,w:720,h:700,color:'#202e3b',accent:'#7bc7e8',resources:['crystal','quartz'],nodeTypes:['crystal','quartz'],description:'희귀 결정 자원을 얻을 수 있는 고위험 지대.'},
 {id:'mire',name:'Verdant Mire',x:0,y:700,w:760,h:700,color:'#263326',accent:'#74a77a',resources:['herb','resin'],nodeTypes:['herb','resin'],description:'약초와 수지가 자라는 습지.'},
 {id:'heartlands',name:'Heartlands',x:760,y:520,w:720,h:880,color:'#1d2a32',accent:'#6e93a6',resources:['wood','stone'],nodeTypes:['tree','rock'],description:'HEART 주변의 균형 잡힌 안전 지대.'},
 {id:'scrapyard',name:'Old Scrapyard',x:1480,y:700,w:720,h:700,color:'#352b27',accent:'#b98062',resources:['scrap','copper'],nodeTypes:['scrap','copper'],description:'고철과 구리를 회수할 수 있는 폐허 지대.'}
];

export const NODE_TYPES={
 tree:{resource:'wood',secondary:'fiber',amount:22,secondaryChance:.42,hp:85,radius:24,color:'#477454'},
 bush:{resource:'fiber',secondary:'wood',amount:18,secondaryChance:.22,hp:58,radius:18,color:'#6f9b66'},
 rock:{resource:'stone',secondary:'iron',amount:20,secondaryChance:.2,hp:90,radius:22,color:'#737d87'},
 iron:{resource:'iron',secondary:'stone',amount:14,secondaryChance:.5,hp:105,radius:21,color:'#89939c'},
 crystal:{resource:'crystal',secondary:'quartz',amount:5,secondaryChance:.55,hp:115,radius:20,color:'#72c8ed'},
 quartz:{resource:'quartz',secondary:'crystal',amount:8,secondaryChance:.25,hp:95,radius:20,color:'#b8a6df'},
 herb:{resource:'herb',secondary:'resin',amount:16,secondaryChance:.2,hp:48,radius:17,color:'#68ae7d'},
 resin:{resource:'resin',secondary:'herb',amount:11,secondaryChance:.35,hp:65,radius:18,color:'#b98a54'},
 scrap:{resource:'scrap',secondary:'copper',amount:15,secondaryChance:.38,hp:80,radius:21,color:'#9d765e'},
 copper:{resource:'copper',secondary:'scrap',amount:12,secondaryChance:.42,hp:92,radius:20,color:'#bd7656'}
};

export const BUILDINGS={
 wall:{label:'벽',wood:18,stone:8,hp:260,gridW:1,gridH:1,color:'#6d7c8c',description:'초반부터 사용 가능한 기본 방어벽입니다. 적의 진로를 막고 시간을 벌어줍니다. 1×1 슬롯.'},
 trap:{label:'함정',wood:12,stone:14,hp:100,gridW:1,gridH:1,color:'#8b6d62',description:'초반부터 사용 가능한 근접 방어 구조물입니다. 밟고 지나가는 적에게 피해를 줍니다. 1×1 슬롯.'},
 turret:{label:'터렛',wood:28,stone:26,iron:8,crystal:5,hp:190,gridW:1,gridH:1,color:'#6da6bd',research:'turret',description:'연구 후 해금되는 자동 방어 시설입니다. 사거리 안의 적을 자동 공격합니다. 1×1 슬롯.'},
 generator:{label:'발전기',wood:24,stone:18,copper:10,crystal:8,hp:210,gridW:2,gridH:2,color:'#8d79b8',research:'powerGrid',description:'전력망 연구 후 해금됩니다. 주변 터렛과 함정에 전력을 공급합니다. 2×2, 총 4칸.'}
};

export const ENEMIES={
 grunt:{hp:75,speed:72,damage:13,radius:14,reward:2,color:'#d76262'},
 runner:{hp:48,speed:126,damage:9,radius:11,reward:2,color:'#e68d58'},
 brute:{hp:260,speed:44,damage:28,radius:21,reward:5,color:'#a64f54'},
 spitter:{hp:95,speed:58,damage:12,radius:13,reward:4,color:'#9f6bb0'},
 boss:{hp:1500,speed:36,damage:48,radius:35,reward:35,color:'#d4466a'}
};
export const AI_PLAYERS=[{name:'MIKA',accent:'#86d3ff'},{name:'RON',accent:'#ff9f7c'},{name:'EVE',accent:'#9ee59e'}];
export const RESEARCH={
 ranged:{label:'원거리 무기',cost:12,branch:'무기',description:'플레이어와 AI가 검 외에 카빈을 사용할 수 있게 합니다. Q로 검/카빈 전환.'},
 turret:{label:'자동 터렛',cost:18,requires:['ranged'],branch:'무기',description:'자동 터렛 건설을 해금합니다.'},
 powerGrid:{label:'전력망',cost:18,requires:['turret'],branch:'무기',description:'2×2 발전기를 해금하고 전력 방어망을 구축할 수 있게 합니다.'},
 overcharge:{label:'과충전',cost:24,requires:['powerGrid'],branch:'무기',description:'발전기 범위 안 터렛 피해 +45%, 함정 피해 +30%.'},
 wallI:{label:'강화벽 I',cost:10,branch:'방어',description:'모든 벽 최대 체력 +35%. 기존 벽에도 즉시 적용.'},
 wallII:{label:'강화벽 II',cost:20,requires:['wallI'],branch:'방어',description:'벽 최대 체력을 추가로 +35% 강화.'},
 thorns:{label:'반격 장갑',cost:16,requires:['wallI'],branch:'방어',description:'벽을 근접 공격한 적이 반격 피해를 받습니다.'},
 fortify:{label:'구조 보강',cost:24,requires:['wallII'],branch:'방어',description:'모든 구조물이 받는 피해 20% 감소.'},
 fieldRepair:{label:'현장 수리',cost:14,branch:'지원',description:'침공이 아닐 때 손상된 구조물이 천천히 자동 수리됩니다.'},
 corePlating:{label:'HEART 장갑',cost:22,branch:'지원',description:'HEART 최대 체력 +350, 즉시 350 회복.'},
 squadTraining:{label:'전투 훈련',cost:18,branch:'지원',description:'AI 플레이어의 최대 체력과 공격 효율을 강화합니다.'}
};