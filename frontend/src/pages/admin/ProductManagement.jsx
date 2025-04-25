import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // ดึงข้อมูลสินค้าเมื่อเพจโหลด
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products'); // API สำหรับดึงข้อมูลสินค้า
        setProducts(response.data);
      } catch (err) {
        console.error('ไม่สามารถดึงข้อมูลสินค้าได้', err);
      }
    };
    fetchProducts();
  }, []);

  // เพิ่มสินค้าใหม่
  const handleAddProduct = async (newProduct) => {
    try {
      const response = await axios.post('/api/products', newProduct); // API สำหรับเพิ่มสินค้า
      setProducts((prev) => [...prev, response.data]);
      setShowForm(false);
    } catch (err) {
      console.error('ไม่สามารถเพิ่มสินค้าได้', err);
    }
  };

  // ลบสินค้า
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`); // API สำหรับลบสินค้า
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error('ไม่สามารถลบสินค้าได้', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-500">จัดการสินค้า</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
          onClick={() => setShowForm(true)}
        >
          <PlusCircle size={18} />
          เพิ่มสินค้าใหม่
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse rounded-xl overflow-hidden shadow">
          <thead className="bg-yellow-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left">ชื่อสินค้า</th>
              <th className="px-4 py-2">ราคา</th>
              <th className="px-4 py-2">สต็อก</th>
              <th className="px-4 py-2">สถานะ</th>
              <th className="px-4 py-2">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-200 dark:border-zinc-700">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">฿{product.price}</td>
                <td className="px-4 py-3 text-center">{product.stock}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      product.status === 'พร้อมขาย'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : product.status === 'สินค้าหมด'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2 justify-center">
                  <button className="text-blue-600 dark:text-blue-400 hover:underline">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 dark:text-red-400 hover:underline">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  ไม่มีข้อมูลสินค้า
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Product Form Modal (ถ้าต้องการ เพิ่ม/แก้ไขสินค้า) */}
      {showForm && (
        <ProductFormModal
          onClose={() => setShowForm(false)}
          onSave={handleAddProduct}
        />
      )}
    </div>
  );
}

// ตัวอย่าง ProductFormModal (สามารถปรับแก้เพิ่มเติมได้)
function ProductFormModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    status: 'พร้อมขาย',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // ตรวจสอบข้อมูลเบื้องต้น
    if (form.name && form.price && form.stock) {
      onSave(form);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-full max-w-xl shadow-lg">
        <h2 className="text-lg font-bold mb-4">เพิ่มสินค้าใหม่</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="ชื่อสินค้า" onChange={handleChange} className="col-span-2 p-2 border rounded" />
          <input name="price" placeholder="ราคา (บาท)" type="number" onChange={handleChange} className="p-2 border rounded" />
          <input name="stock" placeholder="จำนวนในสต็อก" type="number" onChange={handleChange} className="p-2 border rounded" />
          <select name="status" onChange={handleChange} className="p-2 border rounded">
            <option value="พร้อมขาย">พร้อมขาย</option>
            <option value="สินค้าหมด">สินค้าหมด</option>
            <option value="ปิดการขาย">ปิดการขาย</option>
          </select>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">ยกเลิก</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">บันทึก</button>
        </div>
      </div>
    </div>
  );
}
