
import React, { useState } from 'react';
import { CartItem } from '../types';
import { getRecipeSuggestions } from '../services/geminiService';

interface CartDrawerProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ items, isOpen, onClose, onAdd, onRemove, onCheckout }) => {
  const [recipes, setRecipes] = useState<string | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 25;
  const total = subtotal + deliveryFee;

  const handleAIHelp = async () => {
    setLoadingRecipe(true);
    try {
      const result = await getRecipeSuggestions(items);
      setRecipes(result || "Could not generate recipes.");
    } catch (err) {
      setRecipes("Suchi AI is currently busy. Please try in a moment.");
    } finally {
      setLoadingRecipe(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="font-black text-2xl tracking-tighter text-gray-900">Suchi Basket</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{items.length} Organic Selections</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <span className="text-6xl grayscale opacity-50">🥬</span>
              <div className="text-center">
                <p className="font-bold text-gray-800">Your basket is pure emptiness</p>
                <p className="text-xs">Fill it with Suchi's finest organic produce.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-gray-800 leading-tight mb-0.5">{item.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.unit} • ₹{item.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center bg-green-50 rounded-xl p-1 border border-green-100">
                        <button onClick={() => onRemove(item.id)} className="w-6 h-6 flex items-center justify-center text-green-600 font-bold hover:bg-white rounded-lg transition-colors">-</button>
                        <span className="text-xs font-black text-green-700 px-2">{item.quantity}</span>
                        <button onClick={() => onAdd(item.id)} className="w-6 h-6 flex items-center justify-center text-green-600 font-bold hover:bg-white rounded-lg transition-colors">+</button>
                      </div>
                      <span className="text-xs font-black text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Recipe Section */}
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 text-white shadow-lg shadow-green-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl rotate-12">🥗</div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🪄</span>
                      <h3 className="font-black text-base tracking-tight">Suchi Smart Chef</h3>
                    </div>
                  </div>
                  {recipes ? (
                    <div className="text-xs text-green-50 prose prose-invert whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto no-scrollbar">
                      {recipes}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs font-medium text-green-50 leading-relaxed">
                        I can suggest amazing organic recipes based on your current basket.
                      </p>
                      <button 
                        onClick={handleAIHelp}
                        disabled={loadingRecipe}
                        className="w-full bg-white text-green-700 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-green-900/20 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {loadingRecipe ? 'Consulting Farmers...' : 'Generate Recipes'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-6">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Freshness Total</span>
                  <span className="text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Carbon-Neutral Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}>
                    {deliveryFee === 0 ? 'COMPLIMENTARY' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4 border-t border-dashed border-gray-200 text-gray-900">
                  <span className="tracking-tighter">Total</span>
                  <span className="tracking-tighter">₹{total}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 bg-gray-50/80 backdrop-blur-sm border-t border-gray-100">
          <button 
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-green-100 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:shadow-none flex items-center justify-center gap-3"
          >
            ORDER FROM SUCHI
            <span className="text-sm font-bold opacity-70 px-2 py-1 bg-green-900/20 rounded-lg">₹{total}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
