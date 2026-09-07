export const MAX_ROOM_PLAYERS=15;
export const MAPS=[{id:'test',name:'test',maxPlayers:MAX_ROOM_PLAYERS,description:'The first RE:BUILDFRONT test map.'}];
export const DIFFICULTIES=['easy','normal','hard'];

export const ITEM_DEFS={
  fieldTool:{kind:'tool',stack:1,icon:'◌'},
  surveyTool:{kind:'tool',stack:1,icon:'⌁'},
  builderKit:{kind:'tool',stack:1,icon:'▦'},
  armorShell:{kind:'armor',stack:1,icon:'◈',defense:.15},
  wood:{kind:'resource',stack:99,icon:'▥'},stone:{kind:'resource',stack:99,icon:'⬟'},fiber:{kind:'resource',stack:99,icon:'≋'},iron:{kind:'resource',stack:99,icon:'◆'},
  crystal:{kind:'resource',stack:99,icon:'✦'},quartz:{kind:'resource',stack:99,icon:'◇'},herb:{kind:'resource',stack:99,icon:'♧'},resin:{kind:'resource',stack:99,icon:'●'},scrap:{kind:'resource',stack:99,icon:'⌁'},copper:{kind:'resource',stack:99,icon:'⬢'},
  plank:{kind:'material',stack:99,icon:'▤'},cord:{kind:'material',stack:99,icon:'〰'},metalPlate:{kind:'material',stack:99,icon:'▣'},circuit:{kind:'material',stack:99,icon:'⌘'},
  workbench:{kind:'placeable',stack:16,icon:'▧',gridW:2,gridH:2,hp:180,color:'#8a6c4d'},
  grandWorkbench:{kind:'placeable',stack:8,icon:'▨',gridW:3,gridH:3,hp:320,color:'#756a82'}
};

export const RECIPES=[
  {id:'plank',size:2,pattern:[['wood',null],[null,null]],out:{id:'plank',count:2}},
  {id:'cord',size:2,pattern:[['fiber','fiber'],[null,null]],out:{id:'cord',count:1}},
  {id:'workbench',size:2,pattern:[['plank','plank'],['plank','plank']],out:{id:'workbench',count:1}},
  {id:'metalPlate',size:3,pattern:[['iron','iron',null],['iron','iron',null],[null,null,null]],out:{id:'metalPlate',count:1}},
  {id:'circuit',size:3,pattern:[['copper','quartz','copper'],['scrap','crystal','scrap'],[null,'copper',null]],out:{id:'circuit',count:1}},
  {id:'armorShell',size:3,pattern:[['metalPlate',null,'metalPlate'],['metalPlate','fiber','metalPlate'],[null,'metalPlate',null]],out:{id:'armorShell',count:1}},
  {id:'grandWorkbench',size:3,pattern:[['metalPlate','plank','metalPlate'],['plank','workbench','plank'],['metalPlate','plank','metalPlate']],out:{id:'grandWorkbench',count:1}}
];

export function makeInventory(size=36){return Array.from({length:size},()=>null)}
export function starterInventory(){const inv=makeInventory();inv[0]={id:'fieldTool',count:1};inv[1]={id:'surveyTool',count:1};inv[2]={id:'builderKit',count:1};return inv}
export function stackLimit(id,bonus=0){const base=ITEM_DEFS[id]?.stack||1;return ITEM_DEFS[id]?.kind==='resource'?base+bonus:base}
export function addItem(inv,id,count=1,stackBonus=0){const def=ITEM_DEFS[id];if(!def)return count;let left=count,limit=stackLimit(id,stackBonus);for(const slot of inv){if(slot?.id===id&&slot.count<limit){const room=limit-slot.count,put=Math.min(room,left);slot.count+=put;left-=put;if(!left)return 0}}for(let i=0;i<inv.length&&left;i++){if(!inv[i]){const put=Math.min(limit,left);inv[i]={id,count:put};left-=put}}return left}
export function canFitItem(inv,id,count=1,stackBonus=0){const copy=inv.map(s=>s?{...s}:null);return addItem(copy,id,count,stackBonus)===0}

export const ROOM_SEED=[
  {id:'demo-ko',name:'HEART Defense KR',description:'Casual test room',map:'test',difficulty:'normal',maxPlayers:6,players:3,language:'ko'},
  {id:'demo-en',name:'Frontline Test',description:'Open test session',map:'test',difficulty:'normal',maxPlayers:8,players:4,language:'en'}
];
