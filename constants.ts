
import { Category, Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Organic Spinach',
    category: Category.LEAFY,
    price: 45,
    unit: '250g',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=400&h=400&auto=format&fit=crop',
    description: 'Freshly harvested baby spinach leaves, pesticide-free.',
    benefits: 'Rich in Iron and Vitamin K',
    origin: 'Shimla Valley Farms'
  },
  {
    id: '2',
    name: 'Heritage Carrots',
    category: Category.ROOT,
    price: 60,
    unit: '500g',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=400&h=400&auto=format&fit=crop',
    description: 'Sweet and crunchy orange carrots grown in volcanic soil.',
    benefits: 'Great for vision and immunity',
    origin: 'Ooty Organic Cooperative'
  },
  {
    id: '3',
    name: 'Heirloom Tomatoes',
    category: Category.CRUCIFEROUS,
    price: 85,
    unit: '500g',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&h=400&auto=format&fit=crop',
    description: 'Juicy, vine-ripened tomatoes with exceptional flavor.',
    benefits: 'High in Lycopene',
    origin: 'Nashik Sunshine Farms'
  },
  {
    id: '4',
    name: 'Purple Broccoli',
    category: Category.EXOTIC,
    price: 120,
    unit: '1 unit',
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?q=80&w=400&h=400&auto=format&fit=crop',
    description: 'Rare nutrient-dense purple variant of regular broccoli.',
    benefits: 'Anthocyanin rich antioxidants',
    origin: 'Hydroponic Hills'
  },
  {
    id: '5',
    name: 'Wild Garlic Bulbs',
    category: Category.ALLIUM,
    price: 35,
    unit: '100g',
    image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=400&h=400&auto=format&fit=crop',
    description: 'Potent and fragrant organic garlic grown without synthetic fertilizers.',
    benefits: 'Natural heart health support',
    origin: 'Garhwal Highlands'
  },
  {
    id: '6',
    name: 'Fresh Basil',
    category: Category.HERBS,
    price: 25,
    unit: '50g',
    image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?q=80&w=400&h=400&auto=format&fit=crop',
    description: 'Aromatic Genovese basil leaves, perfect for pesto.',
    benefits: 'Anti-inflammatory properties',
    origin: 'City Rooftop Gardens'
  },
  {
    id: '7',
    name: 'Red Bell Peppers',
    category: Category.EXOTIC,
    price: 90,
    unit: '250g',
    image: 'https://images.unsplash.com/photo-1563513330615-a49a2ce05c1c?q=80&w=400&h=400&auto=format&fit=crop',
    description: 'Crispy and sweet, grown in climate-controlled greenhouses.',
    benefits: 'Vitamin C powerhouse',
    origin: 'Pune Smart Farms'
  },
  {
    id: '8',
    name: 'Gold Potatoes',
    category: Category.ROOT,
    price: 40,
    unit: '1kg',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400&h=400&auto=format&fit=crop',
    description: 'Creamy texture and buttery flavor, skin is edible.',
    benefits: 'Good source of Potassium',
    origin: 'Nilgiri Hills'
  }
];
