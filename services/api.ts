
import { Product, CartItem, Order, User, OrderStatus } from '../types';
import { MOCK_PRODUCTS } from '../constants';



const BASE_URL = 'http://localhost:5000/api';

type UpdateListener = () => void;

class SuchiBackendBridge {
  private cart: CartItem[] = [];
  private localOrders: Order[] = [];
  private eventListeners: Set<UpdateListener> = new Set();
  private mode: 'CLOUD' | 'LOCAL' = 'LOCAL';
  
  private currentUser: User = {
    id: 'user_001',
    name: 'Harshith Kumar',
    address: '4th Block, Jayanagar, Bengaluru, KA',
    role: 'customer'
  };

  constructor() {
    this.loadPersistedData();
  }

  private loadPersistedData() {
    this.cart = JSON.parse(localStorage.getItem('suchi_cart') || '[]');
    this.localOrders = JSON.parse(localStorage.getItem('suchi_orders') || '[]');
  }

  private save() {
    localStorage.setItem('suchi_cart', JSON.stringify(this.cart));
    localStorage.setItem('suchi_orders', JSON.stringify(this.localOrders));
    this.emitUpdate();
  }

  subscribe(callback: UpdateListener) {
    this.eventListeners.add(callback);
    return () => this.eventListeners.delete(callback);
  }

  private emitUpdate() {
    this.eventListeners.forEach(l => l());
  }

 
  async seedCloudDatabase() {
    try {
      const response = await fetch(`${BASE_URL}/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: MOCK_PRODUCTS })
      });
      return await response.json();
    } catch (e) {
      throw new Error('Could not connect to server to seed data.');
    }
  }

  async fetchProducts(category?: string): Promise<Product[]> {
    try {
      const res = await fetch(`${BASE_URL}/products?category=${category || 'all'}`);
      if (!res.ok) throw new Error();
      this.mode = 'CLOUD';
      return await res.json();
    } catch (e) {
      if (this.mode !== 'LOCAL') console.log("💡 Suchi is running in Local Mode (Server Offline).");
      this.mode = 'LOCAL';
      const list = MOCK_PRODUCTS;
      return (!category || category === 'all') ? list : list.filter(p => p.category === category);
    }
  }

  async search(query: string): Promise<Product[]> {
    try {
      const res = await fetch(`${BASE_URL}/products/search?q=${query}`);
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

    this.save();
    return [...this.cart];
  }

  async removeFromCart(productId: string): Promise<CartItem[]> {
    const idx = this.cart.findIndex(i => i.id === productId || (i as any)._id === productId);
    if (idx !== -1) {
      if (this.cart[idx].quantity > 1) this.cart[idx].quantity -= 1;
      else this.cart.splice(idx, 1);
    }
    this.save();
    return [...this.cart];
  }

  async processCheckout(): Promise<Order> {
    const subtotal = this.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const orderPayload = {
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAddress: this.currentUser.address,
      items: this.cart.map(i => ({ ...i, productId: i.id || (i as any)._id })),
      total: subtotal + (subtotal > 500 ? 0 : 25),
      date: new Date().toISOString()
    };

    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const saved = await res.json();
      this.cart = [];
      this.save();
      return saved;
    } catch (e) {
      const mockOrder = { ...orderPayload, id: 'LOCAL-' + Date.now(), status: 'pending' as OrderStatus };
      this.localOrders.unshift(mockOrder);
      this.cart = [];
      this.save();
      return mockOrder;
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${BASE_URL}/orders`);
      const serverOrders = await res.json();
      return [...this.localOrders, ...serverOrders];
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
      this.save();
    }
    this.emitUpdate();
  }

  async getCart() { return this.cart; }
  async getProfile() { return this.currentUser; }
  async changeRole(role: 'customer' | 'partner') { this.currentUser.role = role; this.emitUpdate(); }
}

export const api = new SuchiBackendBridge();
