/* shared UI helpers */
import {esc,T} from './util.js';
const P={ball:'<circle cx="12" cy="12" r="9"/><path d="M12 8l3.500 2.500-1.300 4h-4.400l-1.300-4zM12 8V3M15.500 10.500l4.200-1.500M14.200 14.500l2.500 3.500M9.800 14.500L7.300 18M8.500 10.500L4.300 9"/>',apple:'<path d="M12 7c-2-2-6-1-6 4 0 5 3 9 6 9s6-4 6-9c0-5-4-6-6-4zM12 7c0-2 1-3 3-4"/>',run:'<circle cx="14" cy="4.500" r="2"/><path d="M9 21l3-6-3-3 2-4 4 2 3 3M12 15l3 2v4M7 12l2-4"/>',scatter:'<path d="M4 20V4M4 20h16"/><circle cx="8" cy="15" r="1.200"/><circle cx="12" cy="11" r="1.200"/><circle cx="15" cy="13" r="1.200"/><circle cx="18" cy="7" r="1.200"/>',book:'<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19a2 2 0 002 2h13"/>',heart:'<path d="M12 20s-8-5-8-11a4.500 4.500 0 018-2.500A4.500 4.500 0 0120 9c0 6-8 11-8 11z"/>',tape:'<rect x="3" y="8" width="18" height="8" rx="1.500"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/>',home:'<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4zM17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3"/>',
rider:'<circle cx="12" cy="7" r="3.5"/><path d="M5 21a7 7 0 0114 0"/>',
shoe:'<path d="M12 3C6.5 3 4.5 8 4.5 13v7h4v-7c0-3 1.5-6 3.500-6s3.500 3 3.500 6v7h4v-7C19.500 8 17.500 3 12 3z"/><path d="M6.500 17h.01M17.500 17h.01M6.800 12.500h.01M17.200 12.500h.01"/>',
flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',list:'<path d="M8 6h13M8 12h13M8 18h13M3.500 6h.01M3.500 12h.01M3.500 18h.01"/>',
chart:'<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"/>',build:'<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M9 11h.01M15 11h.01"/>',
doc:'<path d="M6 3h8l5 5v13H6zM14 3v5h5M9 13h6M9 17h6"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M19.400 15a1.700 1.700 0 00.3 1.800l.1.1a2 2 0 11-2.800 2.800l-.1-.1a1.700 1.700 0 00-1.800-.3 1.700 1.700 0 00-1 1.500V21a2 2 0 11-4 0v-.1a1.700 1.700 0 00-1-1.500 1.700 1.700 0 00-1.800.3l-.1.1a2 2 0 11-2.800-2.800l.1-.1a1.700 1.700 0 00.3-1.800 1.700 1.700 0 00-1.500-1H3a2 2 0 110-4h.1a1.700 1.700 0 001.500-1 1.700 1.700 0 00-.3-1.800l-.1-.1a2 2 0 112.800-2.800l.1.1a1.700 1.700 0 001.800.3h0a1.700 1.700 0 001-1.500V3a2 2 0 114 0v.1a1.700 1.700 0 001 1.500h0a1.700 1.700 0 001.800-.3l.1-.1a2 2 0 112.800 2.800l-.1.1a1.700 1.700 0 00-.3 1.800v0a1.700 1.700 0 001.500 1H21a2 2 0 110 4h-.1a1.700 1.700 0 00-1.500 1z"/>',
plus:'<path d="M12 5v14M5 12h14"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.300-4.300"/>',
camera:'<path d="M4 8h3l2-3h6l2 3h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"/><circle cx="12" cy="13" r="3.500"/>',
download:'<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 20h16"/>',check:'<path d="M5 12.500l4.500 4.500L19 7"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',
alert:'<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18.500v.1"/>',moon:'<path d="M20 14.500A8 8 0 019.500 4 8 8 0 1020 14.500z"/>',
up:'<path d="M12 19V5m0 0l-5 5m5-5l5 5"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16v4z"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.1M14 21h3M21 17v4"/>',
chev:'<path d="M9 6l6 6-6 6"/>',pin:'<path d="M12 21s-7-6.200-7-11a7 7 0 0114 0c0 4.800-7 11-7 11z"/><circle cx="12" cy="10" r="2.500"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.500v.1"/>',img:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.700"/><path d="M21 16l-5-5-8 8"/>',
star:'<path d="M12 3l2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9L12 3z"/>',
medal:'<circle cx="12" cy="15" r="5.500"/><path d="M8.500 10.500L6 3h4l2 4 2-4h4l-2.500 7.500M12 12.500v5"/>',
card:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.200"/><path d="M5.500 16c.6-1.800 2-2.700 3.500-2.700s2.900.9 3.500 2.700M15 10h3.500M15 13.500h3.500"/>',
print:'<path d="M7 9V3h10v6M7 17H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2M7 14h10v7H7z"/>',
tv:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',cal:'<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>',
users:'<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20a6.500 6.500 0 0113 0M16 4.500a3.500 3.500 0 010 7M18 14a6 6 0 013.500 6"/>',
globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
live:'<circle cx="12" cy="12" r="2.500"/><path d="M7.500 7.500a6 6 0 000 9M16.500 7.500a6 6 0 010 9M4.500 4.500a10 10 0 000 15M19.500 4.500a10 10 0 010 15"/>',
shield:'<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6l8-3z"/><path d="M8.500 12l2.500 2.500 4.500-5"/>',
bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',paw:'<circle cx="6" cy="10" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="14" cy="6" r="2"/><circle cx="18" cy="10" r="2"/><path d="M12 12c-3 0-5 3-5 5 0 2 2 2.500 5 2.500s5-.5 5-2.500c0-2-2-5-5-5z"/>'};
export const ic=n=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${P[n]||''}</svg>`;
export const ACT={},IN={};
export let refresh=()=>{};export const setRefresh=f=>{refresh=f};
export const go=h=>{if(location.hash==='#'+h)refresh();else location.hash=h};
let tt;export function toast(msg,ms=2600){let t=document.querySelector('.toast');if(t)t.remove();t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=msg;document.body.appendChild(t);clearTimeout(tt);tt=setTimeout(()=>t.remove(),ms)}
export function modal(html,{wide=false}={}){closeModal();const m=document.createElement('div');m.className='mod';m.id='modal';m.innerHTML=`<div class="box" role="dialog" aria-modal="true" ${wide?'style="width:min(760px,100%)"':''}>${html}</div>`;m.addEventListener('mousedown',e=>{if(e.target===m)closeModal()});document.body.appendChild(m);return m}
export const closeModal=()=>{const m=document.getElementById('modal');if(m)m.remove()};
export function ask(title,msg,okLabel,cls='pri'){return new Promise(res=>{modal(`<h2>${esc(title)}</h2><p class="mut" style="margin:0">${esc(msg)}</p><div class="acts"><button class="btn" data-x="0">${T('ยกเลิก','Cancel')}</button><button class="btn ${cls}" data-x="1">${esc(okLabel||T('ตกลง','OK'))}</button></div>`);document.getElementById('modal').addEventListener('click',e=>{const b=e.target.closest('[data-x]');if(b){closeModal();res(b.dataset.x==='1')}})})}
/* ฟอร์มใน modal: fields=[{k,label,type,value,opts,ph,full,group}] → Promise<object|null> */
export function form(title,fields,{ok,note='',wide=false}={}){return new Promise(res=>{
  const fld=f=>{const id='f_'+f.k,v=f.value??'';let c;
    if(f.type==='select')c=`<select id="${id}" class="fld">${f.opts.map(o=>{const [a,b]=Array.isArray(o)?o:[o,o];return`<option value="${esc(a)}" ${String(a)===String(v)?'selected':''}>${esc(b)}</option>`}).join('')}</select>`;
    else if(f.type==='textarea')c=`<textarea id="${id}" class="fld" rows="${f.rows||3}" placeholder="${esc(f.ph||'')}">${esc(v)}</textarea>`;
    else if(f.type==='check')c=`<label class="chk"><input id="${id}" type="checkbox" ${v?'checked':''}> ${esc(f.hint||'')}</label>`;
    else c=`<input id="${id}" class="fld" type="${f.type||'text'}" value="${esc(v)}" placeholder="${esc(f.ph||'')}" ${f.step?`step="${f.step}"`:''} ${f.min!=null?`min="${f.min}"`:''} ${f.list?`list="${f.list}"`:''} autocomplete="off">`;
    return`${f.group?`<h3 class="fgh">${esc(f.group)}</h3>`:''}<div class="ff ${f.full?'full':''}"><label for="${id}">${esc(f.label)}</label>${c}</div>`};
  const m=modal(`<h2>${esc(title)}</h2>${note?`<p class="mut" style="margin:0 0 12px;font-size:.9rem">${note}</p>`:''}<form id="mf"><div class="fg">${fields.map(fld).join('')}</div><div class="acts"><button type="button" class="btn" data-x="0">${T('ยกเลิก','Cancel')}</button><button class="btn pri" type="submit">${esc(ok||T('บันทึก','Save'))}</button></div></form>`,{wide});
  const f0=m.querySelector('input,select,textarea');if(f0&&f0.type!=='checkbox')setTimeout(()=>f0.focus(),50);
  m.querySelector('[data-x="0"]').onclick=()=>{closeModal();res(null)};
  m.querySelector('#mf').onsubmit=e=>{e.preventDefault();const o={};fields.forEach(f=>{const el=m.querySelector('#f_'+f.k);o[f.k]=f.type==='check'?el.checked:f.type==='number'?(el.value===''?null:+el.value):el.value.trim()});closeModal();res(o)}})}
export const pill=(t,c='')=>`<span class="pill ${c}">${esc(t)}</span>`;
export function tabs(cur,list,act){return`<div class="chips">${list.map(([k,l])=>`<button type="button" class="chip${cur===k?' on':''}" data-act="${act}" data-v="${esc(k)}">${esc(l)}</button>`).join('')}</div>`}
export const empty=(t)=>`<div class="empty-s">${esc(t)}</div>`;
export const head=(t,s='',a='')=>`<div class="hd"><div><h1 class="h1">${esc(t)}</h1>${s?`<div class="sub">${s}</div>`:''}</div><div class="row">${a}</div></div>`;
/* ---------- แบรนด์ ---------- */
export const brandSvg=(s=40)=>`<img class="bm" src="assets/brand/club-${s>64?512:128}.png" alt="DEK SRANG Academy" height="${s}" style="height:${s}px;width:auto">`;
/** โลโก้ผู้พัฒนา CoreDash Technology — สลับสีเขียว/แดง (cross-fade) */
export const devLogo=(w=64,cls='')=>`<span class="devlogo ${cls}" style="width:${w}px;height:${Math.round(w*1.2)}px" role="img" aria-label="CoreDash Technology"><img class="a" src="assets/brand/dev-green-${w>110?256:96}.jpg" alt="" width="${w}"><img class="b" src="assets/brand/dev-red-${w>110?256:96}.jpg" alt="" width="${w}"></span>`;
