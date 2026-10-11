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
app.use(express.static(distPath));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

let memoryExpenses = [
  { _id: '1', title: 'Groceries', amount: 850, category: 'Food', date: '2026-10-10' },
  { _id: '2', title: 'Metro Card Recharge', amount: 400, category: 'Transport', date: '2026-10-11' },
  { _id: '3', title: 'Movie Ticket', amount: 350, category: 'Entertainment', date: '2026-10-11' },
  { _id: '4', title: 'Wifi Bill', amount: 799, category: 'Bills', date: '2026-10-09' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017');
client.connect()
  .then(() => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
  })
  .catch(() => console.log('[MongoDB] Offline - Using memory'));

app.get('/api/expenses', async (req, res) => {
  if (db) return res.json(await db.collection('expenses').find().toArray());
  res.json(memoryExpenses);
});

app.post('/api/expenses', async (req, res) => {
  const expense = { ...req.body, amount: Number(req.body.amount), _id: new ObjectId().toString() };
  if (db) await db.collection('expenses').insertOne(expense);
  else memoryExpenses.push(expense);
  res.status(201).json(expense);
});

app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  if (db) await db.collection('expenses').deleteOne({ _id: id });
  else memoryExpenses = memoryExpenses.filter(e => e._id !== id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
