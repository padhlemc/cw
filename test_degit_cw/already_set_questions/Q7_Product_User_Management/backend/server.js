const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5007;
const DB_NAME = 'product_user_db';

app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

let memoryProducts = [
  { _id: '1', name: 'Wireless Mouse', price: 699, stock: 45, category: 'Electronics' },
  { _id: '2', name: 'Mechanical Keyboard', price: 2499, stock: 20, category: 'Electronics' }
];
let memoryUsers = [
  { _id: '101', name: 'Alex Johnson', email: 'alex@example.com', phone: '9876543210' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017');
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('products').countDocuments() === 0) {
      await db.collection('products').insertMany(memoryProducts);
    }
    if (await db.collection('users').countDocuments() === 0) {
      await db.collection('users').insertMany(memoryUsers);
    }
  })
  .catch(() => console.log('[MongoDB] Offline - Using memory'));

// --- PRODUCTS API ---
app.get('/api/products', async (req, res) => {
  if (db) return res.json(await db.collection('products').find().toArray());
  res.json(memoryProducts);
});

app.post('/api/products', async (req, res) => {
  const { name, price, stock, category } = req.body;
  if (!name || Number(price) <= 0 || Number(stock) < 0) {
    return res.status(400).json({ error: 'Price must be > 0 and stock >= 0' });
  }
  const prod = { name, price: Number(price), stock: Number(stock), category: category || 'General', _id: new ObjectId().toString() };
  if (db) await db.collection('products').insertOne(prod);
  else memoryProducts.push(prod);
  res.status(201).json(prod);
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  if (db) await db.collection('products').deleteOne({ _id: id });
  else memoryProducts = memoryProducts.filter(p => p._id !== id);
  res.json({ message: 'Deleted' });
});

// --- USERS API ---
app.get('/api/users', async (req, res) => {
  if (db) return res.json(await db.collection('users').find().toArray());
  res.json(memoryUsers);
});

app.post('/api/users', async (req, res) => {
  const { name, email, phone } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  if (!emailRegex.test(email) || !phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid email or 10-digit phone number' });
  }
  const user = { name, email, phone, _id: new ObjectId().toString() };
  if (db) await db.collection('users').insertOne(user);
  else memoryUsers.push(user);
  res.status(201).json(user);
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  if (db) await db.collection('users').deleteOne({ _id: id });
  else memoryUsers = memoryUsers.filter(u => u._id !== id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
