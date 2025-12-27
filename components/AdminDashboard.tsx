
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const loadData = async () => setOrders(await api.getAllOrders());
    loadData();
    return api.subscribe(loadData);
  }, []);

  const handleSeed = async () => {
    if (!window.confirm("This will push fresh products to your MongoDB Atlas. Continue?")) return;
    setSeeding(true);
    try {
      const res = await api.seedCloudDatabase();
      alert(`Success! ${res.count} products are now live in your cloud database.`);
    } catch (e) {
      alert("Make sure your backend server is running and connected to Atlas!");
    } finally {
      setSeeding(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    await api.updateStatus(id, status);
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'preparing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'out_for_delivery': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Suchi Manager</h1>
          <p className="text-sm font-medium text-gray-400">Dispatching nature's best to local homes</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="bg-white border border-green-200 text-green-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-green-50 disabled:opacity-50 transition-all"
          >
            {seeding ? '🌱 Planting...' : 'Seed Cloud DB'}
          </button>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active</p>
            <p className="text-2xl font-black text-green-600">
              {orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <span className="text-4xl block mb-2">📭</span>
            <p className="text-gray-400 font-medium">No organic orders in the queue yet.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-gray-300 bg-gray-50 px-2 py-0.5 rounded uppercase">{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 group-hover:text-green-700 transition-colors">{order.userName}</h3>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <span className="text-base">📍</span> {order.userAddress}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{order.total}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-2xl p-4 mb-6 border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Organic Checklist</p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-bold text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-white border border-gray-200 rounded flex items-center justify-center text-[10px]">{item.quantity}</span>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-gray-400">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button 
                  onClick={() => handleStatusUpdate(order.id, 'preparing')}
                  className="flex-1 min-w-[100px] px-4 py-3 bg-blue-600 text-white text-[11px] font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all uppercase"
                >
                  PACKING
                </button>
                <button 
                  onClick={() => handleStatusUpdate(order.id, 'out_for_delivery')}
                  className="flex-1 min-w-[100px] px-4 py-3 bg-purple-600 text-white text-[11px] font-black rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200 active:scale-95 transition-all uppercase"
                >
                  DISPATCH
                </button>
                <button 
                  onClick={() => handleStatusUpdate(order.id, 'delivered')}
                  className="flex-1 min-w-[100px] px-4 py-3 bg-green-600 text-white text-[11px] font-black rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 active:scale-95 transition-all uppercase"
                >
                  DELIVERED
                </button>
                <button 
                  onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                  className="px-4 py-3 border border-red-100 text-red-500 text-[11px] font-black rounded-xl hover:bg-red-50 active:scale-95 transition-all uppercase"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
