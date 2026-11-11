/* CoreDash Academy — data store (local-first, localStorage) */
import {uid,rng,pad,DAY,startOfDay,age,nm,T} from './util.js';
import {SK,TESTS,refAt,REF_DEFAULT} from './metrics.js';
const KEY='cda.v1',PKEY='cda.photo.';
export const COLS=['players','teams','coaches','sessions','att','meas','skills','tests','matches','mstats','well'];
export const S={settings:{}};COLS.forEach(c=>S[c]=[]);
const subs=new Set();export const onChange=f=>{subs.add(f);return()=>subs.delete(f)};
let timer;export function save(){clearTimeout(timer);timer=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){window.dispatchEvent(new CustomEvent('cde-error',{detail:T('พื้นที่จัดเก็บเต็ม — ดาวน์โหลดข้อมูลสำรองแล้วลบรูปบางส่วน','Storage full — download a backup and remove some photos')}))}subs.forEach(f=>f())},250)}
export function load(){try{const j=JSON.parse(localStorage.getItem(KEY)||'null');if(j&&j.players){Object.assign(S,j);return true}}catch(e){}return false}
export const defaults=()=>({org:'DEK SRANG Academy',orgSub:'Football Development Academy',developer:'CoreDash Technology',lang:'th',theme:'auto',role:'admin',ref:REF_DEFAULT,
 users:[{id:'u1',name:'Academy Admin',role:'admin'},{id:'u2',name:'Coach',role:'coach'},{id:'u3',name:'Parent',role:'parent'}],childId:'',demo:true,seq:{},minorAge:18});
export const nextSeq=k=>{S.settings.seq=S.settings.seq||{};S.settings.seq[k]=(S.settings.seq[k]||0)+1;return S.settings.seq[k]};
export const by=(col,id)=>S[col].find(x=>x.id===id);
export const getPhoto=id=>{try{return id?localStorage.getItem(PKEY+id):null}catch(e){return null}};
export const putPhoto=(id,d)=>{try{localStorage.setItem(PKEY+id,d);return true}catch(e){return false}};
export const delPhoto=id=>{try{localStorage.removeItem(PKEY+id)}catch(e){}};
export const ROLES={admin:['ผู้ดูแลอะคาเดมี่','Academy admin'],coach:['โค้ช','Coach'],parent:['ผู้ปกครอง','Parent']};
export const PERM={admin:['manage','edit','record','report','settings'],coach:['edit','record','report'],parent:[]};
export const can=a=>(PERM[S.settings.role||'admin']||[]).includes(a);
export const NAV_ROLE={parent:['overview','players','analytics','guide','reports']};
export const playerName=p=>p?nm(p.name):'—';
export const teamName=id=>{const t=by('teams',id);return t?nm(t.name):'—'};
export const coachName=id=>{const c=by('coaches',id);return c?nm(c.name):'—'};
export const rows=(col,pid)=>S[col].filter(x=>x.playerId===pid).sort((a,b)=>a.date-b.date);
export const last=(col,pid)=>{const r=rows(col,pid);return r[r.length-1]||null};
export function removeWithRefs(col,id){const i=S[col].findIndex(x=>x.id===id);if(i<0)return;const it=S[col][i];if(it.photo)delPhoto(it.photo);S[col].splice(i,1);
  if(col==='players')['att','meas','skills','tests','mstats','well'].forEach(c=>S[c]=S[c].filter(x=>x.playerId!==id));
  if(col==='sessions')S.att=S.att.filter(x=>x.sessionId!==id);if(col==='matches')S.mstats=S.mstats.filter(x=>x.matchId!==id);save()}
export function reset(withDemo=true){Object.keys(localStorage).filter(k=>k.startsWith(PKEY)).forEach(k=>localStorage.removeItem(k));COLS.forEach(c=>S[c]=[]);const lang=S.settings.lang;S.settings=defaults();if(lang)S.settings.lang=lang;if(withDemo)seed();else S.settings.demo=false;save()}
export function init(){if(!load()){S.settings=defaults();seed();save()}else{const d=defaults();for(const k in d)if(S.settings[k]===undefined)S.settings[k]=d[k]}}
/* ============ ข้อมูลตัวอย่าง ============ */
function seed(){const r=rng(20261111),ri=(a,b)=>a+Math.floor(r()*(b-a+1)),pick=a=>a[Math.floor(r()*a.length)],now=startOfDay(Date.now()),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
  S.settings.demo=true;
  [['u10','U10 หมีน้อย','U10 Cubs','#2563eb',[8,10]],['u13','U13 เสือหนุ่ม','U13 Tigers','#ea580c',[11,13]],['u16','U16 อินทรี','U16 Eagles','#16a34a',[14,16]]].forEach((t,i)=>S.teams.push({id:t[0],name:{th:t[1],en:t[2]},color:t[3],ages:t[4],coachId:'c'+(i+1),day:['จันทร์-พุธ','อังคาร-พฤหัส','พุธ-ศุกร์'][i],time:['16:30','17:00','17:30'][i]}));
  [['โค้ชวิทยา ศรีสุข','Coach Witthaya S.','U10','AFC C'],['โค้ชปิยะ รักบอล','Coach Piya R.','U13','AFC B'],['โค้ชอนุชิต พลังไทย','Coach Anuchit P.','U16','AFC B'],['โค้ชสุนิสา ฟิตเนส','Coach Sunisa F.','Fitness','Sport Science']].forEach((c,i)=>S.coaches.push({id:'c'+(i+1),name:{th:c[0],en:c[1]},role:c[2],lic:c[3],phone:'08'+ri(10000000,99999999)}));
  const fnM=[['ธนากร','Thanakorn'],['ภูมิ','Phum'],['กิตติ','Kitti'],['ปัณณ์','Pan'],['ณัฐ','Nat'],['อชิร','Achira'],['วีรภัทร','Weeraphat'],['ศุภณัฐ','Suppanat'],['เมธัส','Methat'],['ภัทร','Phat'],['ชินวัตร','Chinnawat'],['พีรพัฒน์','Peeraphat'],['นนทพัทธ์','Nontaphat'],['ปุณณวิช','Punnawit'],['กวิน','Kawin'],['รพีภัทร','Rapeephat'],['ต้นกล้า','Tonkla'],['ธีร์','Thee'],['คิม','Kim'],['อัครวุฒิ','Akkarawut'],['ศุกลวัฒน์','Sukkalawat'],['ภาคิน','Phakhin']];
  const fnF=[['ณิชา','Nicha'],['พิมพ์ลดา','Pimlada']],ln=[['ใจดี','Jaidee'],['รักษ์ไทย','Raksthai'],['มั่นคง','Mankong'],['สุขสวัสดิ์','Suksawat'],['วงศ์ทอง','Wongthong'],['ศรีสวัสดิ์','Srisawat'],['แก้วมณี','Kaewmanee'],['พงษ์ไพบูลย์','Phongphaibul']];
  const skin=['#f2c9a0','#e0ac7e','#c68a5a','#a8693e'],hair=['#1b1b1b','#2b1d14','#4a2f1a','#0f0f0f'],styles=['short','buzz','spiky','curly','long'];
  const teamOf=['u10','u13','u16'],ageR={u10:[8,10],u13:[11,13],u16:[14,16]};let fi=0,ff=0;
  const posAll=['GK','DF','DF','MF','MF','FW','FW','MF'];
  teamOf.forEach((tid,ti)=>{for(let k=0;k<8;k++){const g=(k===3&&ti!==1)||(k===6&&ti===2)?'F':'M',f=g==='F'?fnF[ff++%2]:fnM[fi++%fnM.length],l=ln[(ti*3+k)%ln.length],a=ri(ageR[tid][0],ageR[tid][1])+r()*.9,dob=now-Math.round(a*365.25*DAY),id='p'+(ti*8+k+1);
    S.players.push({id,code:'DS-'+pad(nextSeq('player'),4),name:{th:f[0]+' '+l[0],en:f[1]+' '+l[1]},nick:{th:f[0].slice(0,4),en:f[1].slice(0,5)},dob,gender:g,teamId:tid,pos:posAll[k],foot:r()<.82?'R':'L',no:k+ti*3+2,school:'',photo:'',
      parent:{name:'ผู้ปกครอง '+l[0],phone:'08'+ri(10000000,99999999),email:'',consent:true},health:k===2?'แพ้อาหารทะเล / Seafood allergy':'',joined:now-ri(60,900)*DAY,
      av:{skin:pick(skin),hair:pick(hair),style:pick(styles)},q:{h:.95+r()*.1,w:.9+r()*.22,t:r()},plan:{goal:'',focus:[],note:''}})}});
  const refW=S.settings.ref,dates=[-365,-275,-180,-90,-4].map(d=>now+d*DAY);
  S.players.forEach(p=>{dates.forEach((d,i)=>{const a=age(p.dob,d);if(a<6)return;const h=refAt(refW,p.gender,a,'h')*p.q.h+(r()-.5)*.8,w=refAt(refW,p.gender,a,'w')*p.q.w+(r()-.5)*.8;S.meas.push({id:uid('m'),playerId:p.id,date:d,h:+h.toFixed(1),w:+w.toFixed(1)})});
    const base=3.5+p.q.t*2.6;[-180,-90,-7].forEach((dd,i)=>{const o={};SK.forEach(s=>{let v=base+(r()-.5)*2.2+i*(.4+r()*.5);if(p.pos==='GK'&&(s.k==='sho'))v-=1;if(p.pos==='FW'&&s.k==='sho')v+=1;if(p.pos==='DF'&&s.k==='def')v+=1.2;if(p.pos==='MF'&&(s.k==='pas'||s.k==='dec'))v+=1;o[s.k]=cl(Math.round(v*2)/2,1,10)});S.skills.push({id:uid('s'),playerId:p.id,date:now+dd*DAY,coachId:'c'+(1+(p.teamId==='u13'?1:p.teamId==='u16'?2:0)),r:o,note:i===2?(r()<.5?'ตั้งใจฝึกดี พัฒนาต่อเนื่อง ควรเน้นการรับบอลด้วยเท้าที่ถนัดน้อย':'มีความมั่นใจมากขึ้น ฝึกการตัดสินใจก่อนรับบอลเพิ่ม'):''})});
    [-180,-90,-7].forEach((dd,i)=>{const a=age(p.dob,now+dd*DAY),tq=p.q.t;S.tests.push({id:uid('t'),playerId:p.id,date:now+dd*DAY,v:{sp30:+(7.4-.17*a-tq*.3-i*.08+(r()-.5)*.25).toFixed(2),tst:+(12.4-.17*a-tq*.4-i*.12+(r()-.5)*.3).toFixed(2),jmp:Math.round(14+2.3*a+tq*5+i*1.5+(r()-.5)*4),bep:+(3.3+.5*a+tq*1.2+i*.5+(r()-.5)).toFixed(1),rch:Math.round(4+(r()-.4)*10+i*1.2)}})})});
  const foc=['pas','dri','sho','tch','pos','dec','def','spd','agi','end'],titles={pas:['ส่งบอลสั้น-ยาว','Passing patterns'],dri:['เลี้ยงบอลผ่านคู่ต่อสู้','1v1 dribbling'],sho:['ยิงประตูจากหลายมุม','Finishing'],tch:['การรับบอลและคุมบอล','First touch'],pos:['ยืนตำแหน่งเกมรับ-รุก','Positioning'],dec:['ตัดสินใจเกมเล็ก 4v4','Small-sided 4v4'],def:['ป้องกันและแย่งบอล','Defending'],spd:['ความเร็ว+ฟุตเวิร์ก','Speed & footwork'],agi:['ความคล่องตัวสนามบันได','Agility ladder'],end:['ความอึดสลับเกม','Endurance games']};
  const sessAt=(tid,d,i)=>{const t=by('teams',tid),f=foc[(i*3+tid.length+Math.floor(d/DAY))%foc.length];S.sessions.push({id:uid('x'),teamId:tid,date:d,start:t.time,dur:90,focus:f,title:{th:titles[f][0],en:titles[f][1]},load:ri(2,5),venue:'สนามหลัก / Main pitch',coachId:t.coachId})};
  S.teams.forEach(t=>{for(let w=-8;w<=1;w++)[1,3].forEach((o,i)=>sessAt(t.id,now+(w*7+o+ (t.id==='u10'?0:t.id==='u13'?1:2)-((new Date(now).getDay()+6)%7))*DAY,w*2+i))});
  S.sessions.filter(s=>s.date<=now).forEach(s=>S.players.filter(p=>p.teamId===s.teamId).forEach(p=>{const x=r();let st=x<.84?'p':x<.91?'l':x<.97?'a':'i';if(p.id==='p4'&&s.date>now-14*DAY)st='i';S.att.push({id:uid('a'),sessionId:s.id,playerId:p.id,st})}));
  const opp=['Bangkok Juniors','Thonburi FC','Sunrise Academy','Eastern Stars','Lanna Youth','River FC'];
  S.teams.forEach((t,ti)=>{for(let m=0;m<3;m++){const d=m<2?now-(10+m*21+ti)*DAY:now+(6+ti)*DAY,past=d<now,gf=past?ri(0,4):null,ga=past?ri(0,3):null,id=uid('g');S.matches.push({id,teamId:t.id,date:d,opp:opp[(ti*2+m)%6],home:m%2===0,gf,ga,venue:m%2?'Away':'DEK SRANG Home Pitch',comp:m===1?'league':'friendly',time:'09:00'});
    if(past){let goals=gf;S.players.filter(p=>p.teamId===t.id).forEach((p,i)=>{const min=i<6?ri(45,70):ri(10,40);let g=0,a=0;if(goals>0&&(p.pos==='FW'||p.pos==='MF')&&r()<.45){g=1;goals--}if(r()<.2)a=1;S.mstats.push({id:uid('y'),matchId:id,playerId:p.id,min,g,a,rating:+(5.5+r()*3).toFixed(1)})})}}});
  S.players.slice(0,12).forEach(p=>{for(let d=-13;d<=0;d++){const sl=+(cl(8+ (r()-.5)*2.6-(age(p.dob)>12?.8:0),5,11)).toFixed(1);S.well.push({id:uid('w'),playerId:p.id,date:now+d*DAY,sleep:sl,meal:cl(Math.round(3+(r()-.4)*3),1,5),water:+(1+r()*1.4).toFixed(1),fatigue:cl(Math.round(3.4-(sl-8)*.9+(r()-.5)*1.4),1,5),mood:cl(Math.round(3.6+(r()-.4)*2),1,5)})}});
  S.settings.childId='p2'}
