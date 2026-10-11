/**
 * ==============================================================================
 * 🎓 EXAM CHEAT-SHEET: MINIMAL EXPRESS + MONGODB SERVER
 * ==============================================================================
 * Examiner Marking Points:
 * 1. Express setup & middleware (cors, express.json)
 * 2. MongoDB native driver connection (MongoClient, ObjectId)
 * 3. Full REST API routes (GET, POST, PUT, DELETE)
 * 4. Serving static frontend on the same port
 * ==============================================================================
 */

// Step 1: Import only allowed packages (Node, Express, MongoDB Native)
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

// Step 2: Initialize Express app and configuration
const app = express();
const PORT = process.env.PORT || 5000;
const DB_NAME = 'exam_starter_db';

// Step 3: Essential Middlewares (parses JSON body & enables cross-origin requests)
app.use(cors());
app.use(express.json());

// Step 4: Serve React frontend static files from 'dist' or 'frontend' root
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Step 5: Fallback in-memory data (Ensures code NEVER crashes if Mongo is stopped on lab PC)
let memoryItems = [
  { _id: '1', title: 'Sample Item Alpha', category: 'General', status: 'Active' },
  { _id: '2', title: 'Sample Item Beta', category: 'Urgent', status: 'Pending' },
  { _id: '3', title: 'Sample Item Gamma', category: 'General', status: 'Completed' }
];

// Step 6: Native MongoDB Connection via MongoClient
let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017');
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to database: ${DB_NAME}`);
    // Auto-seed initial items if collection is empty
    if (await db.collection('items').countDocuments() === 0) {
      await db.collection('items').insertMany(memoryItems);
    }
  })
  .catch(() => console.log('[MongoDB] Offline - Using in-memory fallback'));

// ==============================================================================
// 🔌 REST API ENDPOINTS (The 4 core routes examiners grade)
// ==============================================================================

// ROUTE 1: GET ALL ITEMS -> db.collection.find().toArray()
app.get('/api/items', async (req, res) => {
  if (db) {
    const data = await db.collection('items').find().toArray();
    return res.json(data);
  }
  res.json(memoryItems);
});

// ROUTE 2: CREATE NEW ITEM -> db.collection.insertOne(req.body)
app.post('/api/items', async (req, res) => {
  const newItem = { ...req.body, _id: new ObjectId().toString() };
  if (db) {
    await db.collection('items').insertOne(newItem);
  } else {
    memoryItems.push(newItem);
  }
  res.status(201).json(newItem); // 201 = Created
});

// ROUTE 3: UPDATE ITEM -> db.collection.updateOne({ _id }, { $set: req.body })
app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  if (db) {
    await db.collection('items').updateOne({ _id: id }, { $set: req.body });
  } else {
    memoryItems = memoryItems.map(item => item._id === id ? { ...item, ...req.body } : item);
  }
  res.json({ message: 'Updated' });
});

// ROUTE 4: DELETE ITEM -> db.collection.deleteOne({ _id })
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  if (db) {
    await db.collection('items').deleteOne({ _id: id });
  } else {
    memoryItems = memoryItems.filter(item => item._id !== id);
  }
  res.json({ message: 'Deleted' });
});

// Step 7: Start HTTP server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
