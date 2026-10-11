/**
 * ============================================================================
 * 🎓 UNIVERSAL FULL-STACK EXAM SERVER (Node.js + Express + Native MongoDB)
 * ============================================================================
 * Features:
 * - Dual-Mode Database: Official Native MongoDB Client + Automatic JSON Fallback
 * - Zero Lab Crashes: If MongoDB service is offline, automatically saves to JSON
 * - Full CRUD REST APIs: GET, POST, PUT, DELETE
 * - Universal Search & Query Filtering (category, status, region, keyword)
 * - Auto-serves built React Vite frontend on the same port
 *
 * THE "ONLY CHANGE 3 PLACES" RULE:
 * 1. CHANGE ZONE 1: Port, Database Name & Collection Name
 * 2. CHANGE ZONE 2: Dummy Schema Records
 * 3. CHANGE ZONE 3: Optional Validation / AI Logic hook (e.g. Heatwave / Irrigation)
 * Everything else is 100% automated!
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

/* ============================================================================
 * ✏️ [CHANGE ZONE 1: CONFIGURATION & ENTITY NAMES]
 * Change PORT, DB_NAME, and COLLECTION_NAME for your specific exam question.
 * ============================================================================ */
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'exam_starter_db';      // e.g. 'climate_intelligence_db', 'sugarcane_irrigation'
const COLLECTION_NAME = 'items';         // e.g. 'climate_records', 'plots', 'heatwave_data'
const API_BASE = '/api/items';           // e.g. '/api/climate', '/api/plots', '/api/heatwave'

// Express Middleware
app.use(cors());
app.use(express.json());

// Serve production Vite React frontend
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');
const FRONTEND_DIR = fs.existsSync(FRONTEND_DIST) ? FRONTEND_DIST : path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));

/* ============================================================================
 * ✏️ [CHANGE ZONE 2: INITIAL SAMPLE DATA & SCHEMA SEED]
 * Put 2-3 realistic records matching your question requirements.
 * ============================================================================ */
const DATA_FILE = path.join(__dirname, 'data_fallback.json');
let memoryData = [
  { id: '1', title: 'Sample Item Alpha', category: 'General', description: 'Universal template item demonstrating CRUD', status: 'Active' },
  { id: '2', title: 'Sample Item Beta', category: 'Urgent', description: 'Second template item ready for editing', status: 'Pending' },
  { id: '3', title: 'Sample Item Gamma', category: 'General', description: 'Third template item showcasing list view', status: 'Completed' }
];

/* ============================================================================
 * ✏️ [CHANGE ZONE 3: OPTIONAL VALIDATION & AI / BUSINESS LOGIC HOOK]
 * Add custom calculations, severity classification, or irrigation rules here.
 * ============================================================================ */
function validateAndEnrich(record) {
  // Example AI Heatwave Classification (Problem Statement 2):
  // const temp = Number(record.temperature || record.value || 0);
  // if (temp >= 45) record.severity = 'Extreme';
  // else if (temp >= 40) record.severity = 'Severe';
  // else if (temp >= 35) record.severity = 'Moderate';
  // else record.severity = 'Normal';

  // Example Smart Sugarcane Irrigation Decision (Problem Statements 3 & 4):
  // const moisture = Number(record.soilMoisture || 0);
  // if (moisture < 30) record.recommendation = 'Irrigate Immediately (120 min)';
  // else if (moisture < 50) record.recommendation = 'Schedule Irrigation (60 min)';
  // else record.recommendation = 'Adequate Moisture - No Irrigation Needed';

  return {
    ...record,
    updatedAt: new Date().toISOString()
  };
}

/* ============================================================================
 * 🔒 [OFFLINE STORAGE FALLBACK - PREVENTS ANY LAB CRASH!]
 * ============================================================================ */
function loadFallback() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      memoryData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch (e) {
      console.error('[Fallback] Error loading JSON:', e.message);
    }
  }
}

function saveFallback() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryData, null, 2));
  } catch (e) {
    console.error('[Fallback] Error writing JSON:', e.message);
  }
}

/* ============================================================================
 * 🔒 [MONGODB NATIVE CLIENT WITH AUTOMATIC OFFLINE DETECTION]
 * ============================================================================ */
let db = null;
let isMongoConnected = false;

async function connectDB() {
  loadFallback();
  try {
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    await client.connect();
    db = client.db(DB_NAME);
    isMongoConnected = true;
    console.log(`[MongoClient] Successfully connected to MongoDB database: ${DB_NAME}`);

    // Seed initial records if collection is completely empty
    const count = await db.collection(COLLECTION_NAME).countDocuments();
    if (count === 0 && memoryData.length > 0) {
      await db.collection(COLLECTION_NAME).insertMany(memoryData.map(item => ({ ...item, _id: item.id })));
      console.log(`[MongoClient] Seeded ${memoryData.length} initial records into collection '${COLLECTION_NAME}'`);
    }
  } catch (err) {
    console.log('[MongoClient] MongoDB offline/unavailable. Seamless JSON fallback active.');
    isMongoConnected = false;
  }
}

const formatDoc = doc => ({ ...doc, id: String(doc._id || doc.id) });

/* ============================================================================
 * 🔒 [UNIVERSAL RESTful CRUD API ENDPOINTS (GET, POST, PUT, DELETE)]
 * ============================================================================ */

// GET ALL (Supports search & query parameter filters)
app.get(API_BASE, async (req, res) => {
  try {
    const { search, category, status, region } = req.query;

    if (isMongoConnected && db) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (status && status !== 'All') query.status = status;
      if (region && region !== 'All') query.region = region;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { region: { $regex: search, $options: 'i' } }
        ];
      }
      const docs = await db.collection(COLLECTION_NAME).find(query).toArray();
      return res.json(docs.map(formatDoc));
    }

    // Fallback store search & filter
    let results = [...memoryData];
    if (category && category !== 'All') results = results.filter(i => i.category === category);
    if (status && status !== 'All') results = results.filter(i => i.status === status);
    if (region && region !== 'All') results = results.filter(i => i.region === region);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(item =>
        Object.values(item).some(val => typeof val === 'string' && val.toLowerCase().includes(q))
      );
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ONE BY ID
app.get(`${API_BASE}/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected && db) {
      const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
      const doc = await db.collection(COLLECTION_NAME).findOne(filter);
      if (!doc) return res.status(404).json({ error: 'Record not found' });
      return res.json(formatDoc(doc));
    }

    const item = memoryData.find(i => String(i.id) === String(id));
    if (!item) return res.status(404).json({ error: 'Record not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST (Create new record)
app.post(API_BASE, async (req, res) => {
  try {
    const enriched = validateAndEnrich({
      ...req.body,
      createdAt: new Date().toISOString()
    });

    if (isMongoConnected && db) {
      const result = await db.collection(COLLECTION_NAME).insertOne(enriched);
      return res.status(201).json({ ...enriched, id: String(result.insertedId) });
    }

    // Fallback in-memory / JSON store
    const fallbackItem = {
      ...enriched,
      id: enriched.id || 'id_' + Date.now()
    };
    memoryData.unshift(fallbackItem);
    saveFallback();
    res.status(201).json(fallbackItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (Update existing record)
app.put(`${API_BASE}/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = validateAndEnrich(req.body);

    if (isMongoConnected && db) {
      const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
      await db.collection(COLLECTION_NAME).updateOne(filter, { $set: updates });
      const updated = await db.collection(COLLECTION_NAME).findOne(filter);
      return res.json(formatDoc(updated || { id, ...updates }));
    }

    const idx = memoryData.findIndex(i => String(i.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: 'Record not found' });
    memoryData[idx] = { ...memoryData[idx], ...updates, id };
    saveFallback();
    res.json(memoryData[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE (Remove record)
app.delete(`${API_BASE}/:id`, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && db) {
      const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
      await db.collection(COLLECTION_NAME).deleteOne(filter);
      return res.json({ success: true, id });
    }

    const initialLen = memoryData.length;
    memoryData = memoryData.filter(i => String(i.id) !== String(id));
    if (memoryData.length === initialLen) {
      return res.status(404).json({ error: 'Record not found' });
    }
    saveFallback();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all route to serve the React frontend index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  const indexPath = fs.existsSync(path.join(FRONTEND_DIST, 'index.html'))
    ? path.join(FRONTEND_DIST, 'index.html')
    : path.join(FRONTEND_DIR, 'index.html');
  res.sendFile(indexPath);
});

/* ============================================================================
 * 🔒 [SERVER BOOTSTRAP]
 * ============================================================================ */
app.listen(PORT, async () => {
  console.log('=================================================================');
  console.log(`[Universal Exam Template] Running at: http://localhost:${PORT}`);
  console.log(`API Base: http://localhost:${PORT}${API_BASE}`);
  console.log('Database Engine: Native MongoClient (Auto Offline Fallback Active)');
  console.log('=================================================================');
  await connectDB();
});
