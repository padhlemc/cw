const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5003;
const DB_NAME = 'expense_tracker';

app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(distPath));
app.use(express.static(frontendPath));

let memoryExpenses = [
  { _id: '1', title: 'Groceries', amount: 1200, category: 'Food', date: '2026-10-01' },
  { _id: '2', title: 'Metro Recharge', amount: 500, category: 'Transport', date: '2026-10-02' },
  { _id: '3', title: 'Movie Tickets', amount: 650, category: 'Entertainment', date: '2026-10-03' },
  { _id: '4', title: 'Electricity Bill', amount: 1800, category: 'Bills', date: '2026-10-05' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 1500 });
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('expenses').countDocuments() === 0) {
      await db.collection('expenses').insertMany(memoryExpenses);
    }
  })
  .catch(() => console.log('[MongoDB Offline] Running in memory mode'));

// GET expenses
app.get('/api/expenses', async (req, res) => {
  if (db) return res.json(await db.collection('expenses').find().toArray());
  res.json(memoryExpenses);
});

// POST expense
app.post('/api/expenses', async (req, res) => {
  const newExp = { ...req.body, _id: new ObjectId().toString() };
  if (db) await db.collection('expenses').insertOne(newExp);
  else memoryExpenses.push(newExp);
  res.status(201).json(newExp);
});

// DELETE expense
app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('expenses').deleteOne(query);
  } else {
    memoryExpenses = memoryExpenses.filter(e => String(e._id) !== String(id));
  }
  res.json({ message: 'Expense deleted' });
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

app.listen(PORT, () => console.log(`Q3 Expense Tracker Server running on http://localhost:${PORT}`));
