import {S,by,playerName,teamName} from './store.js';
import {esc,T,nm,fNum,sum} from './util.js';
import {ic,head,ACT,IN,refresh} from './ui.js';
import {avatar} from './parts.js';
import {METRICS,metric} from './calc.js';
import {xy,legend,regress} from './charts2.js';
import {bars} from './charts.js';
export const title=()=>T('ห้องวิเคราะห์กราฟ','Analytics lab');
const st={x:'h',y:'w',team:'',hi:'',reg:true};
const PRE=[['h','w',T('ส่วนสูง ↔ น้ำหนัก','Height ↔ weight')],['age','h',T('อายุ ↔ ส่วนสูง','Age ↔ height')],['h','sp30',T('ส่วนสูง ↔ วิ่ง 30 ม.','Height ↔ 30 m sprint')],['w','jmp',T('น้ำหนัก ↔ กระโดด','Weight ↔ jump')],['sleep','fat',T('นอน ↔ เหนื่อย','Sleep ↔ fatigue')],['att','sk',T('เข้าซ้อม ↔ ทักษะ','Attendance ↔ skill')],['sk','rate',T('ทักษะ ↔ เรตติ้งแมตช์','Skill ↔ match rating')],['bmi','bep',T('BMI ↔ บี๊บเทสต์','BMI ↔ beep test')]];
const strength=r=>{const a=Math.abs(r);return a<.2?T('แทบไม่สัมพันธ์','almost none'):a<.4?T('สัมพันธ์น้อย','weak'):a<.7?T('สัมพันธ์ปานกลาง','moderate'):T('สัมพันธ์มาก','strong')};
const opt=(cur)=>METRICS.map(m=>`<option value="${m.k}" ${m.k===cur?'selected':''}>${esc(T(m.th,m.en))}${m.u?' ('+m.u+')':''}</option>`).join('');
export function render(){const mx=metric(st.x),my=metric(st.y),pl=S.players.filter(p=>!st.team||p.teamId===st.team);
  const rowsD=pl.map(p=>({p,x:mx.get(p),y:my.get(p)})).filter(r=>r.x!=null&&r.y!=null&&!isNaN(r.x)&&!isNaN(r.y));
  const teams=[...new Set(rowsD.map(r=>r.p.teamId))],all=rowsD.map(r=>({x:r.x,y:r.y})),g=regress(all);
  const series=teams.map(tid=>({name:teamName(tid),color:(by('teams',tid)||{}).color,r:5,pts:rowsD.filter(r=>r.p.teamId===tid).map(r=>({x:r.x,y:r.y,t:playerName(r.p)+' · '+fNum(r.x,mx.d)+' / '+fNum(r.y,my.d),big:r.p.id===st.hi}))}));
  if(st.reg&&g)series.push({name:T('เส้นแนวโน้มรวม','Trend line'),color:'var(--ink)',r:0,pts:all,reg:true});
  const meanBy=S.teams.map(t=>{const v=S.players.filter(p=>p.teamId===t.id).map(p=>my.get(p)).filter(x=>x!=null&&!isNaN(x));return v.length?sum(v)/v.length:0});
  return`${head(T('ห้องวิเคราะห์กราฟ','Analytics lab'),T('เลือกตัวชี้วัด 2 อย่างเพื่อดูความสัมพันธ์ เช่น ส่วนสูงกับน้ำหนัก หรือการนอนกับความเหนื่อย','Pick any two measures to see how they relate — e.g. height vs weight, sleep vs fatigue'))}
  <div class="card"><div class="chips" style="margin-bottom:14px">${PRE.map(([x,y,l])=>`<button class="chip ${st.x===x&&st.y===y?'on':''}" data-act="anPre" data-x="${x}" data-y="${y}">${esc(l)}</button>`).join('')}</div>
  <div class="fg an-f"><div class="ff"><label for="an_x">${T('แกน X','X axis')}</label><select id="an_x" class="fld" data-in="anSel" data-k="x">${opt(st.x)}</select></div><div class="ff"><label for="an_y">${T('แกน Y','Y axis')}</label><select id="an_y" class="fld" data-in="anSel" data-k="y">${opt(st.y)}</select></div>
  <div class="ff"><label for="an_t">${T('ทีม','Team')}</label><select id="an_t" class="fld" data-in="anSel" data-k="team"><option value="">${T('ทุกทีม','All teams')}</option>${S.teams.map(t=>`<option value="${t.id}" ${t.id===st.team?'selected':''}>${esc(nm(t.name))}</option>`).join('')}</select></div>
  <div class="ff"><label for="an_h">${T('เน้นนักเตะ','Highlight player')}</label><select id="an_h" class="fld" data-in="anSel" data-k="hi"><option value="">—</option>${pl.map(p=>`<option value="${p.id}" ${p.id===st.hi?'selected':''}>${esc(playerName(p))}</option>`).join('')}</select></div></div></div>
  <div class="g g2 an-g"><div class="card"><h2 class="h2">${esc(T(my.th,my.en))} ↔ ${esc(T(mx.th,mx.en))}</h2>${rowsD.length?xy(series,{xl:T(mx.th,mx.en)+(mx.u?' ('+mx.u+')':''),yl:T(my.th,my.en)+(my.u?' ('+my.u+')':''),xd:mx.d>1?1:mx.d,yd:my.d>1?1:my.d,h:400}):`<div class="empty-s">${T('ข้อมูลไม่พอสำหรับตัวชี้วัดนี้','Not enough data for these measures')}</div>`}${legend(series)}</div>
  <div class="card"><h2 class="h2">${T('สรุปความสัมพันธ์','What the data says')}</h2>${g?`<div class="rbig"><b>r = ${fNum(g.r,2)}</b><span class="pill ${Math.abs(g.r)>=.4?'in':''}">${strength(g.r)}</span></div>
   <p>${g.r>0?T('ค่า X เพิ่ม → ค่า Y มีแนวโน้มเพิ่ม','As X rises, Y tends to rise'):T('ค่า X เพิ่ม → ค่า Y มีแนวโน้มลด','As X rises, Y tends to fall')}.</p>
   <div class="kv2"><span>${T('จำนวนนักเตะ','Players')}<b>${g.n}</b></span><span>${T('ความชัน','Slope')}<b>${fNum(g.b,3)}</b></span><span>R²<b>${fNum(g.r*g.r,2)}</b></span></div>
   <p class="mut" style="font-size:.88rem">${T('ทุก +1 หน่วยของ X ค่า Y เปลี่ยนประมาณ ','Each +1 in X ≈ ')}<b>${fNum(g.b,2)}</b> ${esc(my.u||'')}.</p>
   <div class="note" style="margin-top:8px">${ic('info')}<span>${T('ความสัมพันธ์ไม่ได้แปลว่าเป็นเหตุและผล — เด็กโตขึ้นทั้งส่วนสูงและน้ำหนักจึงสัมพันธ์กันสูงตามอายุ ลองเลือกทีมเดียวเพื่อลดผลของอายุ','Correlation is not causation — height and weight both rise with age; pick a single team to reduce the age effect.')}</span></div>`:`<div class="empty-s">${T('ต้องมีข้อมูลอย่างน้อย 3 คน','Need at least 3 players with data')}</div>`}
  <h3 class="fgh" style="margin-top:16px">${T('ค่าเฉลี่ยของ','Team average of')} ${esc(T(my.th,my.en))}</h3>${bars(S.teams.map(t=>nm(t.name)),[{name:T(my.th,my.en),vals:meanBy,color:'var(--accent)'}],{fmt:v=>fNum(v,my.d>1?1:my.d),h:110})}</div></div>
  <div class="card"><h2 class="h2">${T('ตารางข้อมูล','Data table')}</h2><div class="tbw"><table class="tb"><thead><tr><th>${T('นักเตะ','Player')}</th><th>${T('ทีม','Team')}</th><th class="r">${esc(T(mx.th,mx.en))}</th><th class="r">${esc(T(my.th,my.en))}</th></tr></thead><tbody>${[...rowsD].sort((a,b)=>a.x-b.x).map(r=>`<tr data-go="#/players/${r.p.id}" tabindex="0"><td>${avatar(r.p,26)} ${esc(playerName(r.p))}</td><td>${esc(teamName(r.p.teamId))}</td><td class="r mono">${fNum(r.x,mx.d)}</td><td class="r mono">${fNum(r.y,my.d)}</td></tr>`).join('')}</tbody></table></div></div>`}
ACT.anPre=b=>{st.x=b.dataset.x;st.y=b.dataset.y;refresh()};IN.anSel=el=>{st[el.dataset.k]=el.value;refresh()};
