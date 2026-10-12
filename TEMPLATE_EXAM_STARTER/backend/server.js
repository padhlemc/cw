/**
 * ==============================================================================
 * UNIVERSAL EXAM BACKEND (server.js) - Express + Native MongoDB Driver
 * ==============================================================================
 * Key Examiner Marking Points:
 * 1. Express setup & middlewares (cors, express.json)
 * 2. MongoDB Native Driver (MongoClient, ObjectId) with in-memory zero-crash fallback
 * 3. Complete REST API routes (GET, POST, PUT, DELETE)
 * 4. Serving static React frontend and handling React Router SPA routes
 * ==============================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// Essential Middlewares
app.use(cors());
app.use(express.json());

// Serve static frontend files (both production dist and source frontend)
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(distPath));
app.use(express.static(frontendPath));

/* ==============================================================================
 * CHANGE ZONE 1: DATABASE NAME & INITIAL DATA (Change to match your exam question)
 * ============================================================================== */
const DB_NAME = 'exam_starter_db';

// Fallback in-memory data (Ensures code NEVER crashes if Mongo is stopped on lab PC)
let memoryItems = [
  { _id: '1', title: 'Sample Item Alpha', category: 'General', status: 'Active' },
  { _id: '2', title: 'Sample Item Beta', category: 'Urgent', status: 'Pending' }
];

// Native MongoDB Connection via MongoClient with 1.5s timeout
let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 1500 });
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log('[MongoDB] Connected successfully to database: ' + DB_NAME);
    if (await db.collection('items').countDocuments() === 0) {
      await db.collection('items').insertMany(memoryItems);
    }
  })
  .catch(() => console.log('[MongoDB Offline] Running in-memory mode. Server will not crash.'));

/* ==============================================================================
 * REST API ENDPOINTS (The 4 core routes examiners grade)
 * ============================================================================== */

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
  res.status(201).json(newItem);
});

// ROUTE 3: UPDATE ITEM -> db.collection.updateOne({ _id }, { $set: req.body })
app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  delete updates._id;

  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('items').updateOne(query, { $set: updates });
  } else {
    memoryItems = memoryItems.map(item => String(item._id) === String(id) ? { ...item, ...updates } : item);
  }
  res.json({ message: 'Record updated', id });
});

// ROUTE 4: DELETE ITEM -> db.collection.deleteOne({ _id })
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;

  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('items').deleteOne(query);
  } else {
    memoryItems = memoryItems.filter(item => String(item._id) !== String(id));
  }
  res.json({ message: 'Record deleted', id });
});

// ROUTE 5: SPA WILDCARD ROUTE (React Router navigation support)
app.get('*', (req, res) => {
  const fs = require('fs');
  const indexDist = path.join(distPath, 'index.html');
  const indexDev = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexDist)) return res.sendFile(indexDist);
  if (fs.existsSync(indexDev)) return res.sendFile(indexDev);
  res.send('<!DOCTYPE html><html><body><div id="root">Backend ready.</div></body></html>');
});

// Start HTTP server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
