export const MAX_ROOM_PLAYERS=15;
export const MAPS=[{id:'test',name:'test',maxPlayers:MAX_ROOM_PLAYERS,description:'The first RE:BUILDFRONT test map.'}];
export const DIFFICULTIES=['easy','normal','hard'];

const tool=(type,tier,icon,damage,cooldown,gather)=>({kind:'tool',toolType:type,tier,stack:1,icon,damage,cooldown,gather});
export const ITEM_DEFS={
  woodSword:tool('sword','wood','🗡',24,.34,1),stoneSword:tool('sword','stone','⚔',32,.31,1),copperSword:tool('sword','copper','⚔',38,.28,1),ironSword:tool('sword','iron','⚔',46,.25,1),crystalSword:tool('sword','crystal','✧',58,.21,1),
  woodPickaxe:tool('pickaxe','wood','⛏',12,.62,1.05),stonePickaxe:tool('pickaxe','stone','⛏',16,.56,1.35),copperPickaxe:tool('pickaxe','copper','⛏',19,.50,1.6),ironPickaxe:tool('pickaxe','iron','⛏',23,.44,2),crystalPickaxe:tool('pickaxe','crystal','⛏',30,.36,2.7),
  woodAxe:tool('axe','wood','🪓',29,.82,1.1),stoneAxe:tool('axe','stone','🪓',38,.76,1.4),copperAxe:tool('axe','copper','🪓',45,.69,1.7),ironAxe:tool('axe','iron','🪓',54,.62,2.1),crystalAxe:tool('axe','crystal','🪓',68,.52,2.8),
  hammer:{kind:'tool',toolType:'hammer',tier:'iron',stack:1,icon:'🔨',damage:16,cooldown:.58,gather:0},
  armorShell:{kind:'armor',stack:1,icon:'◈',defense:.15},
  wood:{kind:'resource',stack:64,icon:'▥'},stone:{kind:'resource',stack:64,icon:'⬟'},fiber:{kind:'resource',stack:64,icon:'≋'},iron:{kind:'resource',stack:64,icon:'◆'},crystal:{kind:'resource',stack:64,icon:'✦'},quartz:{kind:'resource',stack:64,icon:'◇'},herb:{kind:'resource',stack:64,icon:'♧'},resin:{kind:'resource',stack:64,icon:'●'},scrap:{kind:'resource',stack:64,icon:'⌁'},copper:{kind:'resource',stack:64,icon:'⬢'},
  plank:{kind:'material',stack:64,icon:'▤'},cord:{kind:'material',stack:64,icon:'〰'},metalPlate:{kind:'material',stack:64,icon:'▣'},circuit:{kind:'material',stack:64,icon:'⌘'},
  workbench:{kind:'structure',structure:'workbench',stack:16,icon:'▧'},researchBench:{kind:'structure',structure:'researchBench',stack:8,icon:'⌬'},wallItem:{kind:'structure',structure:'wall',stack:64,icon:'▥'},generatorItem:{kind:'structure',structure:'generator',stack:16,icon:'◉'},relayItem:{kind:'structure',structure:'relay',stack:16,icon:'⌁'},depotItem:{kind:'structure',structure:'depot',stack:16,icon:'▤'}
};

const recipe=(id,station,ingredients,out,category='misc')=>({id,station,ingredients,out,category});
export const RECIPES=[
 recipe('plank','workbench',{wood:1},{id:'plank',count:4},'material'),recipe('cord','workbench',{fiber:2},{id:'cord',count:1},'material'),
 recipe('workbench','workbench',{plank:4},{id:'workbench',count:1},'station'),recipe('hammer','workbench',{plank:2,iron:2,cord:1},{id:'hammer',count:1},'tool'),recipe('researchBench','workbench',{plank:6,iron:4,circuit:1,crystal:2},{id:'researchBench',count:1},'station'),
 recipe('wallItem','workbench',{plank:4,stone:2},{id:'wallItem',count:2},'building'),recipe('generatorItem','workbench',{metalPlate:3,copper:5,circuit:1,crystal:2},{id:'generatorItem',count:1},'building'),recipe('relayItem','workbench',{plank:2,iron:3,copper:2,circuit:1},{id:'relayItem',count:1},'building'),recipe('depotItem','workbench',{plank:8,iron:2,cord:2},{id:'depotItem',count:1},'building'),
 recipe('metalPlate','workbench',{iron:4},{id:'metalPlate',count:1},'material'),recipe('circuit','workbench',{copper:3,quartz:1,scrap:2,crystal:1},{id:'circuit',count:1},'material'),recipe('armorShell','workbench',{metalPlate:5,fiber:2},{id:'armorShell',count:1},'armor'),
 ...['wood','stone','copper','iron','crystal'].flatMap((tier,i)=>{const mat=tier,qty=(2+i)>3?3:2;return [recipe(`${tier}Sword`,'workbench',{[mat]:qty,plank:1},{id:`${tier}Sword`,count:1},'weapon'),recipe(`${tier}Pickaxe`,'workbench',{[mat]:3,plank:2},{id:`${tier}Pickaxe`,count:1},'tool'),recipe(`${tier}Axe`,'workbench',{[mat]:3,plank:2},{id:`${tier}Axe`,count:1},'tool')]} )
];

export function makeInventory(size=36){return Array.from({length:size},()=>null)}
export function starterInventory(){const inv=makeInventory();inv[0]={id:'woodSword',count:1};inv[1]={id:'woodPickaxe',count:1};inv[2]={id:'woodAxe',count:1};inv[3]={id:'hammer',count:1};inv[4]={id:'workbench',count:1};return inv}
export function stackLimit(id,bonus=0){const base=ITEM_DEFS[id]?.stack||1;return ITEM_DEFS[id]?.kind==='resource'?base+bonus:base}
export function addItem(inv,id,count=1,stackBonus=0){const def=ITEM_DEFS[id];if(!def)return count;let left=count,limit=stackLimit(id,stackBonus);for(const slot of inv){if(slot?.id===id&&slot.count<limit){const put=Math.min(limit-slot.count,left);slot.count+=put;left-=put;if(!left)return 0}}for(let i=0;i<inv.length&&left;i++)if(!inv[i]){const put=Math.min(limit,left);inv[i]={id,count:put};left-=put}return left}
export function canFitItem(inv,id,count=1,stackBonus=0){const copy=inv.map(s=>s?{...s}:null);return addItem(copy,id,count,stackBonus)===0}
export const itemName=id=>id.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase());
export const ROOM_SEED=[{id:'demo-ko',name:'HEART Defense KR',description:'Casual test room',map:'test',difficulty:'normal',maxPlayers:6,players:3,language:'ko'},{id:'demo-en',name:'Frontline Test',description:'Open test session',map:'test',difficulty:'normal',maxPlayers:8,players:4,language:'en'}];
