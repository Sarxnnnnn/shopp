import React, { useState, useEffect } from 'react';

const ProductFormModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    stock: product?.stock || '',
    description: product?.description || '',
    status: product?.status || 'พร้อมขาย',
    image: null,
    imagePreview: product?.image || null
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        stock: product.stock || '',
        description: product.description || '',
        status: product.status || 'พร้อมขาย',
        image: null,
        imagePreview: product.image || null
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'image') {
      setFormData({
        ...formData,
        image: files[0],
        imagePreview: URL.createObjectURL(files[0])
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!formData.name?.trim()) {
        throw new Error('กรุณากรอกชื่อสินค้า');
      }
      if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
        throw new Error('กรุณากรอกราคาที่ถูกต้อง');
      }
      if (!formData.stock || isNaN(formData.stock) || formData.stock < 0) {
        throw new Error('กรุณากรอกจำนวนสต็อกที่ถูกต้อง');
      }

      const data = new FormData();
      // เพิ่มข้อมูลเข้า FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'imagePreview' && formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      
      await onSave(data);
      onClose();
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
        >
          &times;
        </button>

        <h3 className="text-xl font-bold mb-4">{product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold">ชื่อสินค้า</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-semibold">ราคา</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="stock" className="block text-sm font-semibold">จำนวนสินค้าในสต็อก</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-semibold">รายละเอียด</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-semibold">สถานะ</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="พร้อมขาย">พร้อมขาย</option>
              <option value="หมด">หมด</option>
              <option value="รอเติมสินค้า">รอเติมสินค้า</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-semibold">รูปภาพสินค้า</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
            {formData.imagePreview && (
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="mt-2 w-full h-auto rounded-md"
              />
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              type="submit"
              className="py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'กำลังบันทึก...' : product ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;