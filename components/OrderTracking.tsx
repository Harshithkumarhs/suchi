
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';

interface OrderTrackingProps {
  onBack: () => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await api.getAllOrders(); // In a real app, this would be api.getMyOrders()
      setOrders(data);
    };
    loadOrders();
    return api.subscribe(loadOrders);
  }, []);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'preparing': return '🧺';
      case 'out_for_delivery': return '🚲';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    return status.toUpperCase().replace('_', ' ');
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Your Suchi Journey</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tracking your organic deliveries</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <div className="text-5xl mb-4">🍃</div>
            <p className="text-gray-400 font-bold">No orders found.</p>
            <button 
              onClick={onBack}
              className="mt-4 text-green-600 font-bold text-sm underline"
            >
              Start shopping fresh
            </button>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm overflow-hidden relative group">
              {/* Status Banner */}
              <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black text-white ${
                order.status === 'delivered' ? 'bg-green-500' : 
                order.status === 'cancelled' ? 'bg-red-500' : 'bg-green-600'
              }`}>
                {getStatusText(order.status)}
              </div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 leading-none mb-1">Order {order.id}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(order.date).toLocaleDateString()} • {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar (Only for active orders) */}
              {!['delivered', 'cancelled'].includes(order.status) && (
                <div className="mb-4">
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full bg-green-600 transition-all duration-1000 ${
                      order.status === 'pending' ? 'w-1/4' : 
                      order.status === 'preparing' ? 'w-1/2' : 'w-3/4'
                    }`}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-[9px] font-black text-gray-300 uppercase tracking-tighter">
                    <span className={order.status === 'pending' ? 'text-green-600' : ''}>Confirmed</span>
                    <span className={order.status === 'preparing' ? 'text-green-600' : ''}>Packing</span>
                    <span className={order.status === 'out_for_delivery' ? 'text-green-600' : ''}>On the way</span>
                    <span>Delivered</span>
                  </div>
                </div>
              )}

              <div className="border-t border-dashed border-gray-100 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-50 shadow-sm">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Paid Amount</p>
                    <p className="text-lg font-black text-gray-900 tracking-tighter">₹{order.total}</p>
                  </div>
                </div>
              </div>
              
              {order.status === 'out_for_delivery' && (
                <div className="mt-4 bg-green-50 rounded-2xl p-3 border border-green-100 flex items-center justify-between animate-pulse">
                   <div className="flex items-center gap-2">
                     <span className="text-xl">🛵</span>
                     <p className="text-[10px] font-bold text-green-700 uppercase tracking-tight">Rider is near your location!</p>
                   </div>
                   <button className="bg-green-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase">Call Rider</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
