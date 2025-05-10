import React from 'react';

const ProductCard = ({ product, onShowDetail }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-t-xl transition-transform duration-500 ease-in-out"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold text-yellow-500">฿{product.price}</p>
            <span className={`text-sm px-2 py-1 rounded-full ${
              product.stock > 20 
                ? 'bg-green-100 text-green-600' 
                : product.stock > 0
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-red-100 text-red-600'
            }`}>
              {product.stock > 20 
                ? 'มีสินค้า' 
                : product.stock > 0
                ? `เหลือ ${product.stock} ชิ้น`
                : 'สินค้าหมด'}
            </span>
          </div>
          <button
            onClick={onShowDetail}
            disabled={isOutOfStock}
            className={`w-full px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              isOutOfStock
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white hover:shadow-lg'
            }`}
          >
            {isOutOfStock ? 'สินค้าหมด' : 'ดูรายละเอียด'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
