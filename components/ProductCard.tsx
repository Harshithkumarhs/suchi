
import React from 'react';
import { Product, CartItem } from '../types';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, quantityInCart, onAdd, onRemove }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col hover:shadow-md transition-shadow">
      <div className="relative mb-3 bg-gray-50 rounded-lg overflow-hidden h-32 flex items-center justify-center">
        <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-green-700 shadow-sm border border-green-100 uppercase tracking-tighter">
          {product.deliveryTime}
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px] leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-500 mb-2">{product.unit}</p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>

        {quantityInCart === 0 ? (
          <button 
            onClick={() => onAdd(product.id)}
            className="px-6 py-1.5 border border-green-600 text-green-600 text-xs font-bold rounded-lg hover:bg-green-50 active:scale-95 transition-all"
          >
            ADD
          </button>
        ) : (
          <div className="flex items-center bg-green-600 text-white rounded-lg px-2 py-1.5 gap-3 shadow-sm">
            <button onClick={() => onRemove(product.id)} className="text-sm font-bold w-4 h-4 flex items-center justify-center">-</button>
            <span className="text-xs font-bold w-3 text-center">{quantityInCart}</span>
            <button onClick={() => onAdd(product.id)} className="text-sm font-bold w-4 h-4 flex items-center justify-center">+</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
