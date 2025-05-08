import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, PlusCircle, ChevronLeft, ChevronRight, Boxes } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { ENDPOINTS, getAuthHeader } from '../../config/apiConfig';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const { admin } = useAdminAuth();
  const { showNotification } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/products', {
          headers: { Authorization: `Bearer ${admin.token}` }
        });
        // Ensure we're setting an array, even if empty
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching products:', err);
        showNotification('ไม่สามารถดึงข้อมูลสินค้าได้', 'error');
        setProducts([]); // Set empty array on error
      }
    };
    fetchProducts();
  }, [admin.token, showNotification]);

  const handleAddProduct = async (formData) => {
    try {
      // Convert FormData to a regular object
      const productData = {
        name: formData.get('name'),
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        description: formData.get('description') || '',
        status: formData.get('status') || 'พร้อมขาย',
        tag: formData.get('tag') || 'normal',
        is_active: true
      };

      const response = await axios.post('http://localhost:3000/api/admin/products', productData, {
        headers: { 
          Authorization: `Bearer ${admin.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setProducts(prev => [...prev, response.data.product]);
        showNotification('เพิ่มสินค้าสำเร็จ', 'success');
        setShowForm(false);
      }
    } catch (err) {
      console.error('Error adding product:', err.response?.data || err);
      showNotification(
        err.response?.data?.message || 'ไม่สามารถเพิ่มสินค้าได้', 
        'error'
      );
    }
  };

  const handleEditProduct = async (formData) => {
    try {
      const fileInput = formData.get('image');
      let imageBase64 = null;

      if (fileInput instanceof File) {
        // Check file size (5MB limit)
        if (fileInput.size > 5 * 1024 * 1024) {
          showNotification('ขนาดไฟล์ต้องไม่เกิน 5MB', 'error');
          return;
        }
        // Compress and convert image
        const compressedFile = await compressImage(fileInput);
        imageBase64 = await convertToBase64(compressedFile);
      }

      const jsonData = {
        name: formData.get('name'),
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        description: formData.get('description') || '',
        status: formData.get('status') || 'พร้อมขาย',
        tag: formData.get('tag') || 'normal',
        image: imageBase64 || editProduct.image
      };

      const response = await axios.put(
        `http://localhost:3000/api/admin/products/${editProduct.id}`,
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setProducts(products.map(p => 
          p.id === editProduct.id ? response.data.product : p
        ));
        showNotification('แก้ไขสินค้าสำเร็จ', 'success');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showNotification(error.response?.data?.message || 'ไม่สามารถแก้ไขสินค้าได้', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      
      if (response.data.success) {
        setProducts(products.filter(p => p.id !== id));
        showNotification('ลบสินค้าสำเร็จ', 'success');
      } else {
        showNotification(response.data.message || 'ไม่สามารถลบสินค้าได้', 'error');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      showNotification(
        err.response?.data?.message || 'ไม่สามารถลบสินค้าได้', 
        'error'
      );
    }
  };

  const openEditForm = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  return (
    <div className="space-y-4"> 
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Boxes className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold text-yellow-500">จัดการสินค้า</h1>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
          onClick={() => {
            setShowForm(true);
            setEditProduct(null);
          }}
        >
          <PlusCircle size={18} />
          เพิ่มสินค้าใหม่
        </button>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">ไม่มีข้อมูลสินค้า</div>
      ) : (
        <>
          {/* Pagination Controls - Moved up and restyled */}
          <div className="flex justify-between items-center bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, products.length)} จากทั้งหมด {products.length} รายการ
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">หน้า {currentPage} จาก {totalPages}</span>
              <div className="flex gap-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded flex items-center gap-1 transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-500'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  <ChevronLeft size={16} />
                  <span>ก่อนหน้า</span>
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1.5 rounded flex items-center gap-1 transition-colors ${
                    currentPage >= totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-500'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  <span>ถัดไป</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse rounded-xl overflow-hidden shadow">
              <thead className="bg-yellow-500 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">รหัสสินค้า</th>
                  <th className="px-4 py-2 text-left">ชื่อสินค้า</th>
                  <th className="px-4 py-2">ราคา</th>
                  <th className="px-4 py-2">สต็อก</th>
                  <th className="px-4 py-2">หมวดหมู่</th>
                  <th className="px-4 py-2">สถานะ</th>
                  <th className="px-4 py-2">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
                {currentItems.map((product) => product && (
                  <tr key={product.id || `temp-${Math.random()}`} className="border-b border-gray-200 dark:border-zinc-700">
                    <td className="px-4 py-3 text-sm font-mono">{product.id || '-'}</td>
                    <td className="px-4 py-3">{product.name || '-'}</td>
                    <td className="px-4 py-3">฿{product.price || 0}</td>
                    <td className="px-4 py-3 text-center">{product.stock || 0}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {product.tag || 'normal'}
                      </span>
                    </td>
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
                        {product.status || 'ไม่ระบุ'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button 
                        onClick={() => product?.id && openEditForm(product)} 
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => product?.id && handleDelete(product.id)} 
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showForm && (
        <div className="fixed inset-0 flex items-start justify-center mt-20 z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-xl w-full max-w-xl shadow-2xl relative">
            <ProductFormModal
              onClose={() => {
                setShowForm(false);
                setEditProduct(null);
              }}
              onSave={editProduct ? handleEditProduct : handleAddProduct}
              product={editProduct}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ProductFormModal({ onClose, onSave, product }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price || '',
    stock: product?.stock || '',
    description: product?.description || '',
    status: product?.status || 'พร้อมขาย',
    tag: product?.tag || 'normal',
    image: null,
    imagePreview: product?.image || null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
          return;
        }
        if (!file.type.startsWith('image/')) {
          alert('กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น');
          return;
        }
        setForm(prev => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file)
        }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== 'imagePreview') {
          formData.append(key, form[key]);
        }
      });
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
      </h2>
        
        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">รูปภาพสินค้า</label>
          <div className="flex justify-center">
            {form.imagePreview ? (
              // แสดงรูปพรีวิวพร้อมปุ่มลบ
              <div className="relative w-full h-48">
                <img
                  src={form.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain rounded border border-gray-300 dark:border-gray-600"
                />
                <button
                  onClick={() => setForm(prev => ({ ...prev, image: null, imagePreview: null }))}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              // แสดงช่องอัพโหลดเมื่อยังไม่มีรูป
              <label className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors">
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="mt-2 text-gray-600 dark:text-gray-400">เลือกรูปภาพ</span>
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Other form fields */}
        <div className="grid grid-cols-2 gap-4">
          <input 
            name="name" 
            placeholder="ชื่อสินค้า" 
            value={form.name}
            onChange={handleChange} 
            className="col-span-2 p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white" 
          />
          <input 
            name="price" 
            placeholder="ราคา (บาท)" 
            type="number" 
            value={form.price}
            onChange={handleChange} 
            className="p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white" 
          />
          <input 
            name="stock" 
            placeholder="จำนวนในสต็อก" 
            type="number" 
            value={form.stock}
            onChange={handleChange} 
            className="p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white" 
          />
          
          {/* New fields */}
          <textarea 
            name="description" 
            placeholder="รายละเอียดสินค้า" 
            value={form.description}
            onChange={handleChange} 
            className="col-span-2 p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white h-24" 
          />
          
          <select 
            name="tag" 
            value={form.tag}
            onChange={handleChange} 
            className="p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
          >
            <option value="normal">สินค้าทั่วไป</option>
            <option value="new">สินค้าใหม่</option>
            <option value="popular">สินค้ายอดนิยม</option>
            <option value="food">อาหาร</option>
            <option value="drink">เครื่องดื่ม</option>
            <option value="snack">ขนม</option>
            <option value="dessert">ของหวาน</option>
            <option value="other">อื่นๆ</option>
          </select>

          <select 
            name="status" 
            value={form.status}
            onChange={handleChange} 
            className="p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
          >
            <option value="พร้อมขาย">พร้อมขาย</option>
            <option value="สินค้าหมด">สินค้าหมด</option>
            <option value="ปิดการขาย">ปิดการขาย</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-300 dark:bg-zinc-600 rounded hover:bg-gray-400 dark:hover:bg-zinc-700 text-black dark:text-white transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            บันทึก
          </button>
        </div>
    </div>
  );
}

// Helper functions for image handling
const compressImage = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          }));
        }, 'image/jpeg', 0.7);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
