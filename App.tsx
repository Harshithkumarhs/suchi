
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import OrderTracking from './components/OrderTracking';
import { Product, CartItem, User, Order } from './types';
import { CATEGORIES } from './constants.tsx';
import { api } from './services/api';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [currentView, setCurrentView] = useState<'customer' | 'partner' | 'tracking'>('customer');

  // Unified State Synchronization with the Backend
  useEffect(() => {
    const syncWithBackend = async () => {
      const [fetchedProducts, fetchedCart, profile] = await Promise.all([
        searchQuery ? api.search(searchQuery) : api.fetchProducts(activeCategory),
        api.getCart(),
        api.getProfile()
      ]);
      
      setProducts(fetchedProducts);
      setCart(fetchedCart);
      setUser(profile);
      // Only switch view automatically if the role changes globally
      if (currentView !== 'tracking') {
        setCurrentView(profile.role);
      }
    };

    syncWithBackend();
    const unsubscribe = api.subscribe(syncWithBackend);
    return unsubscribe;
  }, [activeCategory, searchQuery, currentView]);

  const handleAddToCart = async (id: string) => {
    const updated = await api.addToCart(id);
    setCart(updated);
  };

  const handleRemoveFromCart = async (id: string) => {
    const updated = await api.removeFromCart(id);
    setCart(updated);
  };

  const handleCheckout = async () => {
    setIsOrdering(true);
    try {
      const order = await api.processCheckout();
      setCart([]);
      setIsOrdering(false);
      setActiveOrder(order);
      setIsCartOpen(false);
      
      // Clear tracking alert after some time or when user clicks track
      setTimeout(() => setActiveOrder(null), 10000);
    } catch (error) {
      console.error("Order failed:", error);
      setIsOrdering(false);
      alert("Something went wrong with your order. Please try again.");
    }
  };

  const switchUserRole = async () => {
    const target = currentView === 'partner' ? 'customer' : 'partner';
    await api.changeRole(target);
    setCurrentView(target);
  };

  const navigateToTracking = () => setCurrentView('tracking');
  const navigateToShopping = () => setCurrentView('customer');

  const basketTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // VENDOR/PARTNER VIEW
  if (currentView === 'partner') {
    return (
      <Layout headerContent={
        <div className="flex items-center justify-between w-full">
          <div className="bg-green-800 text-white px-3 py-1 rounded-lg font-black text-xs">SUCHI PARTNER</div>
          <button onClick={switchUserRole} className="text-[10px] font-bold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-100 shadow-sm transition-all hover:bg-green-100">
            SWITCH TO SHOPPING
          </button>
        </div>
      }>
        <AdminDashboard />
      </Layout>
    );
  }

  // ORDER TRACKING VIEW
  if (currentView === 'tracking') {
    return (
      <Layout headerContent={
        <div className="flex items-center justify-between w-full">
          <div className="bg-green-600 text-white px-3 py-1 rounded-lg font-black text-xs">SUCHI TRACK</div>
          <button onClick={navigateToShopping} className="text-[10px] font-bold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-100 shadow-sm">
            BACK TO SHOP
          </button>
        </div>
      }>
        <OrderTracking onBack={navigateToShopping} />
      </Layout>
    );
  }

  // CUSTOMER SHOP VIEW
  return (
    <Layout
      headerContent={
        <div className="flex flex-col w-full gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 text-white font-black p-2 rounded-xl tracking-tighter text-base shadow-sm">
                SUCHI
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Delivering from Suchi Farms to</span>
                <span className="text-xs font-semibold text-gray-800 truncate max-w-[140px]">
                  {user?.address || 'Detecting Location...'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={navigateToTracking} className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full hover:bg-green-100 transition-colors">
                MY ORDERS
              </button>
              <button onClick={switchUserRole} className="text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors">
                PARTNER
              </button>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700 border border-green-200">
                {user?.name.charAt(0) || 'U'}
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search organic spinach, tomatoes..."
              className="w-full bg-gray-100/50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      }
      footerContent={
        itemCount > 0 && !isCartOpen && (
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-green-700 text-white p-4 rounded-2xl flex items-center justify-between shadow-2xl animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-600 rounded-lg px-2 py-1 text-xs font-bold">
                {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-medium opacity-80 uppercase leading-none">Suchi Basket</span>
                <span className="text-sm font-bold">₹{basketTotal}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-bold text-sm">
              VIEW BASKET
              <span>→</span>
            </div>
          </button>
        )
      }
    >
      {/* Category Scroll */}
      <div className="flex overflow-x-auto gap-4 p-4 no-scrollbar bg-white sticky top-[108px] z-30 shadow-sm border-b border-gray-50">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setSearchQuery('');
            }}
            className={`flex flex-col items-center gap-1.5 min-w-[70px] group transition-all`}
          >
            <div className={`w-14 h-14 flex items-center justify-center rounded-2xl text-2xl bg-gray-50 border-2 transition-all group-hover:scale-105 ${
              activeCategory === cat.id ? 'border-green-600 bg-green-50 shadow-inner' : 'border-transparent'
            }`}>
              {cat.icon}
            </div>
            <span className={`text-[10px] font-black text-center tracking-tight transition-colors ${
              activeCategory === cat.id ? 'text-green-700' : 'text-gray-400'
            }`}>
              {cat.name.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeOrder && (
          <div 
            onClick={navigateToTracking}
            className="mb-6 bg-white border-2 border-green-500 p-5 rounded-3xl shadow-xl relative overflow-hidden transition-all animate-fade-in cursor-pointer hover:bg-green-50"
          >
            <div className="absolute top-0 right-0 p-2 bg-green-500 text-white rounded-bl-2xl text-[10px] font-bold">
              TAP TO TRACK
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-3xl">
                🚀
              </div>
              <div className="flex-1">
                <h4 className="font-black text-gray-900 leading-tight">Order {activeOrder.id} is cooking!</h4>
                <p className="text-[10px] text-green-600 font-bold mb-2 tracking-wide uppercase">Current Step: {activeOrder.status.replace('_', ' ')}</p>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                   <div className={`h-full bg-green-500 transition-all duration-700 ease-in-out ${
                     activeOrder.status === 'pending' ? 'w-1/4' : 
                     activeOrder.status === 'preparing' ? 'w-1/2' :
                     activeOrder.status === 'out_for_delivery' ? 'w-3/4' : 'w-full'
                   }`}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-xl text-gray-900 tracking-tight">
            {searchQuery ? `Searching for "${searchQuery}"` : activeCategory === 'all' ? 'Fresh from Suchi Farms' : activeCategory.toUpperCase()}
          </h2>
          <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] text-green-700 font-bold uppercase tracking-tighter">100% Organic</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(product => {
            const itemInCart = cart.find(i => i.id === product.id);
            return (
              <ProductCard 
                key={product.id}
                product={product}
                quantityInCart={itemInCart ? itemInCart.quantity : 0}
                onAdd={handleAddToCart}
                onRemove={handleRemoveFromCart}
              />
            );
          })}
        </div>
      </div>

      <CartDrawer 
        items={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onAdd={handleAddToCart}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {isOrdering && (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-8 border-green-100 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-green-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-3xl">🌱</div>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">VALIDATING FRESHNESS</h2>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">Suchi's backend is checking local farm stock and securing your delivery partner...</p>
        </div>
      )}
    </Layout>
<<<<<<< HEAD
=======
=======
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
>>>>>>> d9df6bdae344ebbca08512848b9b5efdee8d684c
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
  );
};

export default App;
