const AI_NAMES=['MIKA','RON','EVE','NOVA','ALTO','KITE','LYRA','PICO','ARIA','NOX','MILO','LUMA','ORBIT','TESS'];
const LABELS={
  en:{add:'Add AI player',remove:'Remove AI',ai:'AI player',ready:'Auto ready'},
  ko:{add:'AI 플레이어 추가',remove:'AI 제거',ai:'AI 플레이어',ready:'자동 준비 완료'},
  ja:{add:'AIプレイヤーを追加',remove:'AIを削除',ai:'AIプレイヤー',ready:'自動準備完了'},
  zh:{add:'添加AI玩家',remove:'移除AI',ai:'AI玩家',ready:'自动准备'}
};
const root=document.getElementById('appRoot');
const lang=()=>{const l=(document.documentElement.lang||'en').toLowerCase();return l.startsWith('ko')?'ko':l.startsWith('ja')?'ja':l.startsWith('zh')?'zh':'en'};
const text=k=>LABELS[lang()]?.[k]||LABELS.en[k];
const getCount=()=>Math.max(0,Math.min(14,Number(sessionStorage.getItem('rbf.aiCount'))||0));
const setCount=n=>{sessionStorage.setItem('rbf.aiCount',String(Math.max(0,Math.min(14,n))));window.dispatchEvent(new CustomEvent('rbf-ai-count',{detail:getCount()}));scheduleApply(true)};
let scheduled=false,forceNext=false;

function applyQuickPlayDefault(){
  const box=root?.querySelector('#sameLang');
  if(!box||box.dataset.rbfDefaultApplied)return;
  box.checked=false;
  box.dataset.rbfDefaultApplied='1';
  sessionStorage.setItem('rbf.aiCount','0');
}

function applyLobbyAI(force=false){
  const lobby=root?.querySelector('.lobby-grid');
  const start=root?.querySelector('#startGame');
  if(!lobby||!start)return;
  const aside=lobby.querySelector('aside.panel');
  if(!aside)return;
  const existingRows=[...aside.querySelectorAll('.player-row:not([data-rbf-ai-row])')];
  const maxAI=Math.max(0,15-existingRows.length);
  const count=Math.min(getCount(),maxAI);
  if(count!==getCount())sessionStorage.setItem('rbf.aiCount',String(count));
  const signature=`${lang()}:${existingRows.length}:${count}:${maxAI}`;
  const controls=aside.querySelector('#rbfAiControls');
  const aiRows=aside.querySelectorAll('[data-rbf-ai-row]');
  if(!force&&controls?.dataset.signature===signature&&aiRows.length===count)return;
  aiRows.forEach(el=>el.remove());
  controls?.remove();
  const anchor=aside.querySelector('div[style*="margin-top"]');
  for(let i=0;i<count;i++){
    const row=document.createElement('div');
    row.className='player-row';
    row.dataset.rbfAiRow='1';
    row.innerHTML=`<span>${AI_NAMES[i]||`AI-${i+1}`} <small>AI</small></span><span class="ready">${text('ready')}</span>`;
    aside.insertBefore(row,anchor||null);
  }
  const next=document.createElement('div');
  next.id='rbfAiControls';
  next.dataset.signature=signature;
  next.className='row';
  next.style.marginTop='10px';
  next.innerHTML=`<button id="rbfAddAI" class="btn" ${count>=maxAI?'disabled':''}>+ ${text('add')}</button><button id="rbfRemoveAI" class="btn" ${count<=0?'disabled':''}>− ${text('remove')}</button><small class="muted">${text('ai')}: ${count} / ${maxAI}</small>`;
  if(anchor)aside.insertBefore(next,anchor);else aside.appendChild(next);
  next.querySelector('#rbfAddAI').onclick=()=>setCount(count+1);
  next.querySelector('#rbfRemoveAI').onclick=()=>setCount(count-1);
}

function apply(force=false){applyQuickPlayDefault();applyLobbyAI(force)}
function scheduleApply(force=false){forceNext=forceNext||force;if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;const f=forceNext;forceNext=false;apply(f)})}
const observer=new MutationObserver(()=>scheduleApply(false));
if(root)observer.observe(root,{childList:true,subtree:true});
window.addEventListener('rbf-language',()=>scheduleApply(true));
apply();
