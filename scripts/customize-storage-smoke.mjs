import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../src/storage-migration.js',import.meta.url),'utf8');
function run(seed={}){
  const data=new Map(Object.entries(seed));
  const localStorage={
    getItem:k=>data.has(k)?data.get(k):null,
    setItem:(k,v)=>data.set(k,String(v)),
    removeItem:k=>data.delete(k)
  };
  vm.runInNewContext(source,{localStorage});
  return data;
}
const assert=(ok,msg)=>{if(!ok)throw new Error(`CUSTOMIZE STORAGE FAIL: ${msg}`)};
const img='data:image/png;base64,AAAA';
let data=run();
assert(data.get('rbf.templates')==='[]','fresh users must receive an empty template array');
data=run({'rbf.templates':'null'});
assert(data.get('rbf.templates')==='[]','legacy null templates must migrate to []');
data=run({'rbf.templates':JSON.stringify({src:img})});
assert(JSON.parse(data.get('rbf.templates'))[0]===img,'legacy single template object must migrate');
data=run({'rbf.templates':JSON.stringify([null,'broken',{dataUrl:img},img]),'rbf.activeAvatar':'broken'});
assert(JSON.stringify(JSON.parse(data.get('rbf.templates')))==JSON.stringify([img]),'invalid and duplicate templates must be removed');
assert(!data.has('rbf.activeAvatar'),'invalid active avatar must be removed');
console.log('Customization storage migration checks passed.');
