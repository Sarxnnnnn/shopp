import React, { useState } from 'react';

export default function AddSectionModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [productType, setProductType] = useState('normal');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ title, product_type: productType });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">เพิ่มส่วนแสดงผลใหม่</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">ชื่อส่วน</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">ประเภทสินค้า</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="normal">สินค้าทั่วไป</option>
              <option value="new">สินค้าใหม่</option>
              <option value="popular">สินค้ายอดนิยม</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              เพิ่ม
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
