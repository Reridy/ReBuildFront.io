export const MAPS=[{id:'test',name:'test',maxPlayers:15,description:'The first RE:BUILDFRONT test map.'}];
export const DIFFICULTIES=['easy','normal','hard'];
export const ITEM_DEFS={
 sword:{name:'Field Blade',kind:'tool',stack:1,icon:'⚔',desc:'Short-range starter tool for defending yourself.'},
 pickaxe:{name:'Survey Pick',kind:'tool',stack:1,icon:'⛏',desc:'Efficiently extracts ore and stone deposits.'},
 builderKit:{name:'Builder Kit',kind:'tool',stack:1,icon:'▦',desc:'Opens the construction blueprint selector.'},
 armorJacket:{name:'Reinforced Shell',kind:'armor',stack:1,icon:'◈',defense:.15,desc:'Single-slot armor that reduces incoming damage.'},
 wood:{name:'Wood',kind:'resource',stack:99,icon:'▥'},stone:{name:'Stone',kind:'resource',stack:99,icon:'⬟'},fiber:{name:'Fiber',kind:'resource',stack:99,icon:'≋'},iron:{name:'Iron',kind:'resource',stack:99,icon:'◆'},crystal:{name:'Crystal',kind:'resource',stack:99,icon:'✦'},quartz:{name:'Quartz',kind:'resource',stack:99,icon:'◇'},herb:{name:'Herb',kind:'resource',stack:99,icon:'♧'},resin:{name:'Resin',kind:'resource',stack:99,icon:'●'},scrap:{name:'Scrap',kind:'resource',stack:99,icon:'⌁'},copper:{name:'Copper',kind:'resource',stack:99,icon:'⬢'},
 plank:{name:'Board',kind:'material',stack:99,icon:'▤'},cord:{name:'Cord',kind:'material',stack:99,icon:'〰'},metalPlate:{name:'Metal Plate',kind:'material',stack:99,icon:'▣'},circuit:{name:'Circuit',kind:'material',stack:99,icon:'⌘'},
 workbench:{name:'Workbench',kind:'placeable',stack:16,icon:'▧'},grandWorkbench:{name:'Grand Workbench',kind:'placeable',stack:8,icon:'▨'},wallPack:{name:'Wall Blueprint Pack',kind:'build',stack:32,icon:'▥'},trapPack:{name:'Trap Blueprint Pack',kind:'build',stack:16,icon:'⌗'},turretPack:{name:'Turret Blueprint Pack',kind:'build',stack:8,icon:'◎'},generatorPack:{name:'Generator Blueprint Pack',kind:'build',stack:8,icon:'◉'}
};
export const RECIPES=[
 {id:'board',size:2,pattern:[['wood',null],[null,null]],out:{id:'plank',count:2}},
 {id:'cord',size:2,pattern:[['fiber','fiber'],[null,null]],out:{id:'cord',count:1}},
 {id:'workbench',size:2,pattern:[['plank','plank'],['plank','plank']],out:{id:'workbench',count:1}},
 {id:'wallPack',size:2,pattern:[['plank','stone'],['stone','plank']],out:{id:'wallPack',count:2}},
 {id:'armorJacket',size:3,pattern:[['metalPlate',null,'metalPlate'],['metalPlate','fiber','metalPlate'],[null,'metalPlate',null]],out:{id:'armorJacket',count:1}},
 {id:'metalPlate',size:3,pattern:[['iron','iron',null],['iron','iron',null],[null,null,null]],out:{id:'metalPlate',count:1}},
 {id:'circuit',size:3,pattern:[['copper','quartz','copper'],['scrap','crystal','scrap'],[null,'copper',null]],out:{id:'circuit',count:1}},
 {id:'grandWorkbench',size:3,pattern:[['metalPlate','plank','metalPlate'],['plank','workbench','plank'],['metalPlate','plank','metalPlate']],out:{id:'grandWorkbench',count:1}},
 {id:'turretPack',size:4,pattern:[['metalPlate','metalPlate',null,null],['circuit','crystal',null,null],['metalPlate','copper',null,null],[null,null,null,null]],out:{id:'turretPack',count:1}},
 {id:'generatorPack',size:4,pattern:[['copper','circuit','copper',null],['metalPlate','crystal','metalPlate',null],['copper','quartz','copper',null],[null,null,null,null]],out:{id:'generatorPack',count:1}}
];
export function makeInventory(size=36){return Array.from({length:size},()=>null)}
export function starterInventory(){const inv=makeInventory();inv[0]={id:'sword',count:1};inv[1]={id:'pickaxe',count:1};inv[2]={id:'builderKit',count:1};return inv}
export function addItem(inv,id,count=1){const def=ITEM_DEFS[id];if(!def)return count;let left=count;for(const slot of inv){if(slot?.id===id&&slot.count<def.stack){const room=def.stack-slot.count,put=Math.min(room,left);slot.count+=put;left-=put;if(!left)return 0}}for(let i=0;i<inv.length&&left;i++){if(!inv[i]){const put=Math.min(def.stack,left);inv[i]={id,count:put};left-=put}}return left}
export function removeItem(inv,id,count=1){let left=count;for(let i=inv.length-1;i>=0&&left;i--){const s=inv[i];if(s?.id!==id)continue;const take=Math.min(s.count,left);s.count-=take;left-=take;if(s.count<=0)inv[i]=null}return left===0}
export const ROOM_SEED=[
 {id:'demo-ko',name:'HEART Defense KR',description:'Casual test room',map:'test',difficulty:'normal',maxPlayers:6,players:3,language:'ko'},
 {id:'demo-en',name:'Frontline Test',description:'Open test session',map:'test',difficulty:'normal',maxPlayers:8,players:4,language:'en'}
];
