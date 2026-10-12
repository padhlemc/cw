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
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(distPath));
app.use(express.static(frontendPath));

let memoryProducts = [
  { _id: '1', name: 'Laptop Stand', price: 1299, stock: 15 },
  { _id: '2', name: 'Wireless Mouse', price: 799, stock: 25 }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 1500 });
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('products').countDocuments() === 0) {
      await db.collection('products').insertMany(memoryProducts);
    }
  })
  .catch(() => console.log('[MongoDB Offline] Running in memory mode'));

// GET products
app.get('/api/products', async (req, res) => {
  if (db) return res.json(await db.collection('products').find().toArray());
  res.json(memoryProducts);
});

// POST product
app.post('/api/products', async (req, res) => {
  const newProduct = { ...req.body, _id: new ObjectId().toString() };
  if (db) await db.collection('products').insertOne(newProduct);
  else memoryProducts.push(newProduct);
  res.status(201).json(newProduct);
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('products').deleteOne(query);
  } else {
    memoryProducts = memoryProducts.filter(p => String(p._id) !== String(id));
  }
  res.json({ message: 'Product deleted' });
});

// SPA wildcard fallback
app.get('*', (req, res) => {
  const fs = require('fs');
  const indexDist = path.join(distPath, 'index.html');
  const indexDev = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexDist)) return res.sendFile(indexDist);
  if (fs.existsSync(indexDev)) return res.sendFile(indexDev);
  res.send('<!DOCTYPE html><html><body><div id="root">Ready</div></body></html>');
});

app.listen(PORT, () => console.log(`Q7 Product Management Server running on http://localhost:${PORT}`));
