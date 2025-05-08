import axios from 'axios';

// ตั้งค่า URL สำหรับ API Authentication
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/auth';

// ฟังก์ชันสำหรับเข้าสู่ระบบ
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password }, { timeout: 5000 });
    return res.data;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error.response?.data || error.message);

    // ลบ token ถ้าการยืนยันตัวตนล้มเหลว
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken'); 
    }

    // จัดการข้อผิดพลาดต่างๆ
    if (error.response) {
      throw error.response.data || { message: 'เข้าสู่ระบบไม่สำเร็จ' };
    } else if (error.request) {
      throw { message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง' };
    } else {
      throw { message: 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่' };
    }
  }
};

// ฟังก์ชันสำหรับสมัครสมาชิก
export const registerUser = async (name, email, password) => {
  try {
    const res = await axios.post(`${API_URL}/register`, { name, email, password }, { timeout: 5000 });
    return res.data;
  } catch (error) {
    console.error('❌ Register error:', error.response?.data || error.message);

    // ตรวจสอบข้อผิดพลาดและส่งข้อความที่เหมาะสม
    if (error.response) {
      throw error.response.data || { message: 'Registration failed' };
    } else if (error.request) {
      throw { message: 'No response from server. Please try again later.' };
    } else {
      throw { message: 'An unexpected error occurred. Please try again.' };
    }
  }
};