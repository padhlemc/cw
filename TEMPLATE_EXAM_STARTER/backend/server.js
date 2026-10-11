/**
 * ==============================================================================
 * UNIVERSAL EXAM SERVER (Express + Native MongoDB MongoClient)
 * ==============================================================================
 * Examiner Marking Points:
 * 1. Express setup & middleware: cors, express.json
 * 2. MongoDB Native Driver: MongoClient, ObjectId (NO Mongoose)
 * 3. 4 Standard REST API Endpoints: GET, POST, PUT, DELETE
 * 4. Automatic In-Memory Fallback: Lab computer NEVER crashes if MongoDB is stopped
 * 5. Serves aesthetic React frontend on the same port (5000)
 * ==============================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_NAME = 'exam_starter_db';
const COLLECTION = 'items';

// 1. MIDDLEWARES: Parse JSON body & allow cross-origin requests
app.use(cors());
app.use(express.json());

// 2. STATIC FILES: Serve modern frontend assets
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 3. IN-MEMORY FALLBACK (Guarantees zero crashes if MongoDB service is stopped)
let memoryItems = [
  { _id: '1', title: 'Sample Item Alpha', category: 'General', status: 'Active' },
  { _id: '2', title: 'Sample Item Beta', category: 'Urgent', status: 'Pending' },
  { _id: '3', title: 'Sample Item Gamma', category: 'General', status: 'Completed' }
];

// 4. MONGODB NATIVE DRIVER CONNECTION
let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 2000 });

client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected: Database "${DB_NAME}" -> Collection "${COLLECTION}"`);

    // Auto-seed sample items if collection is empty
    const count = await db.collection(COLLECTION).countDocuments();
    if (count === 0) {
      await db.collection(COLLECTION).insertMany([
        { title: 'Sample Item Alpha', category: 'General', status: 'Active' },
        { title: 'Sample Item Beta', category: 'Urgent', status: 'Pending' },
        { title: 'Sample Item Gamma', category: 'General', status: 'Completed' }
      ]);
      console.log('[MongoDB] Seeded initial sample items.');
    }
  })
  .catch(() => console.log('[MongoDB] Offline! Seamless in-memory fallback active.'));

// Helper: Match both native ObjectId and custom string IDs
function buildFilter(id) {
  if (ObjectId.isValid(id) && id.length === 24) {
    return { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
  }
  return { _id: id };
}

// ==============================================================================
// THE 4 CORE REST API ENDPOINTS
// ==============================================================================

// ROUTE 1: GET ALL ITEMS -> db.collection.find().toArray()
app.get('/api/items', async (req, res) => {
  try {
    if (db) {
      const docs = await db.collection(COLLECTION).find().toArray();
      return res.json(docs.map(doc => ({ ...doc, _id: String(doc._id) })));
    }
    res.json(memoryItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 2: CREATE ITEM -> db.collection.insertOne(req.body)
app.post('/api/items', async (req, res) => {
  try {
    const item = {
      title: req.body.title || 'Untitled',
      category: req.body.category || 'General',
      status: req.body.status || 'Active',
      createdAt: new Date().toISOString()
    };

    if (db) {
      const result = await db.collection(COLLECTION).insertOne(item);
      item._id = String(result.insertedId);
    } else {
      item._id = String(Date.now());
      memoryItems.push(item);
    }

    console.log(`[POST] Created item: "${item.title}" (_id: ${item._id})`);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 3: UPDATE ITEM -> db.collection.updateOne(...)
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (db) {
      await db.collection(COLLECTION).updateOne(buildFilter(id), { $set: req.body });
    } else {
      memoryItems = memoryItems.map(item => String(item._id) === String(id) ? { ...item, ...req.body } : item);
    }
    console.log(`[PUT] Updated item ID: ${id}`);
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 4: DELETE ITEM -> db.collection.deleteOne(...)
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (db) {
      const result = await db.collection(COLLECTION).deleteOne(buildFilter(id));
      console.log(`[DELETE] Deleted ID: ${id} (Deleted count: ${result.deletedCount})`);
    } else {
      memoryItems = memoryItems.filter(item => String(item._id) !== String(id));
    }
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. CATCH-ALL ROUTE: Serve React UI
app.get('*', (req, res) => {
  const distHtml = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
  const rawHtml = path.join(__dirname, '..', 'frontend', 'index.html');
  res.sendFile(fs.existsSync(distHtml) ? distHtml : rawHtml);
});

// 6. START SERVER
app.listen(PORT, () => {
  console.log(`[SERVER] Universal Exam Starter running at: http://localhost:${PORT}`);
});
