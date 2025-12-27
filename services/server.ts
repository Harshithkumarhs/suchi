import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { ProductModel, OrderModel } from '../db/models';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors() as any);
app.use(express.json() as any);

const MONGODB_URI = "mongodb+srv://suchi:<db_password>@cluster0.yueqk5h.mongodb.net/suchi_db?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Server connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Connection failed:', err.message);
  });

app.post('/api/seed', async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'Invalid product list' });
    }
    await ProductModel.deleteMany({});
    const created = await ProductModel.insertMany(products);
    res.json({ message: 'Database seeded', count: created.length });
  } catch (error: any) {
    res.status(500).json({ error: 'Seeding failed', details: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const products = await ProductModel.find(filter).sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Empty basket' });
    }
    const newOrder = new OrderModel(orderData);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(400).json({ error: 'Order failed', details: error.message });
  }
});

app.patch('/api/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await OrderModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(50);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'History fetch failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});