import React, { useState, useEffect } from 'react';
import ProductFormModal from './ProductFormModal';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ProductTable = ({ products, onDeleteProduct, onSaveProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const openModal = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">รายการสินค้า</h3>
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="px-4 py-2 text-left">ชื่อสินค้า</th>
            <th className="px-4 py-2 text-left">ราคา</th>
            <th className="px-4 py-2 text-left">แท็ก</th>
            <th className="px-4 py-2 text-left">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b dark:border-gray-600">
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">{product.price}</td>
              <td className="px-4 py-2">{product.tag}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => openModal(product)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="ml-2 text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* แสดง modal สำหรับเพิ่ม/แก้ไขสินค้า */}
      {isModalOpen && (
        <ProductFormModal
          product={currentProduct}
          onClose={closeModal}
          onSave={onSaveProduct}
        />
      )}
    </div>
  );
};

export default ProductTable;
