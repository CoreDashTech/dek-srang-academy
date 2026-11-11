import {S,init,can,NAV_ROLE,ROLES,onChange} from './store.js';
import {setLang,T,esc,getLang} from './util.js';
import {ic,ACT,IN,setRefresh,brandSvg,devLogo,toast,closeModal,refresh,go} from './ui.js';
import {applyLook} from './look.js';
import {initSync,connect,onStatus,getStatus,isOn,syncNow} from './sync.js';
import * as overview from './overview.js';import * as players from './players.js';import * as training from './training.js';import * as matches from './matches.js';
import * as analytics from './analytics.js';import * as guide from './guide.js';import * as teams from './teams.js';import * as reports from './reports.js';import * as settings from './settings.js';
const R={overview,players,training,matches,analytics,guide,teams,reports,settings};
const NAV=[['overview','home',()=>T('ภาพรวม','Dashboard')],['players','rider',()=>T('นักเตะ','Players')],['training','run',()=>T('ฝึกซ้อม & เช็กชื่อ','Training')],['matches','ball',()=>T('แมตช์ & สถิติ','Matches')],['analytics','scatter',()=>T('ห้องวิเคราะห์กราฟ','Analytics lab')],['guide','book',()=>T('แนวทางพัฒนา','Dev. guide')],['teams','users',()=>T('ทีมและโค้ช','Teams & coaches')],['reports','doc',()=>T('รายงาน','Reports')],['settings','gear',()=>T('ตั้งค่า','Settings')]];
const ROLE_NAV={coach:['overview','players','training','matches','analytics','guide','teams','reports']};
const allowed=()=>{const r=S.settings.role||'admin';const l=NAV_ROLE[r]||ROLE_NAV[r];return l?NAV.filter(n=>l.includes(n[0])):NAV};
const $=s=>document.querySelector(s);
let cur='overview',lastKey='';
function shell(){const al=allowed(),role=S.settings.role||'admin';
  $('#app').innerHTML=`<aside class="side" id="side"><div class="sb-h"><a class="sb-brand" href="#/overview">${brandSvg(40)}<div><b id="orgName">${esc(S.settings.org)}</b><small>${T('พัฒนานักเตะอย่างเป็นระบบ','Player development')}</small></div></a></div>
  <nav class="sb-nav" aria-label="${T('เมนูหลัก','Main menu')}">${al.map(([k,i,l])=>`<a href="#/${k}" data-nav="${k}">${ic(i)}<span>${l()}</span></a>`).join('')}</nav>
  <div class="sb-f"><div class="sb-dev">${devLogo(54)}<div><small>${T('พัฒนาโดย','Developed by')}</small><b>CoreDash Technology</b></div></div></div></aside><div class="scrim" data-act="menuToggle"></div>
  <div class="main"><header class="top"><button class="ib menu" data-act="menuToggle" aria-label="${T('เมนู','Menu')}"><svg class="i" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button><h2 class="tt" id="ttl"></h2><span class="grow"></span>
   <button class="ib" id="syncDot" data-act="goSync" title="Google Sheet" aria-label="Google Sheet">${ic('globe')}<i class="dot"></i></button>
   <button class="ib" data-act="goLook" title="${T('เปลี่ยนสี / ธีม','Colours / theme')}" aria-label="${T('เปลี่ยนสี','Colours')}"><svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 000 18c1.500 0 2-1 1.500-2s0-2 1.500-2h2a3 3 0 003-3A9 9 0 0012 3z"/></svg></button>
   <div class="lang" role="group" aria-label="Language"><button class="${getLang()==='th'?'on':''}" data-act="setLang" data-v="th">ไทย</button><button class="${getLang()==='en'?'on':''}" data-act="setLang" data-v="en">EN</button></div>
   <span class="role pill in" title="${T('บทบาทที่จำลอง','Simulated role')}">${esc(T(...ROLES[role]))}</span><button class="btn sm gold" id="inst" data-act="install" hidden>${ic('download')}${T('ติดตั้งแอป','Install')}</button></header>
   <main id="view" tabindex="-1"></main></div>
  <nav class="bnav" aria-label="${T('เมนูล่าง','Bottom menu')}">${al.slice(0,4).map(([k,i,l])=>`<a href="#/${k}" data-nav="${k}">${ic(i)}<span>${l().split(' ')[0]}</span></a>`).join('')}<button data-act="menuToggle">${ic('list')}<span>${T('เมนู','Menu')}</span></button></nav>`;
  paintSync()}
function paintSync(){const d=$('#syncDot');if(!d)return;const s=getStatus();d.dataset.s=!isOn()?'off':s.mode||'ok'}
function markNav(){document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('on',a.dataset.nav===cur))}
function route(){const h=location.hash.replace(/^#\/?/,''),parts=h.split('/').filter(Boolean),k=parts[0]||'overview';
  cur=R[k]?k:'overview';if(!allowed().some(n=>n[0]===cur)){cur='overview';parts.length=0}
  const key=cur+'/'+parts.slice(1).join('/');const changed=key!==lastKey;lastKey=key;render(parts.slice(1),changed)}
function render(args,top){const v=$('#view');if(!v)return;const y=top?0:window.scrollY;
  try{v.innerHTML=R[cur].render(args||[]);$('#ttl').textContent=R[cur].title();document.title=R[cur].title()+' · '+S.settings.org}
  catch(e){console.error(e);v.innerHTML=`<div class="card note bad">${ic('alert')}<span>${T('เกิดข้อผิดพลาดในการแสดงผล','Render error')}: ${esc(e.message)}</span></div>`}
  markNav();document.body.classList.remove('menu-open');if(top){window.scrollTo(0,0);v.focus({preventScroll:true})}else window.scrollTo(0,y)}
setRefresh(()=>route_refresh());
function route_refresh(){const h=location.hash.replace(/^#\/?/,''),parts=h.split('/').filter(Boolean);render(parts.slice(1),false)}
/* ---- ตัวจัดการเหตุการณ์กลาง ---- */
document.addEventListener('click',e=>{const a=e.target.closest('[data-act]');if(a&&ACT[a.dataset.act]){if(a.tagName==='A'&&!a.getAttribute('href'))e.preventDefault();ACT[a.dataset.act](a,e);return}
  const g=e.target.closest('[data-go]');if(g&&!e.target.closest('a,button,input,select,label'))location.hash=g.dataset.go.replace(/^#/,'#')});
const inH=e=>{const el=e.target.closest('[data-in]');if(el&&IN[el.dataset.in])IN[el.dataset.in](el,e)};
document.addEventListener('input',e=>{const t=e.target;if(t.tagName==='SELECT'||t.type==='file'||t.type==='checkbox')return;inH(e)});
document.addEventListener('change',e=>{const t=e.target;if(t.tagName==='SELECT'||t.type==='file'||t.type==='checkbox')inH(e)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('tr[data-go]')){location.hash=e.target.dataset.go}});
ACT.mClose=()=>closeModal();ACT.printNow=()=>{document.body.classList.add('printing-area');setTimeout(()=>{window.print();setTimeout(()=>document.body.classList.remove('printing-area'),300)},60)};
ACT.menuToggle=()=>document.body.classList.toggle('menu-open');
ACT.goSync=()=>{settings.showTab('sync');location.hash='#/settings'};
ACT.goLook=()=>{settings.showTab('look');if(location.hash==='#/settings')refresh();else location.hash='#/settings'};
function filterReg(){const q=(document.querySelector('[data-in=regQ]')||{value:''}).value.trim().toLowerCase(),f=(document.querySelector('[data-in=regF]')||{value:''}).value;let n=0;
  document.querySelectorAll('#view [data-q]').forEach(r=>{const ok=(!q||r.dataset.q.includes(q))&&(!f||r.dataset.f===f);r.hidden=!ok;if(ok)n++});const em=document.getElementById('regEmpty');if(em)em.hidden=n>0}
IN.regQ=filterReg;IN.regF=filterReg;
/* ---- เริ่มระบบ ---- */
let deferred=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;const b=$('#inst');if(b)b.hidden=false});
ACT.install=async()=>{if(!deferred)return;deferred.prompt();await deferred.userChoice;deferred=null;const b=$('#inst');if(b)b.hidden=true};
window.addEventListener('cde-lang',()=>{setLang(S.settings.lang);shell();route_refresh()});
window.addEventListener('cde-brand',()=>{const o=$('#orgName');if(o)o.textContent=S.settings.org});
window.addEventListener('cde-synced',()=>{if(!document.querySelector('.mod')&&!/^#\/(settings)/.test(location.hash))route_refresh()});
window.addEventListener('cde-error',e=>toast(e.detail,6000));
window.addEventListener('hashchange',route);
onStatus(paintSync);
function boot(){init();setLang(S.settings.lang||'th');applyLook();settings.applyTheme();
  const q=new URLSearchParams(location.search).get('setup');
  if(q){try{const j=JSON.parse(decodeURIComponent(escape(atob(q.replace(/-/g,'+').replace(/_/g,'/')))));if(j.u&&j.t){connect(j.u,j.t);history.replaceState(null,'',location.pathname+location.hash);setTimeout(()=>{toast(T('เชื่อม Google Sheet ให้เครื่องนี้แล้ว','This device is now linked to Google Sheet'),4500);syncNow()},600)}}catch(e){}}
  initSync();shell();route();
  if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(()=>{})}
boot();
