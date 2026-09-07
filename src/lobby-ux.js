const root=document.getElementById('appRoot');
const L={
 en:{chat:'Lobby chat',send:'Send',leave:'Leave room',leaveWarn:'You will leave the room. Continue?',waiting:'Waiting'},
 ko:{chat:'방 채팅',send:'보내기',leave:'방 나가기',leaveWarn:'방에서 나가게 됩니다. 계속하시겠습니까?',waiting:'준비중'},
 ja:{chat:'ロビーチャット',send:'送信',leave:'ルーム退出',leaveWarn:'ルームから退出します。続けますか？',waiting:'準備中'},
 zh:{chat:'房间聊天',send:'发送',leave:'离开房间',leaveWarn:'你将离开房间。是否继续？',waiting:'准备中'}
};
const lang=()=>{const l=(document.documentElement.lang||'en').toLowerCase();return l.startsWith('ko')?'ko':l.startsWith('ja')?'ja':l.startsWith('zh')?'zh':'en'};
const t=k=>L[lang()]?.[k]||L.en[k];
const messages=[];
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
let scheduled=false;
function captureRoomCapacity(){
 const create=root?.querySelector('#createRoom');
 if(create&&!create.dataset.capHook){create.dataset.capHook='1';create.addEventListener('click',()=>{const input=root.querySelector('#roomMax');const cap=Math.max(1,Math.min(15,Number(input?.value)||15));sessionStorage.setItem('rbf.roomMax',String(cap));window.dispatchEvent(new Event('rbf-room-cap'))},{capture:true})}
 root?.querySelectorAll('[data-join]').forEach(btn=>{if(btn.dataset.capHook)return;btn.dataset.capHook='1';btn.addEventListener('click',()=>{const card=btn.closest('.room-card');const m=card?.innerText.match(/(\d+)\s*\/\s*(\d+)/);const cap=Math.max(1,Math.min(15,Number(m?.[2])||15));sessionStorage.setItem('rbf.roomMax',String(cap));window.dispatchEvent(new Event('rbf-room-cap'))},{capture:true})});
}
function fixWaitingLabel(){if(lang()!=='ko')return;root?.querySelectorAll('.lobby-grid .player-row span:not(.ready)').forEach(s=>{if(s.textContent.trim()==='준비 취소')s.textContent='준비중'})}
function roomLeave(){sessionStorage.removeItem('rbf.aiCount');sessionStorage.removeItem('rbf.roomMax');const play=root?.querySelector('[data-nav="play"]');if(play)play.click()}
function addLobbyControls(){
 const lobby=root?.querySelector('.lobby-grid');if(!lobby)return;
 const content=lobby.parentElement;if(!content)return;
 if(!content.querySelector('#rbfLobbyChat')){
   const box=document.createElement('section');box.id='rbfLobbyChat';box.className='panel';box.style.marginTop='12px';box.innerHTML=`<h3>${t('chat')}</h3><div id="rbfLobbyChatLog" class="chat-log" style="max-height:150px;min-height:80px"></div><div class="row"><input id="rbfLobbyChatInput" maxlength="180" placeholder="${t('chat')}"><button id="rbfLobbyChatSend" class="btn">${t('send')}</button></div>`;content.appendChild(box);
   const send=()=>{const input=box.querySelector('#rbfLobbyChatInput');const text=input.value.trim();if(!text)return;const name=(root.querySelector('.auth-actions span')?.textContent||sessionStorage.getItem('rbf.guest')||'User').trim();messages.push({name,text});input.value='';renderChat()};
   box.querySelector('#rbfLobbyChatSend').onclick=send;box.querySelector('#rbfLobbyChatInput').addEventListener('keydown',e=>{if(e.key==='Enter')send()});
 }
 if(!content.querySelector('#rbfLeaveRoom')){const b=document.createElement('button');b.id='rbfLeaveRoom';b.className='btn danger';b.style.marginTop='12px';b.textContent=t('leave');b.onclick=()=>{if(confirm(t('leaveWarn')))roomLeave()};content.appendChild(b)}
 renderChat();
}
function renderChat(){const log=root?.querySelector('#rbfLobbyChatLog');if(log){log.innerHTML=messages.slice(-50).map(m=>`<div><b>${esc(m.name)}</b>: ${esc(m.text)}</div>`).join('');log.scrollTop=log.scrollHeight}}
function interceptMenu(){root?.querySelectorAll('.lobby-grid').forEach(()=>{});root?.querySelectorAll('.side-nav [data-nav]').forEach(btn=>{if(btn.dataset.leaveHook)return;btn.dataset.leaveHook='1';btn.addEventListener('click',e=>{if(!root.querySelector('.lobby-grid'))return;const dest=btn.dataset.nav;if(dest==='play'){e.preventDefault();e.stopImmediatePropagation();return}if(dest==='customize')return;if(!confirm(t('leaveWarn'))){e.preventDefault();e.stopImmediatePropagation();return}sessionStorage.removeItem('rbf.aiCount');sessionStorage.removeItem('rbf.roomMax')},{capture:true})})}
function apply(){captureRoomCapacity();fixWaitingLabel();addLobbyControls();interceptMenu()}
function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;apply()})}
const obs=new MutationObserver(schedule);if(root)obs.observe(root,{childList:true,subtree:true});window.addEventListener('rbf-language',schedule);apply();
