
export type OrderStatus = 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  description: string;
  isOrganic: boolean;
  stock: number;
  deliveryTime: string;
}

export interface CartItem extends Product {
  quantity: number;
}

/**
 * Simplified item structure for historical orders
 */
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

export interface User {
  id: string;
  name: string;
  address: string;
  role: 'customer' | 'partner';
  location?: { lat: number; lng: number };
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userAddress: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  estimatedDelivery?: string;
}

export enum Category {
  VEGETABLES = 'Vegetables',
  FRUITS = 'Fruits',
  EXOTICS = 'Exotics',
  LEAFY = 'Leafy Greens',
  SEASONAL = 'Seasonal'
}