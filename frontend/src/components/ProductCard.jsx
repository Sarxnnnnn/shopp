import React from 'react';
import { BadgeCheck, Flame, Star, Tag } from 'lucide-react';

const tagIcons = {
  แนะนำ: <BadgeCheck className="w-4 h-4 text-green-500" />,
  ขายดี: <Flame className="w-4 h-4 text-red-500" />,
  ใหม่: <Star className="w-4 h-4 text-yellow-400" />,
  ราคาพิเศษ: <Tag className="w-4 h-4 text-pink-500" />,
};

const ProductCard = ({ product, onShowDetail, onAddToCart }) => {
  const isOutOfStock = product.outOfStock;

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-t-xl transition-transform duration-500 ease-in-out"
      />
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="font-semibold text-md mb-1">{product.name}</h4>
          <p className="text-yellow-500 font-bold mb-2">{product.price}</p>

          {/* TAG BADGE */}
          {product.tag && (
            <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 px-2 py-1 rounded-full flex items-center shadow z-10 gap-1 text-xs font-semibold">
              {tagIcons[product.tag] || <Tag className="w-4 h-4" />}
              <span>{product.tag}</span>
            </div>
          )}

          {/* OUT OF STOCK BADGE */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded shadow z-10 animate-pulse">
              สินค้าหมด
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onShowDetail}
            className="flex-1 px-3 py-1 text-sm rounded-md border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white transition-all"
          >
            ดูรายละเอียด
          </button>
          <button
            onClick={onAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 px-3 py-1 text-sm rounded-md text-white transition-all ${
              isOutOfStock
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
          >
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
