const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5001;
const DB_NAME = 'book_ecommerce';

app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

let memoryBooks = [
  { _id: '1', title: 'Clean Code', author: 'Robert Martin', price: 599, category: 'Tech' },
  { _id: '2', title: 'Atomic Habits', author: 'James Clear', price: 499, category: 'Self-Help' },
  { _id: '3', title: 'Design Patterns', author: 'Erich Gamma', price: 799, category: 'Tech' },
  { _id: '4', title: 'Deep Work', author: 'Cal Newport', price: 450, category: 'Self-Help' }
];
let memoryOrders = [];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017');
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('books').countDocuments() === 0) {
      await db.collection('books').insertMany(memoryBooks);
    }
  })
  .catch(() => console.log('[MongoDB] Offline - Using memory'));

// GET books (with optional search)
app.get('/api/books', async (req, res) => {
  const q = (req.query.search || '').toLowerCase();
  if (db) {
    const filter = q ? { title: { $regex: q, $options: 'i' } } : {};
    return res.json(await db.collection('books').find(filter).toArray());
  }
  const filtered = q ? memoryBooks.filter(b => b.title.toLowerCase().includes(q)) : memoryBooks;
  res.json(filtered);
});

// POST book (Admin)
app.post('/api/books', async (req, res) => {
  const newBook = { ...req.body, _id: new ObjectId().toString() };
  if (db) await db.collection('books').insertOne(newBook);
  else memoryBooks.push(newBook);
  res.status(201).json(newBook);
});

// DELETE book (Admin)
app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  if (db) await db.collection('books').deleteOne({ _id: id });
  else memoryBooks = memoryBooks.filter(b => b._id !== id);
  res.json({ message: 'Deleted' });
});

// POST order (Checkout)
app.post('/api/orders', async (req, res) => {
  const order = { ...req.body, orderId: Date.now().toString(), date: new Date() };
  if (db) await db.collection('orders').insertOne(order);
  else memoryOrders.push(order);
  res.status(201).json({ message: 'Order placed!', order });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
