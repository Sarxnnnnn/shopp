import React, { useState, useEffect } from 'react';

const ProductFormModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    tag: '',
    image: '',
    outOfStock: false,
  });

  // ถ้ามี product ให้โหลดข้อมูลเพื่อแก้ไข
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        tag: product.tag,
        image: product.image,
        outOfStock: product.outOfStock,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose(); // ปิด modal หลังบันทึก
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
            <label htmlFor="tag" className="block text-sm font-semibold">แท็ก</label>
            <select
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">เลือกแท็ก</option>
              <option value="แนะนำ">แนะนำ</option>
              <option value="ขายดี">ขายดี</option>
              <option value="ใหม่">ใหม่</option>
              <option value="ราคาพิเศษ">ราคาพิเศษ</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-semibold">ลิงค์รูปภาพ</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="outOfStock" className="flex items-center text-sm font-semibold">
              <input
                type="checkbox"
                id="outOfStock"
                name="outOfStock"
                checked={formData.outOfStock}
                onChange={handleChange}
                className="mr-2"
              />
              สินค้าหมด
            </label>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              type="submit"
              className="py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              {product ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
