require('dotenv').config();
const express = require('express');
const path = require('path');
const app = require('./app');

const PORT = process.env.PORT || 3000;

// ตั้งค่า static directory สำหรับไฟล์รูปภาพ
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// อย่าลืมสร้างโฟลเดอร์ด้วย
const uploadDir = path.join(__dirname, 'public/uploads');
if (!require('fs').existsSync(uploadDir)){
    require('fs').mkdirSync(uploadDir, { recursive: true });
}

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  server.close(() => process.exit(1));
});
