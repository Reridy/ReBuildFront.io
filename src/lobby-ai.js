const AI_NAMES=['MIKA','RON','EVE','NOVA','ALTO','KITE','LYRA','PICO','ARIA','NOX','MILO','LUMA','ORBIT','TESS'];
const LABELS={
  en:{add:'Add AI player',remove:'Remove AI',ai:'AI player',ready:'Auto ready',limit:'Room is full'},
  ko:{add:'AI 플레이어 추가',remove:'AI 제거',ai:'AI 플레이어',ready:'자동 준비 완료',limit:'방 인원이 가득 찼습니다'},
  ja:{add:'AIプレイヤーを追加',remove:'AIを削除',ai:'AIプレイヤー',ready:'自動準備完了',limit:'ルームが満員です'},
  zh:{add:'添加AI玩家',remove:'移除AI',ai:'AI玩家',ready:'自动准备',limit:'房间已满'}
};
const root=document.getElementById('appRoot');
const lang=()=>{const l=(document.documentElement.lang||'en').toLowerCase();return l.startsWith('ko')?'ko':l.startsWith('ja')?'ja':l.startsWith('zh')?'zh':'en'};
const text=k=>LABELS[lang()]?.[k]||LABELS.en[k];
const getCount=()=>Math.max(0,Math.min(14,Number(sessionStorage.getItem('rbf.aiCount'))||0));
const setCount=n=>{sessionStorage.setItem('rbf.aiCount',String(Math.max(0,Math.min(14,n))));window.dispatchEvent(new CustomEvent('rbf-ai-count',{detail:getCount()}));apply();};

function applyQuickPlayDefault(){
  const box=root?.querySelector('#sameLang');
  if(!box||box.dataset.rbfDefaultApplied)return;
  box.checked=false;
  box.dataset.rbfDefaultApplied='1';
  sessionStorage.setItem('rbf.aiCount','0');
}

function applyLobbyAI(){
  const lobby=root?.querySelector('.lobby-grid');
  const start=root?.querySelector('#startGame');
  if(!lobby||!start)return;
  const aside=lobby.querySelector('aside.panel');
  if(!aside)return;
  aside.querySelectorAll('[data-rbf-ai-row]').forEach(el=>el.remove());
  aside.querySelector('#rbfAiControls')?.remove();
  const humanRows=[...aside.querySelectorAll('.player-row')];
  const maxAI=Math.max(0,15-humanRows.length);
  let count=Math.min(getCount(),maxAI);
  if(count!==getCount())sessionStorage.setItem('rbf.aiCount',String(count));
  const anchor=aside.querySelector('div[style*="margin-top"]');
  for(let i=0;i<count;i++){
    const row=document.createElement('div');
    row.className='player-row';
    row.dataset.rbfAiRow='1';
    row.innerHTML=`<span>${AI_NAMES[i]||`AI-${i+1}`} <small>AI</small></span><span class="ready">${text('ready')}</span>`;
    aside.insertBefore(row,anchor||null);
  }
  const controls=document.createElement('div');
  controls.id='rbfAiControls';
  controls.className='row';
  controls.style.marginTop='10px';
  controls.innerHTML=`<button id="rbfAddAI" class="btn" ${count>=maxAI?'disabled':''}>+ ${text('add')}</button><button id="rbfRemoveAI" class="btn" ${count<=0?'disabled':''}>− ${text('remove')}</button><small class="muted">${text('ai')}: ${count} / ${maxAI}</small>`;
  if(anchor)aside.insertBefore(controls,anchor);else aside.appendChild(controls);
  controls.querySelector('#rbfAddAI').onclick=()=>{if(getCount()>=maxAI)return;setCount(getCount()+1)};
  controls.querySelector('#rbfRemoveAI').onclick=()=>setCount(getCount()-1);
}

function apply(){applyQuickPlayDefault();applyLobbyAI()}
const observer=new MutationObserver(()=>queueMicrotask(apply));
if(root)observer.observe(root,{childList:true,subtree:true});
window.addEventListener('rbf-language',apply);
apply();
