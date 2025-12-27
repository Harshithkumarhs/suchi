<<<<<<< HEAD
import { Product, CartItem, Order, User, OrderStatus } from '../types';
import { MOCK_PRODUCTS } from '../constants';

=======

import { Product, CartItem, Order, User, OrderStatus } from '../types';
import { MOCK_PRODUCTS } from '../constants';



>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
const BASE_URL = 'http://localhost:5000/api';

type UpdateListener = () => void;

class SuchiBackendBridge {
  private cart: CartItem[] = [];
  private localOrders: Order[] = [];
  private eventListeners: Set<UpdateListener> = new Set();
<<<<<<< HEAD
  private connectionStatus: 'CONNECTED' | 'DISCONNECTED' = 'DISCONNECTED';
=======
  private mode: 'CLOUD' | 'LOCAL' = 'LOCAL';
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
  
  private currentUser: User = {
    id: 'user_001',
    name: 'Harshith Kumar',
    address: '4th Block, Jayanagar, Bengaluru, KA',
    role: 'customer'
  };

  constructor() {
    this.loadPersistedData();
<<<<<<< HEAD
    this.checkConnection();
  }

  private async checkConnection() {
    try {
      const res = await fetch(`${BASE_URL}/products`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        this.connectionStatus = 'CONNECTED';
      }
    } catch (e) {
      this.connectionStatus = 'DISCONNECTED';
    }
=======
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
  }

  private loadPersistedData() {
    this.cart = JSON.parse(localStorage.getItem('suchi_cart') || '[]');
    this.localOrders = JSON.parse(localStorage.getItem('suchi_orders') || '[]');
  }

<<<<<<< HEAD
  private saveLocally() {
=======
  private save() {
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
    localStorage.setItem('suchi_cart', JSON.stringify(this.cart));
    localStorage.setItem('suchi_orders', JSON.stringify(this.localOrders));
    this.emitUpdate();
  }

  subscribe(callback: UpdateListener) {
    this.eventListeners.add(callback);
<<<<<<< HEAD
    return () => {
      this.eventListeners.delete(callback);
    };
=======
    return () => this.eventListeners.delete(callback);
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
  }

  private emitUpdate() {
    this.eventListeners.forEach(l => l());
  }

<<<<<<< HEAD
=======
 
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
  async seedCloudDatabase() {
    try {
      const response = await fetch(`${BASE_URL}/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: MOCK_PRODUCTS })
      });
<<<<<<< HEAD
      if (!response.ok) throw new Error();
      this.connectionStatus = 'CONNECTED';
      return await response.json();
    } catch (e) {
      throw new Error('Cloud Server Offline');
=======
      return await response.json();
    } catch (e) {
      throw new Error('Could not connect to server to seed data.');
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
    }
  }

  async fetchProducts(category?: string): Promise<Product[]> {
    try {
      const res = await fetch(`${BASE_URL}/products?category=${category || 'all'}`);
      if (!res.ok) throw new Error();
<<<<<<< HEAD
      const data = await res.json();
      this.connectionStatus = 'CONNECTED';
      return data;
    } catch (e) {
      this.connectionStatus = 'DISCONNECTED';
=======
      this.mode = 'CLOUD';
      return await res.json();
    } catch (e) {
      if (this.mode !== 'LOCAL') console.log("💡 Suchi is running in Local Mode (Server Offline).");
      this.mode = 'LOCAL';
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
      const list = MOCK_PRODUCTS;
      return (!category || category === 'all') ? list : list.filter(p => p.category === category);
    }
  }

  async search(query: string): Promise<Product[]> {
    try {
      const res = await fetch(`${BASE_URL}/products/search?q=${query}`);
<<<<<<< HEAD
      if (!res.ok) throw new Error();
=======
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
      return await res.json();
    } catch (e) {
      const q = query.toLowerCase();
      return MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(q));
    }
  }

  async addToCart(productId: string): Promise<CartItem[]> {
    const products = await this.fetchProducts();
    const product = products.find(p => p.id === productId || (p as any)._id === productId);
    if (!product) return this.cart;

    const existing = this.cart.find(i => i.id === productId || (i as any)._id === productId);
    if (existing) existing.quantity += 1;
    else this.cart.push({ ...product, quantity: 1 });

<<<<<<< HEAD
    this.saveLocally();
=======
    this.save();
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
    return [...this.cart];
  }

  async removeFromCart(productId: string): Promise<CartItem[]> {
    const idx = this.cart.findIndex(i => i.id === productId || (i as any)._id === productId);
    if (idx !== -1) {
      if (this.cart[idx].quantity > 1) this.cart[idx].quantity -= 1;
      else this.cart.splice(idx, 1);
    }
<<<<<<< HEAD
    this.saveLocally();
=======
    this.save();
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
    return [...this.cart];
  }

  async processCheckout(): Promise<Order> {
    const subtotal = this.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const orderPayload = {
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAddress: this.currentUser.address,
<<<<<<< HEAD
      items: this.cart.map(i => ({
        productId: i.id || (i as any)._id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        unit: i.unit,
        image: i.image
      })),
=======
      items: this.cart.map(i => ({ ...i, productId: i.id || (i as any)._id })),
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
      total: subtotal + (subtotal > 500 ? 0 : 25),
      date: new Date().toISOString()
    };

    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
<<<<<<< HEAD
      if (!res.ok) throw new Error();
      const saved = await res.json();
      
      this.cart = [];
      this.saveLocally();
      return saved;
    } catch (e) {
      const mockOrder: Order = { 
        ...orderPayload, 
        id: 'LOCAL-' + Math.random().toString(36).substr(2, 9).toUpperCase(), 
        status: 'pending' as OrderStatus 
      };
      this.localOrders.unshift(mockOrder);
      this.cart = [];
      this.saveLocally();
=======
      const saved = await res.json();
      this.cart = [];
      this.save();
      return saved;
    } catch (e) {
      const mockOrder = { ...orderPayload, id: 'LOCAL-' + Date.now(), status: 'pending' as OrderStatus };
      this.localOrders.unshift(mockOrder);
      this.cart = [];
      this.save();
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
      return mockOrder;
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${BASE_URL}/orders`);
<<<<<<< HEAD
      if (!res.ok) throw new Error();
      const serverOrders = await res.json();
      const uniqueIds = new Set(serverOrders.map((o: any) => o._id || o.id));
      const filteredLocal = this.localOrders.filter(o => !uniqueIds.has(o.id));
      return [...filteredLocal, ...serverOrders];
=======
      const serverOrders = await res.json();
      return [...this.localOrders, ...serverOrders];
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
    } catch (e) {
      return this.localOrders;
    }
  }

  async updateStatus(id: string, status: OrderStatus) {
    try {
      await fetch(`${BASE_URL}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      const order = this.localOrders.find(o => o.id === id);
      if (order) order.status = status;
<<<<<<< HEAD
      this.saveLocally();
=======
      this.save();
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
    }
    this.emitUpdate();
  }

  async getCart() { return this.cart; }
  async getProfile() { return this.currentUser; }
<<<<<<< HEAD
  async changeRole(role: 'customer' | 'partner') { 
    this.currentUser.role = role; 
    this.emitUpdate(); 
  }
  
  getConnectionStatus() { return this.connectionStatus; }
}

export const api = new SuchiBackendBridge();
=======
  async changeRole(role: 'customer' | 'partner') { this.currentUser.role = role; this.emitUpdate(); }
}

export const api = new SuchiBackendBridge();
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
