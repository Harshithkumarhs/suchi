
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group border border-stone-100 relative overflow-hidden">
      <div 
        className="cursor-pointer" 
        onClick={() => onViewDetails(product)}
      >
        <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-stone-50">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">Certified Organic</span>
          <h3 className="font-semibold text-stone-800 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-stone-500">{product.unit}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <span className="font-bold text-lg text-stone-900">₹{product.price}</span>
        <button 
          onClick={() => onAddToCart(product)}
          className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
