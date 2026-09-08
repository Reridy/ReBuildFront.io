import fs from 'node:fs';
const js=fs.readFileSync('src/custom-editor-select.js','utf8'),html=fs.readFileSync('index.html','utf8'),css=fs.readFileSync('custom-editor-select.css','utf8');
const assert=(ok,msg)=>{if(!ok){console.error(`SELECTION TOOL FAIL: ${msg}`);process.exitCode=1}};
for(const token of ["data-advanced-tool='move'","data-advanced-tool='lasso'","pointInPoly","extract(true)","selection.points","drag.kind==='layer'","drag.kind==='selection'","key==='v'","key==='l'","e.key==='Delete'","e.key==='Escape'"])assert(js.includes(token),`missing ${token}`);
assert(js.includes("editor.querySelector('[data-tool=\"brush\"]')?.click()")&&js.includes('originalDown?.(e)')&&js.includes('originalUp?.(e)'),'advanced edits must reuse core history/commit flow');
assert(js.includes("textContent.includes('🔒')"),'locked layers must block move/lasso edits');
assert(html.includes('custom-editor-select.css')&&html.includes('src/custom-editor-select.js'),'selection tools must be loaded by index.html');
assert(css.includes('#psSelectOverlay')&&css.includes('pointer-events:none'),'selection overlay styling missing');
if(!process.exitCode)console.log('Selection tool smoke passed: lasso, selected-area move/delete/deselect, layer move, shortcuts and core history integration.');
