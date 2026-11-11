/* ซิงก์กับ Google Sheet (Google Apps Script Web App) — local-first: ใช้งานออฟไลน์ได้ แล้วซิงก์เมื่อมีเน็ต */
import {S,onChange,save,COLS,by} from './store.js';
import {nm,fDate,T} from './util.js';
const CFG='cda.cfg',ST='cda.sst',PK='cda.photo.';
const dt=t=>t?fDate(t):'';
const HDR={players:['รหัส Code','ชื่อ (ไทย)','Name (EN)','วันเกิด DOB','เพศ','ทีม Team','ตำแหน่ง Pos','เบอร์','ผู้ปกครอง','โทร','ข้อควรระวังสุขภาพ'],teams:['ชื่อ (ไทย)','Name (EN)','อายุต่ำสุด','อายุสูงสุด','โค้ช'],coaches:['ชื่อ (ไทย)','Name (EN)','หน้าที่','ใบอนุญาต','โทร'],
 sessions:['วันที่ Date','ทีม Team','เวลา','หัวข้อ Topic','นาที','ความหนัก'],att:['วันที่','ทีม','นักเตะ Player','สถานะ'],meas:['วันที่ Date','นักเตะ Player','ส่วนสูง cm','น้ำหนัก kg','BMI'],skills:['วันที่ Date','นักเตะ Player','คะแนนเฉลี่ย','หมายเหตุโค้ช'],tests:['วันที่ Date','นักเตะ Player','วิ่ง 30ม.','ซิกแซก','กระโดดสูง','บี๊บเทสต์','นั่งงอตัว'],
 matches:['วันที่ Date','ทีม Team','คู่แข่ง','ประตูเรา','ประตูเขา','รายการ'],mstats:['วันที่','นักเตะ Player','นาที','ประตู','แอสซิสต์','เรตติ้ง'],well:['วันที่ Date','นักเตะ Player','นอน (ชม.)','อาหาร','น้ำ (ล.)','เหนื่อย','อารมณ์']};
const dtm=id=>{const x=by('sessions',id);return x?dt(x.date):''},pn=id=>nm(by('players',id)?.name),tn=id=>nm(by('teams',id)?.name);
const cols={players:r=>[r.code,r.name?.th,r.name?.en,dt(r.dob),r.gender,tn(r.teamId),r.pos,r.no,r.parent?.name,r.parent?.phone,r.health],teams:r=>[r.name?.th,r.name?.en,r.ages?.[0],r.ages?.[1],nm(by('coaches',r.coachId)?.name)],coaches:r=>[r.name?.th,r.name?.en,r.role,r.lic,r.phone],
 sessions:r=>[dt(r.date),tn(r.teamId),r.start,nm(r.title),r.dur,r.load],att:r=>[dtm(r.sessionId),tn(by('sessions',r.sessionId)?.teamId),pn(r.playerId),r.st],meas:r=>[dt(r.date),pn(r.playerId),r.h,r.w,r.h?+(r.w/((r.h/100)**2)).toFixed(1):''],
 skills:r=>[dt(r.date),pn(r.playerId),+(Object.values(r.r||{}).reduce((a,b)=>a+b,0)/Math.max(1,Object.keys(r.r||{}).length)).toFixed(1),r.note],tests:r=>[dt(r.date),pn(r.playerId),r.v?.sp30,r.v?.tst,r.v?.jmp,r.v?.bep,r.v?.rch],
 matches:r=>[dt(r.date),tn(r.teamId),r.opp,r.gf,r.ga,r.comp],mstats:r=>[dt(by('matches',r.matchId)?.date),pn(r.playerId),r.min,r.g,r.a,r.rating],well:r=>[dt(r.date),pn(r.playerId),r.sleep,r.meal,r.water,r.fatigue,r.mood]};
const SKIPSET=['theme','demo','seq','role','lang'];
const lsGet=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
let cfg=lsGet(CFG,null),st=lsGet(ST,{last:0,snap:{},ph:{}}),busy=false,timer=null,poll=null,status={mode:cfg?'ok':'off',msg:'',last:st.last||0,pending:0};
const subs=new Set();export const onStatus=f=>{subs.add(f);return()=>subs.delete(f)};
const setStatus=o=>{Object.assign(status,o);subs.forEach(f=>f(status))};
export const getStatus=()=>status;export const getCfg=()=>cfg;export const isOn=()=>!!cfg;
const saveSt=()=>{try{localStorage.setItem(ST,JSON.stringify(st))}catch(e){}};
const hash=o=>{const s=JSON.stringify(o);let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return h.toString(36)+s.length};
const settingsRec=()=>{const o={...S.settings};SKIPSET.forEach(k=>delete o[k]);return o};
function* records(){for(const c of COLS)for(const r of S[c])yield[c,r.id,r];yield['settings','main',settingsRec()]}
function pendingRows(){const out=[];for(const[c,k,r]of records()){if(st.snap[c+'|'+k]!==hash(r))out.push({c,k,r})}return out}
export function pendingCount(){return cfg?pendingRows().length:0}
export const resetPushed=()=>{st.snap={};saveSt()};
async function call(body){const r=await fetch(cfg.url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({token:cfg.token,...body})});if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();if(!j.ok)throw new Error(j.error||'server error');return j}
async function get(q){const u=new URL(cfg.url);u.searchParams.set('token',cfg.token);Object.entries(q).forEach(([k,v])=>u.searchParams.set(k,v));const r=await fetch(u);if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();if(!j.ok)throw new Error(j.error||'server error');return j}
export async function ping(url,token){const old=cfg;cfg={url,token};try{return await get({action:'ping'})}finally{cfg=old}}
async function pull(){const j=await get({action:'pull',since:st.last||0});let changed=false;
  for(const row of j.rows){let rec;try{rec=JSON.parse(row.j)}catch(e){continue}const c=row.c,k=row.k,sk=c+'|'+k;
    if(c==='settings'){const cur=settingsRec();if(st.snap[sk]&&st.snap[sk]!==hash(cur))continue;if(hash(rec)!==hash(cur)){Object.assign(S.settings,rec);changed=true}S.settings.demo=false;st.snap[sk]=hash(settingsRec());continue}
    const arr=S[c];if(!arr)continue;const i=arr.findIndex(x=>x.id===k);
    if(i<0){arr.push(rec);st.snap[sk]=hash(rec);changed=true}
    else{if(st.snap[sk]!==hash(arr[i]))continue;
      if(hash(arr[i])!==hash(rec)){Object.keys(arr[i]).forEach(x=>delete arr[i][x]);Object.assign(arr[i],rec);changed=true}st.snap[sk]=hash(arr[i])}}
  st.last=j.now;saveSt();if(changed){S.settings.demo=false;save()}return changed}
async function push(){const rows=pendingRows();let n=0;
  for(let i=0;i<rows.length;i+=120){const part=rows.slice(i,i+120),hdr={};part.forEach(x=>{if(HDR[x.c])hdr[x.c]=HDR[x.c]});
    await call({action:'push',hdr,rows:part.map(x=>({c:x.c,k:x.k,cols:cols[x.c]?cols[x.c](x.r):[],j:JSON.stringify(x.r)}))});part.forEach(x=>{st.snap[x.c+'|'+x.k]=hash(x.r)});n+=part.length;saveSt()}
  return n}
async function photos(){const ids=S.players.map(x=>x.photo).filter(Boolean);let up=0;
  for(const id of ids){if(st.ph[id])continue;const d=localStorage.getItem(PK+id);if(!d)continue;await call({action:'photo',id,data:d});st.ph[id]=1;if(++up>=6)break}
  let down=0;for(const id of ids){if(localStorage.getItem(PK+id)||st.ph[id]===2)continue;try{const j=await get({action:'getphoto',id});if(j.data){localStorage.setItem(PK+id,j.data);st.ph[id]=1}else st.ph[id]=2}catch(e){break}if(++down>=6)break}
  saveSt()}
export async function syncNow({quiet=false}={}){if(!cfg||busy)return;if(!navigator.onLine){setStatus({mode:'offline',msg:T('ออฟไลน์ — จะซิงก์เมื่อมีอินเทอร์เน็ต','Offline — will sync when online'),pending:pendingCount()});return}
  busy=true;setStatus({mode:'busy',msg:T('กำลังซิงก์…','Syncing…')});
  try{const ch=await pull();const n=await push();await photos().catch(()=>{});st.last=st.last||Date.now();saveSt();setStatus({mode:'ok',msg:T('ซิงก์แล้ว','Synced'),last:Date.now(),pending:pendingCount()});if(ch)window.dispatchEvent(new Event('cde-synced'));return{pulled:ch,pushed:n}}
  catch(e){console.warn('sync',e);setStatus({mode:'err',msg:T('ซิงก์ไม่สำเร็จ: ','Sync failed: ')+e.message,pending:pendingCount()});if(!quiet)throw e}
  finally{busy=false}}
export function schedule(ms=3500){if(!cfg)return;clearTimeout(timer);setStatus({pending:pendingCount()});timer=setTimeout(()=>syncNow({quiet:true}),ms)}
export function connect(url,token){cfg={url:url.trim(),token:token.trim()};localStorage.setItem(CFG,JSON.stringify(cfg));st={last:0,snap:{},ph:{}};saveSt();startPolling();setStatus({mode:'ok',msg:T('เชื่อมต่อแล้ว','Connected')})}
export function disconnect(){cfg=null;localStorage.removeItem(CFG);localStorage.removeItem(ST);st={last:0,snap:{},ph:{}};clearInterval(poll);setStatus({mode:'off',msg:'',pending:0})}
function startPolling(){clearInterval(poll);poll=setInterval(()=>{if(document.visibilityState==='visible')syncNow({quiet:true})},30000)}
export function initSync(){onChange(()=>schedule());if(!cfg)return;window.addEventListener('online',()=>syncNow({quiet:true}));window.addEventListener('offline',()=>setStatus({mode:'offline',msg:'Offline'}));document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')syncNow({quiet:true})});startPolling();syncNow({quiet:true})}
/** ลิงก์ตั้งค่าให้เครื่องอื่น: ?setup=base64url({u,t}) */
export const setupUrl=()=>{if(!cfg)return'';const b=btoa(unescape(encodeURIComponent(JSON.stringify({u:cfg.url,t:cfg.token})))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');return location.origin+location.pathname.replace(/index\.html$/,'')+'?setup='+b};
