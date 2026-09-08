const LABELS={
 en:{move:'Move layer',lasso:'Lasso',deselect:'Deselect',hint:'Drag the selected layer or draw a freeform selection.'},
 ko:{move:'레이어 이동',lasso:'올가미',deselect:'선택 해제',hint:'레이어 전체를 이동하거나 자유형 선택 영역을 그리세요.'},
 ja:{move:'レイヤー移動',lasso:'なげなわ',deselect:'選択解除',hint:'レイヤー全体を移動するか、自由選択範囲を描きます。'},
 zh:{move:'移动图层',lasso:'套索',deselect:'取消选择',hint:'移动整个图层，或绘制自由选区。'}
};
const locale=()=>{const l=(document.documentElement.lang||'en').toLowerCase();return l.startsWith('ko')?'ko':l.startsWith('ja')?'ja':l.startsWith('zh')?'zh':'en'};
const tr=k=>LABELS[locale()]?.[k]||LABELS.en[k]||k;
const copyCanvas=src=>{const c=document.createElement('canvas');c.width=c.height=512;c.getContext('2d').drawImage(src,0,0);return c};
const inside=(p,pts)=>{let hit=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if(((a.y>p.y)!=(b.y>p.y))&&(p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y||1e-9)+a.x))hit=!hit}return hit};
function install(editor){
 if(editor.dataset.selectionTools==='1')return;const paint=editor.querySelector('#psPaint'),stack=editor.querySelector('#psCanvasStack'),tools=editor.querySelector('.ps-tools');if(!paint||!stack||!tools)return;editor.dataset.selectionTools='1';
 const overlay=document.createElement('canvas');overlay.id='psSelectOverlay';overlay.width=overlay.height=512;stack.appendChild(overlay);const ox=overlay.getContext('2d');
 const moveBtn=document.createElement('button');moveBtn.className='btn';moveBtn.dataset.advancedTool='move';moveBtn.textContent=`✥ ${tr('move')}`;
 const lassoBtn=document.createElement('button');lassoBtn.className='btn';lassoBtn.dataset.advancedTool='lasso';lassoBtn.textContent=`⌁ ${tr('lasso')}`;
 const clearBtn=document.createElement('button');clearBtn.className='btn tiny ps-deselect hidden';clearBtn.textContent=tr('deselect');tools.insertBefore(moveBtn,tools.querySelector('[data-act="undo"]'));tools.insertBefore(lassoBtn,tools.querySelector('[data-act="undo"]'));tools.appendChild(clearBtn);
 const hint=document.createElement('span');hint.className='ps-transform-hint muted';hint.textContent=tr('hint');tools.parentElement?.appendChild(hint);
 const originalDown=paint.onpointerdown?.bind(paint),originalMove=paint.onpointermove?.bind(paint),originalUp=paint.onpointerup?.bind(paint),originalCancel=paint.onpointercancel?.bind(paint);
 let mode=null,selection=null,lasso=[],drag=null,lastPointer=null;
 const point=e=>{const r=paint.getBoundingClientRect();return{x:(e.clientX-r.left)*512/r.width,y:(e.clientY-r.top)*512/r.height}};
 const path=(ctx,pts)=>{if(!pts?.length)return;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.closePath()};
 const drawOutline=(pts=selection)=>{ox.clearRect(0,0,512,512);const p=Array.isArray(pts)?pts:pts?.points;if(!p||p.length<2){clearBtn.classList.add('hidden');return}clearBtn.classList.remove('hidden');ox.save();ox.lineWidth=1.5;ox.strokeStyle='#fff';ox.setLineDash([7,5]);path(ox,p);ox.stroke();ox.strokeStyle='#111';ox.lineDashOffset=6;ox.stroke();ox.restore()};
 const deselect=()=>{selection=null;lasso=[];drag=null;drawOutline(null)};
 const editable=()=>{const row=editor.querySelector('.ps-layer.active');return !row?.querySelector('[data-lock]')?.textContent.includes('🔒')&&paint.style.opacity!=='0'};
 const forceSnapshot=e=>{editor.querySelector('[data-tool="brush"]')?.click();originalDown?.(e)};
 const finishCommit=e=>originalUp?.(e);
 const extract=cut=>{if(!selection?.points?.length)return null;const c=document.createElement('canvas'),x=c.getContext('2d');c.width=c.height=512;x.save();path(x,selection.points);x.clip();x.drawImage(paint,0,0);x.restore();if(cut){const px=paint.getContext('2d');px.save();px.globalCompositeOperation='destination-out';path(px,selection.points);px.fill();px.restore()}return c};
 const activate=next=>{mode=next;deselect();editor.querySelectorAll('[data-advanced-tool]').forEach(b=>b.classList.toggle('primary',b.dataset.advancedTool===next));editor.querySelectorAll('[data-tool]').forEach(b=>b.classList.remove('primary'));paint.style.cursor=next==='move'?'move':'crosshair'};
 moveBtn.onclick=()=>activate('move');lassoBtn.onclick=()=>activate('lasso');clearBtn.onclick=deselect;
 editor.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>{mode=null;deselect();editor.querySelectorAll('[data-advanced-tool]').forEach(x=>x.classList.remove('primary'));paint.style.cursor='crosshair'}));
 editor.querySelector('#psLayerList')?.addEventListener('click',()=>setTimeout(deselect,0));
 paint.onpointerdown=e=>{lastPointer=e;if(!mode)return originalDown?.(e);if(!editable())return;const p=point(e);
  if(mode==='move'){forceSnapshot(e);drag={kind:'layer',start:p,base:copyCanvas(paint)};paint.setPointerCapture?.(e.pointerId);return}
  if(selection?.points?.length>2&&inside(p,selection.points)){forceSnapshot(e);const floating=extract(true),base=copyCanvas(paint);drag={kind:'selection',start:p,base,floating,points:selection.points.map(q=>({...q}))};paint.setPointerCapture?.(e.pointerId);return}
  selection=null;lasso=[p];drag={kind:'lasso'};drawOutline(lasso);paint.setPointerCapture?.(e.pointerId)
 };
 paint.onpointermove=e=>{lastPointer=e;if(!mode)return originalMove?.(e);if(!drag)return;const p=point(e),px=paint.getContext('2d');
  if(drag.kind==='layer'){const dx=p.x-drag.start.x,dy=p.y-drag.start.y;px.clearRect(0,0,512,512);px.drawImage(drag.base,dx,dy);return}
  if(drag.kind==='selection'){const dx=p.x-drag.start.x,dy=p.y-drag.start.y;px.clearRect(0,0,512,512);px.drawImage(drag.base,0,0);px.drawImage(drag.floating,dx,dy);drawOutline(drag.points.map(q=>({x:q.x+dx,y:q.y+dy})));return}
  lasso.push(p);drawOutline(lasso)
 };
 const end=e=>{lastPointer=e||lastPointer;if(!mode)return (e?.type==='pointercancel'?originalCancel:originalUp)?.(e);if(!drag)return;const p=e?.clientX!=null?point(e):null;
  if(drag.kind==='layer'){finishCommit(e);drag=null;return}
  if(drag.kind==='selection'){const dx=(p?.x??drag.start.x)-drag.start.x,dy=(p?.y??drag.start.y)-drag.start.y;selection={points:drag.points.map(q=>({x:q.x+dx,y:q.y+dy}))};finishCommit(e);drag=null;drawOutline();return}
  if(lasso.length>2)selection={points:lasso.slice()};else selection=null;lasso=[];drag=null;drawOutline()
 };
 paint.onpointerup=end;paint.onpointercancel=end;
 window.addEventListener('keydown',e=>{if(!document.getElementById('rbfPsEditor')||/INPUT|TEXTAREA/.test(document.activeElement?.tagName||''))return;const key=e.key.toLowerCase();if(!e.ctrlKey&&!e.metaKey&&key==='v'){e.preventDefault();activate('move')}else if(!e.ctrlKey&&!e.metaKey&&key==='l'){e.preventDefault();activate('lasso')}else if(e.key==='Escape'&&selection){e.preventDefault();deselect()}else if(e.key==='Delete'&&selection&&editable()){
   e.preventDefault();const r=paint.getBoundingClientRect(),q=selection.points[0],fake={clientX:r.left+q.x*r.width/512,clientY:r.top+q.y*r.height/512,pointerId:-1};forceSnapshot(fake);extract(true);finishCommit(fake);deselect()
  }} ,true);
}
const obs=new MutationObserver(()=>{const e=document.getElementById('rbfPsEditor');if(e)install(e)});obs.observe(document.getElementById('appRoot'),{childList:true,subtree:true});install(document.getElementById('rbfPsEditor'));
