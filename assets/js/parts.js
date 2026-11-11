import {S,by,getPhoto,playerName,teamName,rows} from './store.js';
import {esc,T,nm,fDate,fNum,initials} from './util.js';
import {ic,pill} from './ui.js';
import {qrSvg} from './barcode.js';
import {attrs,overall,curAge,skillAvg,measNow,attPct,matchTot} from './calc.js';
import {POS} from './metrics.js';
export const posName=c=>{const p=POS.find(x=>x[0]===c);return p?T(p[1],p[2]):c||''};
export const teamColor=id=>(by('teams',id)||{}).color||'#64748b';
const HAIR={short:(c)=>`<path d="M30 44c-2-16 8-24 20-24s22 8 20 24c-3-7-8-11-20-11S33 37 30 44z" fill="${c}"/>`,buzz:c=>`<path d="M31 42c0-14 8-21 19-21s19 7 19 21c-4-6-9-9-19-9s-15 3-19 9z" fill="${c}" opacity=".85"/>`,
 spiky:c=>`<path d="M30 44l-2-14 8 6 4-12 6 10 6-10 4 12 8-6-2 14c-4-8-9-10-20-10s-16 2-20 10z" fill="${c}"/>`,curly:c=>`<g fill="${c}"><circle cx="34" cy="34" r="8"/><circle cx="44" cy="28" r="8"/><circle cx="56" cy="28" r="8"/><circle cx="66" cy="34" r="8"/><circle cx="50" cy="31" r="8"/></g>`,
 long:c=>`<path d="M28 50c-2-22 6-32 22-32s24 10 22 32l-3 14H31z" fill="${c}"/>`};
/** รูปอวาตาร์: ใช้รูปที่อัปโหลด ถ้าไม่มีใช้ภาพวาดตัวการ์ตูนนักเตะสีทีม */
export function avatar(p,size=40,{ring=false}={}){const ph=p&&p.photo?getPhoto(p.photo):null,cls='av'+(ring?' ring':'');
  if(ph)return`<img class="${cls}" src="${ph}" alt="${esc(playerName(p))}" style="width:${size}px;height:${size}px">`;
  if(!p)return`<span class="${cls}" style="width:${size}px;height:${size}px;background:var(--line)"></span>`;
  const a=p.av||{skin:'#e0ac7e',hair:'#1b1b1b',style:'short'},tc=teamColor(p.teamId),st=p.gender==='F'?'long':a.style,hairBack=st==='long'?HAIR.long(a.hair):'';
  return`<svg class="${cls}" style="width:${size}px;height:${size}px" viewBox="0 0 100 100" role="img" aria-label="${esc(playerName(p))}"><rect width="100" height="100" fill="${tc}"/><circle cx="50" cy="52" r="46" fill="#fff" opacity=".13"/>${hairBack}<path d="M10 100c2-22 18-30 40-30s38 8 40 30z" fill="#fff"/><path d="M14 100c3-18 18-26 36-26s33 8 36 26z" fill="${tc}"/><path d="M40 72l10 10 10-10" fill="none" stroke="#fff" stroke-width="4"/><rect x="43" y="60" width="14" height="14" rx="5" fill="${a.skin}"/><circle cx="50" cy="46" r="19" fill="${a.skin}"/>${st==='long'?'':HAIR[st]?.(a.hair)||''}${st==='long'?`<path d="M31 46c0-12 8-19 19-19s19 7 19 19c-5-5-10-8-19-8s-14 3-19 8z" fill="${a.hair}"/>`:''}<circle cx="43" cy="47" r="2.1" fill="#1b1b1b"/><circle cx="57" cy="47" r="2.1" fill="#1b1b1b"/><path d="M44 55q6 5 12 0" fill="none" stroke="#7a3b2e" stroke-width="2" stroke-linecap="round"/><text x="50" y="96" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800" font-size="13" fill="#fff">${p.no??''}</text></svg>`}
export const kpi=(label,val,sub='',icon='')=>`<div class="card kc"><div class="kl">${icon?`<span class="kic">${ic(icon)}</span>`:''}${esc(label)}</div><div class="kv">${val}</div><div class="ks">${sub}</div></div>`;
export const delta=(d,dec=1,unit='',goodUp=true)=>d==null||isNaN(d)?'':`<span class="dl ${Math.abs(d)<.05?'':((d>0)===goodUp?'up':'dn')}">${d>0?'▲':d<0?'▼':'■'} ${fNum(Math.abs(d),dec)}${unit}</span>`;
export const teamPill=id=>`<span class="tp"><i style="background:${teamColor(id)}"></i>${esc(teamName(id))}</span>`;
export const appLink=r=>location.origin+location.pathname.replace(/index\.html$/,'')+'#/'+r;
/** การ์ดนักเตะ (อัตราพลัง 6 ด้านจากคะแนนทักษะ) */
export function playerCard(p){const a=attrs(p),o=overall(p),tc=teamColor(p.teamId);
  return`<div class="pcard" style="--tc:${tc}"><div class="pc-top"><div class="pc-ov"><b>${o??'—'}</b><span>${esc(p.pos||'')}</span></div><div class="pc-brand">DEK SRANG<br>ACADEMY</div></div>
  <div class="pc-av">${avatar(p,132)}</div><div class="pc-n">${esc(playerName(p))}</div><div class="pc-t">${esc(teamName(p.teamId))} · #${p.no??''} · ${esc(posName(p.pos))}</div>
  <div class="pc-at">${['PAC','SHO','PAS','DRI','DEF','PHY'].map(k=>`<span><b>${a?a[k]:'—'}</b>${k}</span>`).join('')}</div>
  <div class="pc-ft"><span class="mono">${esc(p.code)}</span><span class="pc-qr">${qrSvg(appLink('players/'+p.id),2)}</span></div></div>`}
