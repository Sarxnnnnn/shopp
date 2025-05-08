import React from 'react';
import { BadgeCheck, Flame, Star, Tag } from 'lucide-react';

const tagIcons = {
  new: <Star className="w-4 h-4 text-yellow-400" />,
  popular: <Flame className="w-4 h-4 text-red-500" />,
};

const ProductCard = ({ product, onShowDetail }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col">
      {/* Move tag to absolute position in top-right */}
      {product.tag && product.tag !== 'normal' && (
        <div className="absolute top-2 right-2 z-20 bg-white dark:bg-gray-700 px-2 py-1 rounded-full flex items-center shadow gap-1 text-xs font-semibold">
          {tagIcons[product.tag]}
          <span>{product.tag === 'new' ? 'สินค้าใหม่' : 'สินค้ายอดนิยม'}</span>
        </div>
      )}

      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-t-xl transition-transform duration-500 ease-in-out"
      />
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div className="relative">
          <h4 className="font-semibold text-md mb-1">{product.name}</h4>
          <p className="text-yellow-500 font-bold mb-2">{product.price}</p>

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
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
