
import React, { useState, useMemo } from 'react';
import { PRODUCTS } from './constants';
import { Product, CartItem, Category } from './types';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AISuggestions from './components/AISuggestions';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['All', ...Object.values(Category)];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <h1 className="text-xl font-bold tracking-tight text-stone-900 hidden sm:block">Shuchi</h1>
          </div>
          
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search organic produce..." 
                className="w-full bg-stone-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-green-500 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <span>{cartCount} Items</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="bg-stone-900 rounded-[2.5rem] overflow-hidden relative mb-8 aspect-[21/9] sm:aspect-[21/6]">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&h=400&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            alt="Organic Farms"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
            <span className="text-green-400 font-bold tracking-widest text-xs uppercase mb-2">100% Earth Friendly</span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Farm-to-Door<br/>Organic Goodness.</h2>
            <p className="text-stone-300 max-w-sm hidden sm:block">Directly sourced from certified organic farmers across India. No pesticides, ever.</p>
          </div>
        </div>

        {/* AI Section */}
        <AISuggestions cart={cart} />

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as Category | 'All')}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-100' 
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart}
              onViewDetails={setSelectedProduct}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-stone-400">No organic produce found for your search.</p>
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedProduct(null)} />
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden relative animate-scale-up">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 z-10 p-2 bg-white/80 rounded-full text-stone-900 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="h-64 overflow-hidden">
              <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{selectedProduct.category}</span>
                  <h2 className="text-3xl font-bold text-stone-900 mt-2">{selectedProduct.name}</h2>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-stone-900">₹{selectedProduct.price}</p>
                  <p className="text-sm text-stone-500">per {selectedProduct.unit}</p>
                </div>
              </div>
              <p className="text-stone-600 leading-relaxed mb-6">{selectedProduct.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-stone-50 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-stone-400 uppercase mb-1">Key Benefit</p>
                  <p className="text-sm font-semibold text-stone-800">{selectedProduct.benefits}</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-stone-400 uppercase mb-1">Origin Farm</p>
                  <p className="text-sm font-semibold text-stone-800">{selectedProduct.origin}</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-colors"
              >
                Add to Basket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <Cart 
          items={cart} 
          onUpdateQuantity={updateQuantity} 
          onClose={() => setIsCartOpen(false)}
          onCheckout={() => {
            alert("This is an MVP! In a real app, this would take you to the payment gateway.");
            setCart([]);
            setIsCartOpen(false);
          }}
        />
      )}

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-stone-100 flex items-center justify-between md:hidden z-30">
        <div className="flex flex-col">
          <span className="text-xs text-stone-400 uppercase font-bold">Total Price</span>
          <span className="text-xl font-bold text-stone-900">₹{cart.reduce((s, i) => s + i.price * i.quantity, 0)}</span>
        </div>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-100 flex items-center gap-2"
        >
          View Basket ({cartCount})
        </button>
      </div>
    </div>
  );
};

export default App;
