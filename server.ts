
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { ProductModel, OrderModel } from './db/models';

/**
 * 🍏 Suchi Organic Backend
 * Built with care for the Suchi Farm-to-Table experience.
 */

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
// Note: Ensure your IP is whitelisted in MongoDB Atlas Network Access.
const MONGODB_URI = "mongodb+srv://admin:suchi_secure_pass@cluster0.suchi.mongodb.net/suchi_db?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Suchi Database is live on MongoDB Atlas.'))
  .catch((err) => {
    console.error('❌ Database Connection Error. Did you whitelist your IP? Details:', err.message);
  });

// --- DEVELOPER UTILITY ROUTES ---

/**
 * Seed Route: Quick-start your database with organic products.
 * Use this to populate your Atlas cluster for the first time.
 */
app.post('/api/seed', async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'Please provide an array of products to seed.' });
    }

    // Clear existing to avoid duplicates during initial setup
    await ProductModel.deleteMany({});
    const created = await ProductModel.insertMany(products);
    
    console.log(`🌱 Seeded ${created.length} organic products into the database.`);
    res.json({ message: 'Database seeded successfully!', count: created.length });
  } catch (error: any) {
    res.status(500).json({ error: 'Seeding failed.', details: error.message });
  }
});

// --- CORE API ROUTES ---

app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const products = await ProductModel.find(filter).sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'We hit a snag fetching our fresh produce. Please try again.' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    // Basic validation to ensure a "human" didn't send an empty basket
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Your basket seems to be empty.' });
    }

    const newOrder = new OrderModel(orderData);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(400).json({ error: 'Checkout failed.', details: error.message });
  }
});

app.patch('/api/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await OrderModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updatedOrder) return res.status(404).json({ error: 'Order not found.' });
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: 'Could not update status.' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(50);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve order logs.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Suchi Server is breathing at http://localhost:${PORT}`);
});
