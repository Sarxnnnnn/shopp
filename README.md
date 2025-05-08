# Shop Project

ระบบร้านค้าออนไลน์ที่พัฒนาด้วย React.js และ Node.js

## เทคโนโลยีที่ใช้

### Frontend
- React.js - JavaScript library สำหรับสร้าง user interface
- Tailwind CSS - Utility-first CSS framework
- Framer Motion - Animation library สำหรับ React
- Lucide React - Icon library
- Axios - HTTP client library

### Backend
- Node.js - Runtime environment
- Express.js - Web application framework
- MySQL - Database
- JWT - Authentication
- Bcrypt - Password hashing
- Multer - File upload handling
- Cloudinary - Cloud storage service

## การติดตั้ง

### ข้อกำหนดเบื้องต้น
- Node.js (version 14 หรือสูงกว่า)
- MySQL (version 5.7 หรือสูงกว่า)
- Git

### ขั้นตอนการติดตั้ง

1. Clone repository
```bash
git clone <repository-url>
cd shop
```

2. ติดตั้ง dependencies สำหรับ Frontend
```bash
cd frontend
npm install
```

3. ติดตั้ง dependencies สำหรับ Backend
```bash
cd ../backend
npm install
```

4. ตั้งค่าไฟล์ Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ backend:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=shop_db

# JWT Secret
JWT_SECRET=your_jwt_secret

# Cloudinary Configuration (ถ้าใช้)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. สร้างฐานข้อมูล MySQL
```sql
CREATE DATABASE shop_db;
```

6. รัน Migration (ถ้ามี)
```bash
cd backend
npm run migrate
```

### การรัน Development Server

1. รัน Backend Server
```bash
cd backend
npm run dev
```

2. รัน Frontend Development Server
```bash
cd frontend
npm run dev
```

เว็บไซต์จะทำงานที่:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## โครงสร้างโปรเจค

```
shop/
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── public/            # Static files
│
└── backend/               # Express application
    ├── config/           # Configuration files
    ├── routes/           # API routes
    ├── middleware/       # Express middlewares
    └── uploads/          # Uploaded files
```

## คุณสมบัติ

- ระบบสมาชิก (สมัครสมาชิก/เข้าสู่ระบบ)
- ระบบตะกร้าสินค้า
- ระบบชำระเงิน
- ระบบจัดการสินค้า (สำหรับแอดมิน)
- ระบบจัดการผู้ใช้ (สำหรับแอดมิน)
- Dark Mode
- Responsive Design

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - สมัครสมาชิก
- POST /api/auth/login - เข้าสู่ระบบ
- GET /api/auth/me - ดึงข้อมูลผู้ใช้ปัจจุบัน

### Product Endpoints
- GET /api/products - ดึงรายการสินค้าทั้งหมด
- GET /api/products/:id - ดึงข้อมูลสินค้าตาม ID
- POST /api/products (Admin) - เพิ่มสินค้าใหม่
- PUT /api/products/:id (Admin) - แก้ไขข้อมูลสินค้า
- DELETE /api/products/:id (Admin) - ลบสินค้า

### Order Endpoints
- GET /api/orders - ดึงรายการคำสั่งซื้อของผู้ใช้
- POST /api/orders - สร้างคำสั่งซื้อใหม่
- GET /api/orders/:id - ดึงข้อมูลคำสั่งซื้อตาม ID

### Payment Endpoints
- POST /api/payment/topup - เติมเงินเข้าระบบ
- POST /api/payment/verify - ยืนยันการชำระเงิน
- GET /api/payment/transactions - ดึงประวัติการทำธุรกรรม

## การพัฒนาเพิ่มเติม

1. Fork repository นี้
2. สร้าง branch ใหม่: `git checkout -b feature-name`
3. Commit การเปลี่ยนแปลง: `git commit -m 'Add new feature'`
4. Push ไปยัง branch: `git push origin feature-name`
5. สร้าง Pull Request

## License

โปรเจคนี้อยู่ภายใต้ MIT License - ดูรายละเอียดเพิ่มเติมได้ที่ [LICENSE](LICENSE)

