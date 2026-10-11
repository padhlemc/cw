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
app.use(express.static(distPath));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

let memoryPatients = [
  { _id: '1', name: 'Ramesh Gupta', age: 54, gender: 'Male', condition: 'Hypertension', status: 'Admitted' },
  { _id: '2', name: 'Sunita Rao', age: 38, gender: 'Female', condition: 'Viral Fever', status: 'Discharged' },
  { _id: '3', name: 'Vikram Joshi', age: 62, gender: 'Male', condition: 'Type-2 Diabetes', status: 'Admitted' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017');
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    try {
      if (await db.collection('patients').countDocuments() === 0) {
        await db.collection('patients').insertMany(memoryPatients.map(p => ({ ...p })));
      }
    } catch(e) {}
  })
  .catch(() => console.log('[MongoDB] Offline - Using memory'));

app.get('/api/patients', async (req, res) => {
  if (db) return res.json(await db.collection('patients').find().toArray());
  res.json(memoryPatients);
});

app.post('/api/patients', async (req, res) => {
  const patient = { ...req.body, age: Number(req.body.age), _id: new ObjectId().toString() };
  if (db) await db.collection('patients').insertOne(patient);
  else memoryPatients.push(patient);
  res.status(201).json(patient);
});

app.put('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (db) await db.collection('patients').updateOne({ _id: id }, { $set: { status } });
  else memoryPatients = memoryPatients.map(p => p._id === id ? { ...p, status } : p);
  res.json({ message: 'Updated' });
});

app.delete('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  if (db) await db.collection('patients').deleteOne({ _id: id });
  else memoryPatients = memoryPatients.filter(p => p._id !== id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
