
export enum Category {
  LEAFY = 'Leafy Greens',
  ROOT = 'Root Vegetables',
  CRUCIFEROUS = 'Cruciferous',
  ALLIUM = 'Allium',
  EXOTIC = 'Exotic',
  HERBS = 'Herbs'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  unit: string;
  image: string;
  description: string;
  benefits: string;
  origin: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
