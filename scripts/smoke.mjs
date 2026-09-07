import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const assert=(ok,msg)=>{if(!ok){console.error(`SMOKE FAIL: ${msg}`);process.exitCode=1}};

const required=['index.html','overhaul.css','quality.css','mobile.css','manifest.webmanifest','src/app.js','src/game.js','src/config.js','src/data.js','src/i18n.js','src/mobile-controls.js','src/error-boundary.js','server/server.js'];
for(const file of required)assert(exists(file),`missing required file ${file}`);
const forbidden=['src/app-v3.js','src/data-v2.js','src/game-v5.js','src/game-v6.js','src/game-v9.js','src/lobby-ai.js','src/lobby-ux.js','styles.css'];
for(const file of forbidden)assert(!exists(file),`legacy file should be removed: ${file}`);

const html=read('index.html');
for(const ref of ['overhaul.css','quality.css','mobile.css','src/error-boundary.js','src/app.js','src/game.js','src/mobile-controls.js'])assert(html.includes(ref),`index.html does not reference ${ref}`);
for(const stale of forbidden)assert(!html.includes(stale),`index.html still references ${stale}`);
for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){const ref=m[1];if(/^(https?:|data:|#)/.test(ref))continue;assert(exists(ref),`index reference does not exist: ${ref}`)}

const manifest=JSON.parse(read('manifest.webmanifest'));
assert(manifest.name?.includes('RE:BUILDFRONT'),'manifest name is missing');
assert(manifest.display==='standalone','manifest should use standalone display');

const [{SUPPORTED_LANGUAGES,STRINGS},{MAX_ROOM_PLAYERS,MAPS,ITEM_DEFS},{ZONES,AI_PLAYERS,BUILDINGS,RESEARCH,RESOURCES}]=await Promise.all([
  import(pathToFileURL(path.join(root,'src/i18n.js'))),import(pathToFileURL(path.join(root,'src/data.js'))),import(pathToFileURL(path.join(root,'src/config.js')))
]);
assert(JSON.stringify(SUPPORTED_LANGUAGES)===JSON.stringify(['en','ko','ja','zh']),'supported languages must be en/ko/ja/zh');
for(const lang of SUPPORTED_LANGUAGES)assert(STRINGS[lang],`missing translation table ${lang}`);
assert(MAX_ROOM_PLAYERS===15,'room hard cap must be 15');
for(const map of MAPS)assert(map.maxPlayers<=MAX_ROOM_PLAYERS,`map ${map.id} exceeds room cap`);
assert(ZONES.length>=6,'map should expose at least six resource zones');
assert(AI_PLAYERS.length>=14,'AI roster should be able to fill a 15-player room with one human');
for(const id of ['wall','generator','relay','depot'])assert(BUILDINGS[id],`missing building ${id}`);
for(const id of ['wallI','wallII','fortify','corePlating','powerGrid','fieldRepair','logistics','rescue','survey'])assert(RESEARCH[id],`missing research ${id}`);

const app=read('src/app.js'),game=read('src/game.js'),server=read('server/server.js');
assert(app.includes('MAX_ROOM_PLAYERS'),'app must consume shared room cap');
assert(app.includes('countdown'),'app should contain lobby countdown logic');
assert(app.includes('lobbyChat'),'app should contain integrated lobby chat');
assert(app.includes('id="lMap"'),'host must be able to edit the map from the lobby');
assert(app.includes("cancelReady:'준비 취소'"),'Korean ready-cancel action must be distinct from unready state');
assert(app.includes('rewardUnavailable')&&!app.includes('catch{state.custom.uploadUnlocked=true}'),'failed reward service must not unlock image upload');
assert(game.includes("'overtime'")||game.includes('"overtime"'),'game should support overtime instead of deleting living enemies');
assert(game.includes('paused'),'game should expose pause state');
assert(game.includes('waypoint'),'game should expose minimap waypoint state');
for(const lang of SUPPORTED_LANGUAGES)assert(new RegExp(`(?:^|[,\\s])${lang}:\\{`).test(game),`game-local translation table missing ${lang}`);
assert(/\bMAX_PLAYERS\s*=\s*15\b/.test(server),'server room cap must be 15');
assert(server.includes("socket.on('add-ai'")&&server.includes("socket.on('remove-ai'"),'server must support lobby AI slots');
assert(server.includes("r.map=cfg?.map==='test'?'test':r.map"),'server room config must accept map updates');
assert(server.includes('Number.isFinite(rawVolume)'),'server must sanitize account volume values');

const sharedKeys=new Set();
for(const source of [app,game])for(const m of source.matchAll(/\bbase\(['"]([A-Za-z0-9_]+)['"]\)/g))sharedKeys.add(m[1]);
const dynamicKeys=new Set([
  ...Object.keys(RESOURCES).flatMap(id=>[`res_${id}`,`item_${id}`]),
  ...ZONES.map(z=>`zone_${z.id}`),
  ...Object.keys(BUILDINGS).map(id=>`build_${id}`),
  ...Object.keys(RESEARCH).map(id=>`research_${id}`),
  ...Object.keys(ITEM_DEFS).map(id=>ITEM_DEFS[id].kind==='resource'?`res_${id}`:`item_${id}`)
]);
for(const key of [...sharedKeys,...dynamicKeys])for(const lang of SUPPORTED_LANGUAGES)assert(Object.prototype.hasOwnProperty.call(STRINGS[lang],key),`missing ${lang} translation for ${key}`);
assert(STRINGS.ko.unready==='준비중','Korean unready state must read 준비중');
for(const id of Object.keys(RESOURCES))for(const lang of SUPPORTED_LANGUAGES)assert(STRINGS[lang][`item_${id}`]===STRINGS[lang][`res_${id}`],`${lang} resource item alias missing for ${id}`);

if(!process.exitCode)console.log(`Smoke checks passed: ${required.length} required files, ${sharedKeys.size} shared keys, ${dynamicKeys.size} dynamic keys, ${ZONES.length} zones, ${AI_PLAYERS.length} AI profiles.`);
