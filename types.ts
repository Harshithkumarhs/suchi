
<<<<<<< HEAD
export type OrderStatus = 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
=======
<<<<<<< HEAD
export type OrderStatus = 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
=======
export enum Category {
  LEAFY = 'Leafy Greens',
  ROOT = 'Root Vegetables',
  CRUCIFEROUS = 'Cruciferous',
  ALLIUM = 'Allium',
  EXOTIC = 'Exotic',
  HERBS = 'Herbs'
}
>>>>>>> d9df6bdae344ebbca08512848b9b5efdee8d684c
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7

export interface Product {
  id: string;
  name: string;
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  description: string;
  isOrganic: boolean;
  stock: number;
  deliveryTime: string;
<<<<<<< HEAD
=======
=======
  category: Category;
  price: number;
  unit: string;
  image: string;
  description: string;
  benefits: string;
  origin: string;
>>>>>>> d9df6bdae344ebbca08512848b9b5efdee8d684c
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
}

export interface CartItem extends Product {
  quantity: number;
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
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
<<<<<<< HEAD
}
=======
}
=======
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
>>>>>>> d9df6bdae344ebbca08512848b9b5efdee8d684c
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
