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
    <div className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col hover:shadow-xl transition-all duration-300 group">
      <div className="relative mb-3 bg-gray-50 rounded-xl overflow-hidden h-36 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
        />
        
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur px-2 py-0.5 rounded-lg text-[10px] font-black text-green-700 shadow-sm border border-green-100 flex items-center gap-1 uppercase tracking-tighter">
          <span className="animate-pulse">⏱</span> {product.deliveryTime}
        </div>

        {product.isOrganic && (
          <div className="absolute bottom-2 right-2 bg-green-600 text-white px-2 py-0.5 rounded-lg text-[9px] font-black shadow-lg shadow-green-900/20 uppercase">
            Verified Organic
          </div>
        )}
      </div>
      
      <div className="flex-1 px-1">
        <h3 className="text-sm font-black text-gray-800 line-clamp-2 min-h-[40px] leading-tight mb-1 group-hover:text-green-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mb-2">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.unit}</p>
           <p className="text-[9px] font-bold text-green-600/60 uppercase">Pesticide Free</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto p-1 bg-gray-50/50 rounded-xl border border-gray-100/50">
        <div className="flex flex-col ml-1">
          <span className="text-sm font-black text-gray-900 tracking-tighter">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-[9px] text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>

        {quantityInCart === 0 ? (
          <button 
            onClick={() => onAdd(product.id)}
            className="px-5 py-2 bg-white border-2 border-green-600 text-green-700 text-[11px] font-black rounded-xl hover:bg-green-600 hover:text-white active:scale-90 transition-all shadow-sm"
          >
            ADD
          </button>
        ) : (
          <div className="flex items-center bg-green-700 text-white rounded-xl px-2 py-1.5 gap-3 shadow-lg shadow-green-900/20">
            <button onClick={() => onRemove(product.id)} className="text-base font-black w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors">-</button>
            <span className="text-xs font-black w-4 text-center">{quantityInCart}</span>
            <button onClick={() => onAdd(product.id)} className="text-base font-black w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors">+</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;