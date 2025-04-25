import { useAuth } from '../contexts/AuthContext';

export const fetchProducts = async () => {
  const { user } = useAuth(); // ใช้ context เพื่อดึงข้อมูลผู้ใช้ (หรือใช้ token)
  
  const token = user?.token; // ดึง token จาก user หากมี

  const response = await fetch('http://localhost:3000/api/products', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    throw new Error('Fetch failed');
  }

  return await response.json();
};
