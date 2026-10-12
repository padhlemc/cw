const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5009;
const DB_NAME = 'patient_management_db';

app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(distPath));
app.use(express.static(frontendPath));

let memoryPatients = [
  { _id: '1', name: 'Ramesh Gupta', age: 54, gender: 'Male', condition: 'Hypertension', status: 'Admitted' },
  { _id: '2', name: 'Sunita Rao', age: 38, gender: 'Female', condition: 'Viral Fever', status: 'Discharged' },
  { _id: '3', name: 'Vikram Joshi', age: 62, gender: 'Male', condition: 'Type-2 Diabetes', status: 'Admitted' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 1500 });
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('patients').countDocuments() === 0) {
      await db.collection('patients').insertMany(memoryPatients);
    }
  })
  .catch(() => console.log('[MongoDB Offline] Running in memory mode'));

// GET patients
app.get('/api/patients', async (req, res) => {
  if (db) return res.json(await db.collection('patients').find().toArray());
  res.json(memoryPatients);
});

// POST patient
app.post('/api/patients', async (req, res) => {
  const patient = { ...req.body, age: Number(req.body.age), _id: new ObjectId().toString() };
  if (db) await db.collection('patients').insertOne(patient);
  else memoryPatients.push(patient);
  res.status(201).json(patient);
});

// PUT patient status
app.put('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('patients').updateOne(query, { $set: { status } });
  } else {
    memoryPatients = memoryPatients.map(p => String(p._id) === String(id) ? { ...p, status } : p);
  }
  res.json({ message: 'Patient status updated' });
});

// DELETE patient
app.delete('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('patients').deleteOne(query);
  } else {
    memoryPatients = memoryPatients.filter(p => String(p._id) !== String(id));
  }
  res.json({ message: 'Patient record deleted' });
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

app.listen(PORT, () => console.log(`Q9 Patient Management Server running on http://localhost:${PORT}`));
