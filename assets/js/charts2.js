import {esc,fNum} from './util.js';
export function regress(pts){const n=pts.length;if(n<3)return null;const mx=pts.reduce((a,p)=>a+p.x,0)/n,my=pts.reduce((a,p)=>a+p.y,0)/n;let sxx=0,syy=0,sxy=0;pts.forEach(p=>{sxx+=(p.x-mx)**2;syy+=(p.y-my)**2;sxy+=(p.x-mx)*(p.y-my)});if(!sxx||!syy)return null;const b=sxy/sxx;return{b,a:my-b*mx,r:sxy/Math.sqrt(sxx*syy),n}}
const nice=(lo,hi,n=5)=>{const span=hi-lo||1,raw=span/n,p=Math.pow(10,Math.floor(Math.log10(raw))),f=raw/p,st=(f<1.5?1:f<3?2:f<7?5:10)*p,a=Math.floor(lo/st)*st,b=Math.ceil(hi/st)*st,t=[];for(let v=a;v<=b+st/2;v+=st)t.push(+v.toFixed(6));return t};
/** series:[{name,color,pts:[{x,y,t}],line,dash,reg,r,hollow}] */
export function xy(series,{w=680,h=380,xl='',yl='',xd=1,yd=1,yMin=null,xMin=null}={}){
  const all=series.flatMap(s=>s.pts);if(!all.length)return'';
  let x0=Math.min(...all.map(p=>p.x)),x1=Math.max(...all.map(p=>p.x)),y0=Math.min(...all.map(p=>p.y)),y1=Math.max(...all.map(p=>p.y));
  const px=(x1-x0||1)*.06,py=(y1-y0||1)*.08;x0-=px;x1+=px;y0-=py;y1+=py;if(yMin!=null)y0=Math.min(y0,yMin);if(xMin!=null)x0=Math.min(x0,xMin);
  const xt=nice(x0,x1),yt=nice(y0,y1);x0=xt[0];x1=xt[xt.length-1];y0=yt[0];y1=yt[yt.length-1];const dd=t=>{const st=t.length>1?t[1]-t[0]:1;return st>=1?0:Math.min(3,Math.ceil(-Math.log10(st)-1e-9))};xd=Math.max(xd>1?1:xd,dd(xt));yd=Math.max(yd>1?1:yd,dd(yt));
  const L=66,R=16,T=12,B=44,X=v=>L+(v-x0)/(x1-x0||1)*(w-L-R),Y=v=>h-B-(v-y0)/(y1-y0||1)*(h-T-B);
  let s=`<svg class="xy" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(xl)} / ${esc(yl)}">`;
  yt.forEach(v=>s+=`<line class="gl" x1="${L}" x2="${w-R}" y1="${Y(v)}" y2="${Y(v)}"/><text class="axt" x="${L-6}" y="${Y(v)+4}" text-anchor="end">${fNum(v,yd)}</text>`);
  xt.forEach(v=>s+=`<line class="gl" y1="${T}" y2="${h-B}" x1="${X(v)}" x2="${X(v)}"/><text class="axt" x="${X(v)}" y="${h-B+16}" text-anchor="middle">${fNum(v,xd)}</text>`);
  s+=`<text class="axl" x="${(L+w-R)/2}" y="${h-6}" text-anchor="middle">${esc(xl)}</text><text class="axl" transform="translate(14 ${(T+h-B)/2}) rotate(-90)" text-anchor="middle">${esc(yl)}</text>`;
  series.forEach(se=>{const pts=[...se.pts].sort((a,b)=>a.x-b.x);
    if(se.line&&pts.length>1)s+=`<polyline fill="none" stroke="${se.color}" stroke-width="${se.w||2.4}" ${se.dash?'stroke-dasharray="6 5"':''} stroke-linejoin="round" points="${pts.map(p=>X(p.x)+','+Y(p.y)).join(' ')}"/>`;
    if(se.reg){const g=regress(se.pts);if(g){const a=x0,b=x1;s+=`<line x1="${X(a)}" y1="${Y(g.a+g.b*a)}" x2="${X(b)}" y2="${Y(g.a+g.b*b)}" stroke="${se.regColor||'var(--ink)'}" stroke-width="2" stroke-dasharray="7 5" opacity=".75"/>`}}
    if(se.r!==0)pts.forEach(p=>s+=`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${p.big?se.r*1.7||8:se.r||4.5}" fill="${se.hollow?'var(--surface)':se.color}" stroke="${p.big?'var(--ink)':se.color}" stroke-width="${p.big?2.5:se.hollow?2:1}" fill-opacity="${se.hollow||p.big?1:.78}"><title>${esc(p.t||'')}</title></circle>`)});
  return s+'</svg>'}
export const legend=series=>`<div class="lgd">${series.filter(s=>s.name).map(s=>`<span><i style="background:${s.color};${s.dash?'opacity:.6':''}"></i>${esc(s.name)}</span>`).join('')}</div>`;
export function radar(axes,series,{size=340,max=10}={}){const c=size/2,R=size/2-58,n=axes.length,pt=(i,v)=>{const a=-Math.PI/2+i*2*Math.PI/n,r=R*v/max;return[c+Math.cos(a)*r,c+Math.sin(a)*r]};
  let s=`<svg class="rdr" viewBox="0 0 ${size} ${size}" role="img">`;[.25,.5,.75,1].forEach(f=>s+=`<polygon class="gl" fill="none" points="${axes.map((_,i)=>pt(i,max*f).join(',')).join(' ')}"/>`);
  axes.forEach((a,i)=>{const [x,y]=pt(i,max),[lx,ly]=pt(i,max*1.16);s+=`<line class="gl" x1="${c}" y1="${c}" x2="${x}" y2="${y}"/><text class="axt" x="${lx}" y="${ly+4}" text-anchor="${Math.abs(lx-c)<6?'middle':lx>c?'start':'end'}">${esc(a)}</text>`});
  series.forEach(se=>{const p=se.vals.map((v,i)=>pt(i,v==null?0:v));s+=`<polygon points="${p.map(q=>q.join(',')).join(' ')}" fill="${se.color}" fill-opacity="${se.fill??.22}" stroke="${se.color}" stroke-width="2.2" ${se.dash?'stroke-dasharray="6 4"':''}/>`;if(!se.dash)p.forEach((q,i)=>s+=`<circle cx="${q[0]}" cy="${q[1]}" r="3.4" fill="${se.color}"><title>${esc(axes[i])}: ${se.vals[i]==null?'-':fNum(se.vals[i],1)}</title></circle>`)});
  return s+'</svg>'}
