
import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onClose: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onClose, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-stone-50 shadow-2xl flex flex-col animate-slide-in">
        <div className="p-6 border-b bg-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            My Basket <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">{items.length} items</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400">
              <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <p>Your organic basket is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-stone-100">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <h4 className="font-semibold text-stone-800">{item.name}</h4>
                  <p className="text-xs text-stone-500">{item.unit}</p>
                  <p className="text-sm font-bold text-green-700 mt-1">₹{item.price * item.quantity}</p>
                </div>
                <div className="flex items-center gap-3 bg-stone-50 rounded-lg p-1 border">
                  <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm">-</button>
                  <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-white border-t space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-500">Delivery Fee (Organic Express)</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Grand Total</span>
              <span>₹{total}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
