export const WORLD={width:2200,height:1400,gridSize:48,heart:{x:1100,y:700,radius:38,maxHp:1000},prepSeconds:42,warningSeconds:7,recoverySeconds:15,baseWaveSeconds:52,nodeSpawnClearance:132};
export const PLAYER={speed:235,radius:14,maxHp:140,actionRange:88,depositRange:112,stationRange:145,dashSpeed:660,dashDuration:.15,dashCooldown:1.6};
export const RESOURCES={wood:{icon:'▰',color:'#79b77f'},stone:{icon:'◆',color:'#9aa5af'},fiber:{icon:'≋',color:'#9ed58e'},iron:{icon:'⬢',color:'#aeb8c2'},crystal:{icon:'✦',color:'#9edfff'},quartz:{icon:'◇',color:'#d8c9ff'},herb:{icon:'✤',color:'#83c99a'},resin:{icon:'●',color:'#d6a86f'},scrap:{icon:'▣',color:'#c69673'},copper:{icon:'⬡',color:'#d8956b'}};
export const ZONES=[
{id:'greenwood',x:0,y:0,w:760,h:700,color:'#183328',accent:'#5ea66e',resources:['wood','fiber'],nodeTypes:['tree','bush']},
{id:'stonefall',x:760,y:0,w:720,h:520,color:'#293039',accent:'#8f9aa4',resources:['stone','iron'],nodeTypes:['rock','iron']},
{id:'crystalreach',x:1480,y:0,w:720,h:700,color:'#202e3b',accent:'#7bc7e8',resources:['crystal','quartz'],nodeTypes:['crystal','quartz']},
{id:'mire',x:0,y:700,w:760,h:700,color:'#263326',accent:'#74a77a',resources:['herb','resin'],nodeTypes:['herb','resin']},
{id:'heartlands',x:760,y:520,w:720,h:880,color:'#1d2a32',accent:'#6e93a6',resources:['wood','stone'],nodeTypes:['tree','rock']},
{id:'scrapyard',x:1480,y:700,w:720,h:700,color:'#352b27',accent:'#b98062',resources:['scrap','copper'],nodeTypes:['scrap','copper']}
];
export const NODE_TYPES={
tree:{resource:'wood',secondary:'fiber',amount:22,secondaryChance:.42,hp:85,radius:24,color:'#477454',tool:'axe'},bush:{resource:'fiber',secondary:'wood',amount:18,secondaryChance:.22,hp:58,radius:18,color:'#6f9b66',tool:'axe'},
rock:{resource:'stone',secondary:'iron',amount:20,secondaryChance:.2,hp:90,radius:22,color:'#737d87',tool:'pickaxe'},iron:{resource:'iron',secondary:'stone',amount:14,secondaryChance:.5,hp:105,radius:21,color:'#89939c',tool:'pickaxe'},crystal:{resource:'crystal',secondary:'quartz',amount:5,secondaryChance:.55,hp:115,radius:20,color:'#72c8ed',tool:'pickaxe'},quartz:{resource:'quartz',secondary:'crystal',amount:8,secondaryChance:.25,hp:95,radius:20,color:'#b8a6df',tool:'pickaxe'},
herb:{resource:'herb',secondary:'resin',amount:16,secondaryChance:.2,hp:48,radius:17,color:'#68ae7d',tool:'axe'},resin:{resource:'resin',secondary:'herb',amount:11,secondaryChance:.35,hp:65,radius:18,color:'#b98a54',tool:'axe'},scrap:{resource:'scrap',secondary:'copper',amount:15,secondaryChance:.38,hp:80,radius:21,color:'#9d765e',tool:'pickaxe'},copper:{resource:'copper',secondary:'scrap',amount:12,secondaryChance:.42,hp:92,radius:20,color:'#bd7656',tool:'pickaxe'}};
export const BUILDINGS={
 wall:{hp:280,gridW:1,gridH:1,color:'#6d7c8c',item:'wallItem',icon:'▥',category:'defense'},
 generator:{hp:260,gridW:2,gridH:2,color:'#8d79b8',item:'generatorItem',icon:'◉',research:'powerGrid',category:'support',powerRadius:320},
 relay:{hp:170,gridW:1,gridH:1,color:'#5aa6a3',item:'relayItem',icon:'⌁',research:'fieldRepair',category:'support',powerRadius:300,repairRadius:195},
 depot:{hp:280,gridW:2,gridH:1,color:'#a3835a',item:'depotItem',icon:'▤',research:'logistics',category:'logistics',depositRadius:128},
 workbench:{hp:230,gridW:2,gridH:2,color:'#8a6c4d',item:'workbench',icon:'▧',category:'station'},
 researchBench:{hp:250,gridW:2,gridH:2,color:'#5d6da8',item:'researchBench',icon:'⌬',category:'station'}
};
export const ENEMIES={
 grunt:{hp:78,speed:72,damage:13,radius:14,reward:2,color:'#d76262',icon:'●'},
 runner:{hp:50,speed:128,damage:9,radius:11,reward:2,color:'#e68d58',icon:'◆'},
 brute:{hp:275,speed:44,damage:30,radius:21,reward:5,color:'#a64f54',icon:'■',breach:1.4},
 boss:{hp:1550,speed:36,damage:50,radius:35,reward:35,color:'#d4466a',icon:'⬢',breach:1.8}
};
export const AI_PLAYERS=[{name:'MIKA',accent:'#86d3ff'},{name:'RON',accent:'#ff9f7c'},{name:'EVE',accent:'#9ee59e'},{name:'NOVA',accent:'#d7a6ff'},{name:'ALTO',accent:'#ffd784'},{name:'KITE',accent:'#8be3d4'},{name:'LYRA',accent:'#f2a9d8'},{name:'PICO',accent:'#a9c5ff'},{name:'ARIA',accent:'#f7c59f'},{name:'NOX',accent:'#b4b0ff'},{name:'MILO',accent:'#9ed89e'},{name:'LUMA',accent:'#ffe58a'},{name:'ORBIT',accent:'#8fd8ff'},{name:'TESS',accent:'#e6b0ff'}];
export const RESEARCH={
 wallI:{cost:{crystal:8,stone:18},branch:'defense'},
 wallII:{cost:{crystal:14,iron:12,stone:24},requires:['wallI'],branch:'defense'},
 fortify:{cost:{crystal:20,iron:18,scrap:12},requires:['wallII'],branch:'defense'},
 corePlating:{cost:{crystal:18,iron:16},branch:'support'},
 powerGrid:{cost:{crystal:12,copper:16,quartz:6},branch:'support'},
 fieldRepair:{cost:{crystal:14,copper:12,iron:8},requires:['powerGrid'],branch:'support'},
 logistics:{cost:{crystal:12,iron:8,fiber:18,wood:24},branch:'logistics'},
 rescue:{cost:{crystal:14,herb:16,iron:6},branch:'support'},
 survey:{cost:{crystal:10,quartz:12,copper:6},branch:'exploration'}
};
