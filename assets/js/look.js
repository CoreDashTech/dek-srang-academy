/* ปรับสีหน้าตา: ชุดสีสำเร็จรูป + สีพื้นหลัง / สีหลัก / เมนูด้านซ้าย — เก็บต่อเครื่อง (localStorage) */
import {T} from './util.js';
const KEY='cda.look';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{}}catch(e){return{}}};
let look=load();const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(look))}catch(e){}};
const hex=c=>{c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');return[0,2,4].map(i=>parseInt(c.substr(i,2),16))};
const toHex=a=>'#'+a.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>{const x=hex(a),y=hex(b);return toHex(x.map((v,i)=>v*(1-t)+y[i]*t))};
const lum=c=>{const [r,g,b]=hex(c).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b};
/* ชุดสี: [id, ไทย, EN, พื้นหลัง, แถบเมนู, สีหลัก] */
export const PRESETS=[['navy','กรมท่า & ทอง (ค่าเริ่มต้น)','Navy & Gold (default)',null,null,null],['ivory','งาช้าง','Ivory','#f6f1e4','#0b1f3a','#0e2a52'],['pearl','ขาวมุก','Pearl white','#ffffff','#12294d','#12294d'],
 ['sky','ฟ้าใส','Clear sky','#e9f2fb','#0f3a68','#1e5fa8'],['forest','เขียวป่า','Forest','#eef3ee','#123524','#1f6b45'],['burgundy','เบอร์กันดี','Burgundy','#f8eff0','#3b0f1c','#7a1f35'],
 ['sand','ทรายอุ่น','Warm sand','#f3ead8','#4a3320','#8a5a2b'],['slate','เทาสเลต','Slate','#eceff3','#1f2937','#3b5b8c'],['midnight','เที่ยงคืน (มืด)','Midnight (dark)','#0a1424','#060d1a','#e0b95a'],['noir','ดำ & ทอง (มืด)','Noir & Gold (dark)','#121212','#000000','#d4af37']];
export const BG=[[null,'ค่าเริ่มต้น','Default','#f4f1ea'],['#ffffff','ขาว','White'],['#f6f1e4','งาช้าง','Ivory'],['#eef0f3','เทาอ่อน','Light grey'],['#e8f1fb','ฟ้าอ่อน','Light blue'],['#e6f4ec','เขียวมิ้นต์','Mint'],['#f8eff0','ชมพูอ่อน','Blush'],['#f3ead8','ทราย','Sand'],['#0a1424','กรมท่าเข้ม','Deep navy'],['#121212','ดำ','Black']];
export const SB=[[null,'อัตโนมัติ','Auto','#0b1f3a'],['#0b1f3a','กรมท่า','Navy'],['#12294d','น้ำเงินเข้ม','Royal'],['#123524','เขียวป่า','Forest'],['#3b0f1c','เบอร์กันดี','Burgundy'],['#1f2937','เทาสเลต','Slate'],['#000000','ดำ','Black'],['#ffffff','ขาว','White'],['#e8f1fb','ฟ้าอ่อน','Light blue']];
export const AC=[[null,'กรมท่า (หลัก)','Navy','#0e2a52'],['#c9a24a','ทอง','Gold'],['#1f6b45','เขียว','Green'],['#1e5fa8','ฟ้า','Blue'],['#7a1f35','เบอร์กันดี','Burgundy'],['#7c3aed','ม่วง','Purple'],['#dc2626','แดง','Red'],['#ea580c','ส้ม','Orange']];
const VARS=['--bg','--surface','--surface2','--line','--ink','--mut','--accent','--accent2','--on-accent','--side','--side-ink','--side-on','--side-hover','--side-line'];
export function applyLook(){const r=document.documentElement,st=r.style;VARS.forEach(v=>st.removeProperty(v));
  if(look.bg){const dark=lum(look.bg)<.4;r.dataset.theme=dark?'dark':'light';
    st.setProperty('--bg',look.bg);
    st.setProperty('--surface',dark?mix(look.bg,'#ffffff',.07):mix(look.bg,'#ffffff',.72));
    st.setProperty('--surface2',dark?mix(look.bg,'#ffffff',.11):mix(look.bg,'#ffffff',.45));
    st.setProperty('--line',dark?mix(look.bg,'#ffffff',.17):mix(look.bg,'#000000',.1));
    const ink=dark?'#eceef2':'#17181c';st.setProperty('--ink',ink);st.setProperty('--mut',mix(ink,look.bg,dark?.38:.42));
    st.setProperty('--side',dark?mix(look.bg,'#000000',.4):'#0b1f3a')}
  if(look.accent){st.setProperty('--accent',look.accent);st.setProperty('--accent2',mix(look.accent,'#ffffff',.25));st.setProperty('--on-accent',lum(look.accent)>.45?'#101828':'#ffffff')}
  if(look.sbc){const d=lum(look.sbc)<.4;st.setProperty('--side',look.sbc);st.setProperty('--side-ink',d?(lum(look.sbc)>.08?'rgba(255,255,255,.86)':'#aeb2bc'):'#5b6270');st.setProperty('--side-on',d?'#ffffff':'#17181c');st.setProperty('--side-hover',d?'rgba(255,255,255,.08)':'rgba(0,0,0,.06)');st.setProperty('--side-line',d?'transparent':'rgba(0,0,0,.08)')}
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content=getComputedStyle(r).getPropertyValue('--side').trim()||m.content}
export const hasBg=()=>!!look.bg;
export function clearBg(){if(look.bg){look.bg=null;save()}}
const lg=(th,en)=>T(th,en);
const sw=(list,cur,act)=>list.map(([c,th,en,pv])=>{const col=c||pv;return`<button type="button" class="${(cur||null)===c?'on':''}" data-act="${act}" data-v="${c||''}" title="${lg(th,en)}" aria-label="${lg(th,en)}" style="background:${col}"></button>`}).join('');
export function lookCard(modeSeg){
  const isCustom=(list,cur)=>cur&&!list.some(x=>x[0]===cur);
  const pr=PRESETS.map(([id,th,en,bg,sb,ac])=>{const on=id==='navy'?(!look.bg&&!look.accent&&!look.sbc):(look.preset===id);const b=bg||'#f4f1ea',s=sb||'#0b1f3a',a=ac||'#c9a24a';
    return`<button type="button" class="pre ${on?'on':''}" data-act="lookPreset" data-v="${id}" aria-label="${lg(th,en)}"><span class="pv" style="background:${b}"><i style="background:${s}"></i><b style="background:${a}"></b></span><em>${lg(th,en)}</em></button>`}).join('');
  return`<div class="card"><h2 class="h2">${lg('หน้าตา & สี','Appearance & colours')}</h2><div class="lk">
  <div><h3>${lg('โหมด','Mode')}</h3>${modeSeg}</div>
  <div><h3>${lg('ชุดสีสำเร็จรูป (เลือกโทนสีพื้นหลัง)','Colour themes (pick a background tone)')}</h3><div class="pres">${pr}</div></div>
  <div><h3>${lg('สีพื้นหลัง','Background colour')}</h3><div class="sw">${sw(BG,look.bg,'lookBg')}<label class="cu ${isCustom(BG,look.bg)?'on':''}" title="${lg('กำหนดเอง','Custom')}"><input type="color" data-in="lookBgC" value="${look.bg||'#f4f1ea'}"></label></div></div>
  <div><h3>${lg('สีหลัก (ปุ่ม / เมนูที่เลือก)','Accent colour (buttons / active menu)')}</h3><div class="sw">${sw(AC,look.accent,'lookAc')}<label class="cu ${isCustom(AC,look.accent)?'on':''}" title="${lg('กำหนดเอง','Custom')}"><input type="color" data-in="lookAcC" value="${look.accent||'#0e2a52'}"></label></div></div>
  <div><h3>${lg('สีแถบเมนูด้านซ้าย','Sidebar colour')}</h3><div class="sw">${sw(SB,look.sbc,'lookSb')}<label class="cu ${isCustom(SB,look.sbc)?'on':''}" title="${lg('กำหนดเอง','Custom')}"><input type="color" data-in="lookSbC" value="${look.sbc||'#0b1f3a'}"></label></div></div>
  <div><button type="button" class="btn sm" data-act="lookReset">${lg('คืนค่าสีเริ่มต้น','Reset colours')}</button></div></div></div>`}
export const lookActions={
  lookPreset:v=>{const p=PRESETS.find(x=>x[0]===v);look={};if(p&&p[3]){look={preset:v,bg:p[3],sbc:p[4],accent:p[5]}}save()},
  lookBg:v=>{look.bg=v||null;delete look.preset;save()},lookAc:v=>{look.accent=v||null;delete look.preset;save()},lookSb:v=>{look.sbc=v||null;delete look.preset;save()},lookSbC:v=>{look.sbc=v;delete look.preset;save()},lookReset:()=>{look={};save()},
  lookBgC:v=>{look.bg=v;delete look.preset;save()},lookAcC:v=>{look.accent=v;delete look.preset;save()}};
