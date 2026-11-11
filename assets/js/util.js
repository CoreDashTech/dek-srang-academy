/* CoreDash Equestrian — helpers (+ภาษา ไทย/English) */
export const $=(s,r=document)=>r.querySelector(s);
export const $$=(s,r=document)=>[...r.querySelectorAll(s)];
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const uid=(p='')=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
export const pad=(n,w=2)=>String(n).padStart(w,'0');
export const DAY=86400000;
export const startOfDay=t=>{const d=new Date(t);d.setHours(0,0,0,0);return d.getTime()};
/* ---------- ภาษา ---------- */
let LANG='th';export const setLang=l=>{LANG=l==='en'?'en':'th';document.documentElement.lang=LANG};export const getLang=()=>LANG;
export const T=(th,en)=>LANG==='en'?(en??th):th;
/** ชื่อ 2 ภาษา: {th,en} หรือ string */
export const nm=o=>o==null?'':typeof o==='string'?o:(LANG==='en'?(o.en||o.th):(o.th||o.en))||'';
const M_TH=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const M_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const D_TH=['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'],D_EN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const dow=t=>(LANG==='en'?D_EN:D_TH)[new Date(t).getDay()];
export const fDate=(t,y=true)=>{if(!t)return'—';const d=new Date(t);return d.getDate()+' '+(LANG==='en'?M_EN:M_TH)[d.getMonth()]+(y?' '+(d.getFullYear()+(LANG==='en'?0:543)):'')};
export const fTime=t=>{const d=new Date(t);return pad(d.getHours())+':'+pad(d.getMinutes())};
export const fDT=t=>fDate(t)+' · '+fTime(t);
export const fRange=(a,b)=>!b||startOfDay(a)===startOfDay(b)?fDate(a):fDate(a,false)+' – '+fDate(b);
export const ymd=t=>{const d=new Date(t);return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())};
export const parseYmd=s=>{if(!s)return 0;const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d).getTime()};
export const age=(dob,at=Date.now())=>{if(!dob)return null;const a=new Date(dob),b=new Date(at);let y=b.getFullYear()-a.getFullYear();if(b.getMonth()<a.getMonth()||(b.getMonth()===a.getMonth()&&b.getDate()<a.getDate()))y--;return y};
export const fNum=(n,d=0)=>Number(n||0).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
export const money=n=>(LANG==='en'?'THB ':'฿')+fNum(n);
export const fPct=(a,b,d=0)=>b?fNum(a/b*100,d)+'%':'—';
export const fTimeSec=s=>{if(s==null||s==='')return'—';s=+s;const m=Math.floor(s/60),r=s-m*60;return m?m+':'+pad(Math.floor(r))+'.'+String(Math.round((r%1)*100)).padStart(2,'0'):r.toFixed(2)};
export function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
export function shuffle(a,seed){const r=rng(seed||Date.now()),b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
export function debounce(f,ms=200){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>f(...a),ms)}}
export function download(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
export function csv(rows){return '﻿'+rows.map(r=>r.map(v=>{v=v==null?'':String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(',')).join('\r\n')}
export const sum=(a,f=x=>x)=>a.reduce((x,y)=>x+(+f(y)||0),0);
export const initials=n=>String(n||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
/* ย่อรูป → dataURL (jpeg) */
export function shrink(file,maxW=640,q=.82){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,maxW/im.width),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',q))};im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(file)})}
/* ครอปสี่เหลี่ยมจัตุรัส (กึ่งกลาง) สำหรับรูปโปรไฟล์ */
export function square(file,size=420,q=.84){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(im.width,im.height),sx=(im.width-s)/2,sy=(im.height-s)/2,c=document.createElement('canvas');c.width=c.height=Math.min(size,s);c.getContext('2d').drawImage(im,sx,sy,s,s,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',q))};im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(file)})}
