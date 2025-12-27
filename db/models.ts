import mongoose, { Schema, Document } from 'mongoose';
import { OrderStatus } from '../types';

export interface IProduct extends Document {
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

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  unit: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  isOrganic: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  deliveryTime: { type: String, default: '15 mins' }
}, { timestamps: true });

export interface IOrder extends Document {
  userId: string;
  userName: string;
  userAddress: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    image: string;
  }>;
  total: number;
  status: OrderStatus;
  date: string;
  estimatedDelivery: string;
}

const OrderSchema: Schema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAddress: { type: String, required: true },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    image: { type: String, required: true }
  }],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending' 
  },
  date: { type: String, required: true },
  estimatedDelivery: { type: String, default: '20 mins' }
}, { timestamps: true });

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);