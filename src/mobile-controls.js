const gameRoot=document.getElementById('gameRoot');
const coarse=()=>window.matchMedia?.('(pointer: coarse)').matches||window.innerWidth<=900;
let cleanup=null;

const labels={
  en:{action:'ACT',dash:'DASH',interact:'USE',inventory:'BAG',chat:'CHAT',build:'BUILD',squad:'SQUAD',rotate:'Landscape is recommended for easier control.'},
  ko:{action:'행동',dash:'대시',interact:'사용',inventory:'가방',chat:'채팅',build:'건설',squad:'분대',rotate:'조작하기 편하도록 가로 화면을 권장합니다.'},
  ja:{action:'行動',dash:'ダッシュ',interact:'使用',inventory:'バッグ',chat:'チャット',build:'建築',squad:'分隊',rotate:'操作しやすい横画面を推奨します。'},
  zh:{action:'行动',dash:'冲刺',interact:'使用',inventory:'背包',chat:'聊天',build:'建造',squad:'小队',rotate:'建议横屏游玩以便操作。'}
};
function lang(){const l=(document.documentElement.lang||'en').toLowerCase();return l.startsWith('ko')?'ko':l.startsWith('ja')?'ja':l.startsWith('zh')?'zh':'en'}
function t(k){return labels[lang()]?.[k]||labels.en[k]}
function key(type,key,code=key){window.dispatchEvent(new KeyboardEvent(type,{key,code,bubbles:true,cancelable:true}))}
function tapKey(keyName,code=keyName){key('keydown',keyName,code);setTimeout(()=>key('keyup',keyName,code),45)}
function mouse(canvas,type,x,y,buttons=0){canvas.dispatchEvent(new MouseEvent(type,{clientX:x,clientY:y,button:0,buttons,bubbles:true,cancelable:true}))}

function init(){
  if(cleanup||!coarse())return;
  const shell=gameRoot?.querySelector('.game-shell'),arena=gameRoot?.querySelector('.arena-wrap'),canvas=gameRoot?.querySelector('#gameCanvas');
  if(!shell||!arena||!canvas)return;
  shell.classList.add('mobile-mode');
  const layer=document.createElement('div');
  layer.className='mobile-controls';
  layer.innerHTML=`
    <div class="mobile-rotate-hint">${t('rotate')}</div>
    <div class="mobile-stick" aria-label="Move"><div class="mobile-stick-knob"></div></div>
    <div class="mobile-actions">
      <button type="button" data-mobile="action" class="mobile-action primary">${t('action')}</button>
      <button type="button" data-mobile="dash" class="mobile-action">${t('dash')}</button>
      <button type="button" data-mobile="interact" class="mobile-action">${t('interact')}</button>
      <button type="button" data-mobile="inventory" class="mobile-action">${t('inventory')}</button>
      <button type="button" data-mobile="chat" class="mobile-action">${t('chat')}</button>
    </div>
    <div class="mobile-drawers">
      <button type="button" data-mobile="build" class="mobile-drawer-btn">${t('build')}</button>
      <button type="button" data-mobile="squad" class="mobile-drawer-btn">${t('squad')}</button>
    </div>`;
  arena.appendChild(layer);

  const pressed=new Set();
  const syncKeys=next=>{
    for(const k of [...pressed])if(!next.has(k)){key('keyup',k,`Key${k.toUpperCase()}`);pressed.delete(k)}
    for(const k of next)if(!pressed.has(k)){key('keydown',k,`Key${k.toUpperCase()}`);pressed.add(k)}
  };
  const stick=layer.querySelector('.mobile-stick'),knob=layer.querySelector('.mobile-stick-knob');
  let stickId=null;
  const updateStick=e=>{
    const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.32,m=Math.hypot(dx,dy)||1,scale=Math.min(1,max/m),x=dx*scale,y=dy*scale;
    knob.style.transform=`translate(${x}px,${y}px)`;
    const nx=dx/Math.max(1,r.width*.24),ny=dy/Math.max(1,r.height*.24),next=new Set();
    if(ny<-.35)next.add('w');if(ny>.35)next.add('s');if(nx<-.35)next.add('a');if(nx>.35)next.add('d');syncKeys(next);
  };
  const stopStick=()=>{stickId=null;knob.style.transform='translate(0,0)';syncKeys(new Set())};
  stick.addEventListener('pointerdown',e=>{stickId=e.pointerId;stick.setPointerCapture?.(e.pointerId);updateStick(e);e.preventDefault()});
  stick.addEventListener('pointermove',e=>{if(e.pointerId===stickId){updateStick(e);e.preventDefault()}});
  stick.addEventListener('pointerup',stopStick);stick.addEventListener('pointercancel',stopStick);

  let aimX=.72,aimY=.5,canvasTouchId=null;
  const aim=e=>{const r=canvas.getBoundingClientRect();aimX=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));aimY=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));mouse(canvas,'mousemove',e.clientX,e.clientY,e.buttons||0)};
  const canvasDown=e=>{if(e.pointerType!=='touch')return;canvasTouchId=e.pointerId;canvas.setPointerCapture?.(e.pointerId);aim(e);mouse(canvas,'mousedown',e.clientX,e.clientY,1);e.preventDefault()};
  const canvasMove=e=>{if(e.pointerType==='touch'&&e.pointerId===canvasTouchId){aim(e);e.preventDefault()}};
  const canvasUp=e=>{if(e.pointerType!=='touch'||e.pointerId!==canvasTouchId)return;aim(e);mouse(canvas,'mouseup',e.clientX,e.clientY,0);canvasTouchId=null;e.preventDefault()};
  canvas.addEventListener('pointerdown',canvasDown,{passive:false});canvas.addEventListener('pointermove',canvasMove,{passive:false});canvas.addEventListener('pointerup',canvasUp,{passive:false});canvas.addEventListener('pointercancel',canvasUp,{passive:false});

  const action=layer.querySelector('[data-mobile="action"]');let actionHeld=false;
  const actionPoint=()=>{const r=canvas.getBoundingClientRect();return{x:r.left+r.width*aimX,y:r.top+r.height*aimY}};
  const actionDown=e=>{if(actionHeld)return;actionHeld=true;const p=actionPoint();mouse(canvas,'mousemove',p.x,p.y,0);mouse(canvas,'mousedown',p.x,p.y,1);e.preventDefault()};
  const actionUp=e=>{if(!actionHeld)return;actionHeld=false;const p=actionPoint();mouse(canvas,'mouseup',p.x,p.y,0);e.preventDefault()};
  action.addEventListener('pointerdown',actionDown);action.addEventListener('pointerup',actionUp);action.addEventListener('pointercancel',actionUp);

  layer.querySelector('[data-mobile="dash"]').onclick=()=>tapKey(' ','Space');
  layer.querySelector('[data-mobile="interact"]').onclick=()=>tapKey('f','KeyF');
  layer.querySelector('[data-mobile="inventory"]').onclick=()=>tapKey('e','KeyE');
  layer.querySelector('[data-mobile="chat"]').onclick=()=>{const input=gameRoot.querySelector('#chatInput');input?.focus();input?.scrollIntoView?.({block:'nearest'})};

  const panels=[...gameRoot.querySelectorAll('.game-layout>.side-panel')];
  const togglePanel=index=>{panels.forEach((p,i)=>p.classList.toggle('mobile-open',i===index&&!p.classList.contains('mobile-open')))};
  layer.querySelector('[data-mobile="build"]').onclick=()=>togglePanel(0);
  layer.querySelector('[data-mobile="squad"]').onclick=()=>togglePanel(Math.max(0,panels.length-1));
  for(const p of panels)p.addEventListener('click',e=>{if(e.target.closest('button'))setTimeout(()=>{if(window.innerWidth<700)p.classList.remove('mobile-open')},100)});

  const hotbar=gameRoot.querySelector('#hotbar');
  hotbar?.addEventListener('click',e=>{const slot=e.target.closest('.slot');if(!slot)return;const slots=[...hotbar.querySelectorAll('.slot')],i=slots.indexOf(slot);if(i>=0&&i<9)tapKey(String(i+1),`Digit${i+1}`)},true);

  const onResize=()=>shell.classList.toggle('mobile-portrait',window.innerHeight>window.innerWidth);
  window.addEventListener('resize',onResize);onResize();
  cleanup=()=>{syncKeys(new Set());window.removeEventListener('resize',onResize);canvas.removeEventListener('pointerdown',canvasDown);canvas.removeEventListener('pointermove',canvasMove);canvas.removeEventListener('pointerup',canvasUp);canvas.removeEventListener('pointercancel',canvasUp);layer.remove();shell.classList.remove('mobile-mode','mobile-portrait');cleanup=null};
}
function watch(){if(!gameRoot)return;const obs=new MutationObserver(()=>{if(gameRoot.classList.contains('hidden')){cleanup?.();return}requestAnimationFrame(init)});obs.observe(gameRoot,{childList:true,subtree:false,attributes:true,attributeFilter:['class']});window.addEventListener('resize',()=>{if(coarse())init();else cleanup?.()});if(!gameRoot.classList.contains('hidden'))init()}
watch();
