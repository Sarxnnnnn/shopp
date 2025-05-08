require('dotenv').config();
const mysql = require('mysql2/promise');

// เชื่อมต่อฐานข้อมูลโดยใช้ค่าจาก Railway หรือ Local ถ้าไม่มี
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'shop_db',
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // เพิ่ม SSL สำหรับ Production
  ssl: process.env.NODE_ENV === 'production' ? {} : false
});

// Add connection error handling
pool.on('error', (err) => {
  console.error('Database error:', err);
});

// Test connection on startup
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error);
  });

module.exports = pool;