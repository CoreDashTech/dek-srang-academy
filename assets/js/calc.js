import {S,by,rows,last} from './store.js';
import {SK,TESTS,SKILL_GROUPS,bmi,refAt} from './metrics.js';
import {age,sum,DAY,startOfDay} from './util.js';
const avg=a=>{a=a.filter(x=>x!=null&&!isNaN(x));return a.length?sum(a)/a.length:null};
export const curAge=p=>age(p.dob);
export const skillNow=p=>(last('skills',p.id)||{}).r||null;
export const skillAt=(p,i)=>{const r=rows('skills',p.id);return r[i]?r[i].r:null};
export const skillAvg=(p,gid,o)=>{o=o||skillNow(p);if(!o)return null;return avg(SK.filter(s=>!gid||s.g===gid).map(s=>o[s.k]))};
export const testNow=(p,k)=>{const t=last('tests',p.id);return t?t.v[k]:null};
export const measNow=p=>last('meas',p.id);
export function attPct(p,days=60){const lim=startOfDay(Date.now())-days*DAY,ids=new Set(S.sessions.filter(s=>s.date>=lim&&s.date<=Date.now()).map(s=>s.id)),a=S.att.filter(x=>x.playerId===p.id&&ids.has(x.sessionId));if(!a.length)return null;return a.filter(x=>x.st==='p'||x.st==='l').length/a.length*100}
export function matchTot(p){const m=S.mstats.filter(x=>x.playerId===p.id);return{games:m.length,min:sum(m,x=>x.min),g:sum(m,x=>x.g),a:sum(m,x=>x.a),rating:avg(m.map(x=>x.rating))}}
export const wellAvg=(p,k,days=14)=>{const lim=Date.now()-days*DAY;return avg(S.well.filter(x=>x.playerId===p.id&&x.date>=lim).map(x=>x[k]))};
export function growthRate(p){const r=rows('meas',p.id);if(r.length<2)return null;const a=r[0],b=r[r.length-1],y=(b.date-a.date)/(365.25*DAY);return y>.3?(b.h-a.h)/y:null}
const sc=v=>v==null?null:Math.round(Math.max(25,Math.min(99,20+(v-1)*8.8)));
export function attrs(p){const o=skillNow(p);if(!o)return null;const m=(...k)=>sc(avg(k.map(x=>o[x])));return{PAC:m('spd','agi'),SHO:m('sho'),PAS:m('pas','dec'),DRI:m('dri','tch'),DEF:m('def','pos'),PHY:m('str','end')}}
export const overall=p=>{const a=attrs(p);return a?Math.round(avg(Object.values(a))):null};
export function bodyStatus(p){const m=measNow(p);if(!m)return null;const a=curAge(p),hr=refAt(S.settings.ref,p.gender,a,'h'),wr=refAt(S.settings.ref,p.gender,a,'w');return{h:m.h,w:m.w,bmi:bmi(m.h,m.w),hr,wr,hp:m.h/hr*100,wp:m.w/wr*100,date:m.date}}
export const METRICS=[
 {k:'age',th:'อายุ',en:'Age',u:'y',d:1,get:p=>curAge(p)},
 {k:'h',th:'ส่วนสูง',en:'Height',u:'cm',d:1,get:p=>(measNow(p)||{}).h},
 {k:'w',th:'น้ำหนัก',en:'Weight',u:'kg',d:1,get:p=>(measNow(p)||{}).w},
 {k:'bmi',th:'BMI',en:'BMI',u:'',d:1,get:p=>{const m=measNow(p);return m?bmi(m.h,m.w):null}},
 {k:'gr',th:'ความสูงที่เพิ่ม (ซม./ปี)',en:'Growth (cm/yr)',u:'cm/y',d:1,get:growthRate},
 ...TESTS.map(t=>({k:t.k,th:t.th,en:t.en,u:t.u,d:t.d,get:p=>testNow(p,t.k)})),
 {k:'sk',th:'ทักษะเฉลี่ยรวม',en:'Skill average',u:'/10',d:1,get:p=>skillAvg(p)},
 ...SKILL_GROUPS.map(g=>({k:'g_'+g.id,th:'ทักษะ'+g.th,en:g.en+' skills',u:'/10',d:1,get:p=>skillAvg(p,g.id)})),
 {k:'att',th:'การเข้าซ้อม (%)',en:'Attendance (%)',u:'%',d:0,get:p=>attPct(p)},
 {k:'goals',th:'ประตูสะสม',en:'Goals',u:'',d:0,get:p=>matchTot(p).g},
 {k:'rate',th:'เรตติ้งเฉลี่ยในแมตช์',en:'Match rating',u:'',d:1,get:p=>matchTot(p).rating},
 {k:'sleep',th:'ชั่วโมงนอนเฉลี่ย',en:'Avg sleep (h)',u:'h',d:1,get:p=>wellAvg(p,'sleep')},
 {k:'fat',th:'ความเหนื่อยล้าเฉลี่ย (1-5)',en:'Avg fatigue (1-5)',u:'',d:1,get:p=>wellAvg(p,'fatigue')},
 {k:'meal',th:'คุณภาพอาหารเฉลี่ย (1-5)',en:'Avg meal quality (1-5)',u:'',d:1,get:p=>wellAvg(p,'meal')}];
export const metric=k=>METRICS.find(m=>m.k===k);
