import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', price: '', tag: '' });
  const { showNotification } = useNotification();
  const admin = JSON.parse(localStorage.getItem('admin'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await axios.get('/api/admin/products', {
          headers: { Authorization: `Bearer ${admin.token}` }
        });

        // Fetch tags
        const tagsRes = await axios.get('/api/admin/product-tags', {
          headers: { Authorization: `Bearer ${admin.token}` }
        });

        if (productsRes.data.success && tagsRes.data.success) {
          setProducts(productsRes.data.data);
          setTags(tagsRes.data.data);
        }
      } catch (error) {
        showNotification('ไม่สามารถโหลดข้อมูลได้', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [admin.token, showNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // เพิ่มฟังก์ชันสำหรับแสดงชื่อแท็กภาษาไทย
  const getTagDisplay = (tagName) => {
    const tag = tags.find(t => t.name === tagName);
    return tag ? tag.display_name : tagName;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ตรวจสอบว่า tag ที่เลือกมีอยู่ใน DB จริง
      const validTag = tags.find(t => t.name === form.tag);
      if (!validTag) {
        showNotification('แท็กที่เลือกไม่ถูกต้อง', 'error');
        return;
      }

      const response = await axios.post('/api/admin/products', form, {
        headers: { Authorization: `Bearer ${admin.token}` }
      });

      if (response.data.success) {
        setProducts(prev => [...prev, response.data.data]);
        showNotification('เพิ่มสินค้าสำเร็จ', 'success');
        setForm({ name: '', price: '', tag: '' });
      } else {
        showNotification('เกิดข้อผิดพลาดในการเพิ่มสินค้า', 'error');
      }
    } catch (error) {
      showNotification('ไม่สามารถบันทึกข้อมูลได้', 'error');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">จัดการสินค้า</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="ชื่อสินค้า"
          className="p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white mb-2"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="ราคา"
          className="p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white mb-2"
          required
        />
        <select
          name="tag"
          value={form.tag}
          onChange={handleChange}
          className="p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white mb-2"
          required
        >
          <option value="">เลือกแท็ก</option>
          {tags.map(tag => (
            <option key={tag.id} value={tag.name}>
              {tag.display_name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          เพิ่มสินค้า
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ชื่อสินค้า</th>
            <th className="border border-gray-300 px-4 py-2">ราคา</th>
            <th className="border border-gray-300 px-4 py-2">แท็ก</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td className="border border-gray-300 px-4 py-2">{product.name}</td>
              <td className="border border-gray-300 px-4 py-2">{product.price}</td>
              <td className="border border-gray-300 px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    tags.find(t => t.name === product.tag)?.color || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {getTagDisplay(product.tag)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;