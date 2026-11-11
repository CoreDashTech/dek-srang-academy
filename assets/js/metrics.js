/* นิยามตัวชี้วัด / ทักษะ / การทดสอบ / ค่าอ้างอิง (ปรับแก้ได้) */
export const SKILL_GROUPS=[
 {id:'tech',th:'เทคนิค',en:'Technical',c:'#2563eb',items:[['pas','การส่งบอล','Passing'],['dri','การเลี้ยงบอล','Dribbling'],['sho','การยิงประตู','Shooting'],['tch','การรับ-ควบคุมบอล','First touch'],['hdr','การโหม่ง','Heading']]},
 {id:'tac',th:'แทคติก',en:'Tactical',c:'#7c3aed',items:[['pos','การยืนตำแหน่ง','Positioning'],['dec','การตัดสินใจ','Decision making'],['def','การป้องกัน','Defending']]},
 {id:'phy',th:'ร่างกาย',en:'Physical',c:'#ea580c',items:[['spd','ความเร็ว','Speed'],['agi','ความคล่องตัว','Agility'],['str','ความแข็งแรง','Strength'],['end','ความอึด','Endurance']]},
 {id:'men',th:'จิตใจ',en:'Mental',c:'#16a34a',items:[['foc','สมาธิ','Focus'],['tmw','การทำงานเป็นทีม','Teamwork'],['dis','วินัย','Discipline']]}];
export const SK=SKILL_GROUPS.flatMap(g=>g.items.map(([k,th,en])=>({k,th,en,g:g.id,c:g.c})));
export const TESTS=[{k:'sp30',th:'วิ่งเร็ว 30 ม.',en:'30 m sprint',u:'s',low:true,d:2},{k:'tst',th:'วิ่งซิกแซก (T-test)',en:'Agility T-test',u:'s',low:true,d:2},{k:'jmp',th:'กระโดดสูง',en:'Vertical jump',u:'cm',d:0},{k:'bep',th:'บี๊บเทสต์ (ระดับ)',en:'Beep test (level)',u:'lv',d:1},{k:'rch',th:'นั่งงอตัว',en:'Sit & reach',u:'cm',d:0}];
export const POS=[['GK','ผู้รักษาประตู','Goalkeeper'],['DF','กองหลัง','Defender'],['MF','กองกลาง','Midfielder'],['FW','กองหน้า','Forward']];
export const ATT=[['p','มาซ้อม','Present'],['l','มาสาย','Late'],['a','ขาด','Absent'],['i','บาดเจ็บ/ป่วย','Injured / sick']];
/* ค่ากลางอ้างอิงโดยประมาณ (อิงแนวเส้นโค้งการเจริญเติบโตขององค์การอนามัยโลก) — ใช้เพื่อดูแนวโน้มเท่านั้น ไม่ใช่การวินิจฉัย; แก้ได้ในตั้งค่า */
export const REF_DEFAULT={
 M:{h:{6:115.5,7:121.7,8:127.3,9:132.6,10:137.8,11:143.1,12:149.1,13:156,14:163.2,15:169,16:172.9,17:175.2,18:176.5},w:{6:20.5,7:22.9,8:25.4,9:28.1,10:31.2,11:35.3,12:40.8,13:46.9,14:53,15:58.5,16:63,17:66.8,18:69.5}},
 F:{h:{6:114.6,7:120.8,8:127,9:132.6,10:138.4,11:144.8,12:151.3,13:156.4,14:159.8,15:161.7,16:162.5,17:163,18:163.2},w:{6:20,7:22.4,8:25,9:28.2,10:31.9,11:36.9,12:41.6,13:46.3,14:49.9,15:52.4,16:53.7,17:54.4,18:54.8}}};
export function refAt(ref,g,a,k){const t=(ref||REF_DEFAULT)[g==='F'?'F':'M'][k],ks=Object.keys(t).map(Number).sort((x,y)=>x-y);a=Math.max(ks[0],Math.min(ks[ks.length-1],a));const lo=Math.floor(a),hi=Math.min(ks[ks.length-1],lo+1),f=a-lo;return t[lo]+(t[hi]-t[lo])*f}
export const bmi=(h,w)=>h&&w?w/Math.pow(h/100,2):null;
export const SLEEP_GUIDE=a=>a<=12?[9,12]:[8,10];
