# เชื่อม Google Sheet (ไม่บังคับ)

แอปทำงานได้เองโดยไม่ต้องเชื่อม — ข้อมูลเก็บในเครื่อง ถ้าต้องการสำรอง/ใช้หลายเครื่องให้เชื่อม Google Sheet ของคุณเอง

1. สร้าง Google Sheet ใหม่ → Extensions → Apps Script
2. วางโค้ดจาก `google-apps-script/Code.gs` แทนของเดิมทั้งหมด
3. แก้ `TOKEN` บรรทัดบนสุดเป็นรหัสลับของคุณเอง (ยาว 12 ตัวขึ้นไป เดายาก)
4. Deploy → New deployment → Web app → Execute as: **Me** · Who has access: **Anyone** → Deploy → อนุญาตสิทธิ์
5. คัดลอก Web app URL
6. ในแอป: ตั้งค่า → Google Sheet → วาง URL และ TOKEN → "ทดสอบการเชื่อมต่อ" → "เชื่อมต่อ"
7. เครื่องอื่น: กด "ลิงก์/QR ตั้งค่าให้เครื่องอื่น" แล้วเปิดลิงก์บนเครื่องนั้น (ลิงก์มี TOKEN ห้ามแชร์นอกองค์กร)

**สำคัญ:** TOKEN ในแอปต้องตรงกับ TOKEN ใน Code.gs เสมอ ถ้าแก้ Code.gs ภายหลังต้อง Deploy → Manage deployments → New version
ระบบสร้างแท็บ players / teams / coaches / sessions / att / meas / skills / tests / matches / mstats / well ให้เอง รูปถ่ายเก็บใน Google Drive โฟลเดอร์ "DEK SRANG Academy - Photos"
