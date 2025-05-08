const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const app = require('./src/app');

// Load environment variables
dotenv.config();

// ย้ายโค้ดทั้งหมดจาก server.js มารวมที่นี่
// ...existing cors and middleware setup...

// ย้าย routes ทั้งหมดจาก server.js มาที่นี่
// ...existing routes setup...

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
