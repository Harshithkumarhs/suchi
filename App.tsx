
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
  );
};

export default App;
