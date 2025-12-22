
import React, { useState } from 'react';
import { getMealSuggestions } from '../services/geminiService';
import { CartItem } from '../types';

interface AISuggestionsProps {
  cart: CartItem[];
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ cart }) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGetSuggestions = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    const result = await getMealSuggestions(cart);
    setSuggestion(result);
    setLoading(false);
  };

  return (
    <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 my-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-emerald-600 p-2 rounded-xl text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-emerald-900">Shuchi Meal Planner</h3>
          <p className="text-sm text-emerald-700">Get AI-powered recipe ideas from your cart</p>
        </div>
      </div>

      {!suggestion ? (
        <button
          onClick={handleGetSuggestions}
          disabled={loading || cart.length === 0}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Analyze my Basket'}
        </button>
      ) : (
        <div className="bg-white/60 p-5 rounded-2xl border border-emerald-100 prose prose-stone max-w-none text-stone-700 leading-relaxed whitespace-pre-wrap text-sm">
          {suggestion}
          <div className="mt-4">
            <button 
              onClick={() => setSuggestion('')}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Clear Suggestions
            </button>
          </div>
        </div>
      )}
      
      {cart.length === 0 && !suggestion && (
        <p className="text-xs text-emerald-600 mt-2">Add items to your basket to unlock recipe ideas!</p>
      )}
    </div>
  );
};

export default AISuggestions;
