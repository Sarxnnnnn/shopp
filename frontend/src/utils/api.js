import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// ฟังก์ชันสำหรับคำขอ API พร้อมการตรวจสอบสิทธิ์
export const fetchWithAuth = async (endpoint, options = {}, token) => {
  const authToken = token || localStorage.getItem('userToken') || localStorage.getItem('token');
  
  if (!authToken) {
    throw new Error('กรุณาเข้าสู่ระบบ');
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('โทเค็นไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่');
      }
      throw new Error(data.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// เพิ่มฟังก์ชันใหม่สำหรับ public API
export const fetchPublic = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลสินค้า
export const fetchProducts = async () => {
  return await fetchPublic('/api/products', { 
    method: 'GET'
  });
};

export const fetchPopularProducts = async () => {
  return await fetchPublic('/api/products/popular', {
    method: 'GET'
  });
};

export const fetchNormalProducts = async () => {
  return await fetchPublic('/api/products/normal', {
    method: 'GET'
  });
};

export const fetchNewProducts = async () => {
  return await fetchPublic('/api/products/new', {
    method: 'GET'
  });
};

export const fetchBalance = async (token) => {
  if (!token) {
    throw new Error('Token is required');
  }
  return await fetchWithAuth('/api/payment/balance', {
    method: 'GET'
  }, token);
};

// ฟังก์ชันสำหรับสร้างคำสั่งซื้อ
export const createOrder = async (orderData, token) => {
  if (!token) {
    throw new Error('กรุณาเข้าสู่ระบบ');
  }

  // Validate orderData
  if (!orderData) {
    throw new Error('ข้อมูลคำสั่งซื้อไม่ถูกต้อง');
  }

  if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
    throw new Error('กรุณาเลือกสินค้าที่ต้องการสั่งซื้อ');
  }

  if (typeof orderData.total !== 'number' || orderData.total <= 0) {
    throw new Error('ยอดรวมไม่ถูกต้อง');
  }

  if (!orderData.customer_name || typeof orderData.customer_name !== 'string') {
    throw new Error('กรุณาระบุชื่อผู้สั่งซื้อ');
  }
  
  return await fetchWithAuth('/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      items: orderData.items,
      total: orderData.total,
      customer_name: orderData.customer_name,
      status: 'รอดำเนินการ' // กำหนดค่า status ที่ถูกต้อง
    })
  }, token);
};

// ฟังก์ชันสำหรับดึงข้อมูลคำสั่งซื้อ
export const fetchOrders = async (token) => {
  if (!token) {
    throw new Error('กรุณาเข้าสู่ระบบก่อนดูประวัติการสั่งซื้อ');
  }

  try {
    const data = await fetchWithAuth('/api/orders', {
      method: 'GET'
    }, token);

    if (!data || !data.success) {
      throw new Error(data?.message || 'ไม่สามารถดึงข้อมูลประวัติการสั่งซื้อได้');
    }

    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error(error.message || 'ไม่สามารถดึงข้อมูลประวัติการสั่งซื้อได้');
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลคำสั่งซื้อเฉพาะรายการ
export const fetchOrderById = async (orderId, token) => {
  return await fetchWithAuth(`/api/orders/${orderId}`, {
    method: 'GET'
  }, token);
};

let settingsCache = null;
let lastFetch = 0;
let pendingPromise = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchSiteSettings = async () => {
  try {
    // Return cache if valid
    if (settingsCache && (Date.now() - lastFetch < CACHE_DURATION)) {
      console.debug('Using cached settings');
      return settingsCache;
    }

    // Return pending promise if exists
    if (pendingPromise) {
      console.debug('Using pending request');
      return pendingPromise;
    }

    console.debug('Fetching fresh settings');
    pendingPromise = axios.get(`${API_BASE_URL}/api/site-settings`)
      .then(response => {
        settingsCache = response.data;
        lastFetch = Date.now();
        pendingPromise = null;
        return response.data;
      })
      .catch(error => {
        pendingPromise = null;
        throw error;
      });

    return pendingPromise;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    throw error;
  }
};

export const updateSiteSettings = async (token, settings) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/admin/site-settings`, 
      { settings },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // Clear cache after update
    settingsCache = null;
    
    return response.data;
  } catch (error) {
    console.error('Error updating site settings:', error);
    throw error;
  }
};