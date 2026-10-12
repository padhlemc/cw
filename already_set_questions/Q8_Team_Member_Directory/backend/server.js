const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5008;
const DB_NAME = 'team_directory_db';

app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(distPath));
app.use(express.static(frontendPath));

let memoryMembers = [
  { _id: '1', name: 'Aakash Verma', role: 'Frontend Lead', dept: 'Engineering', email: 'aakash@example.com' },
  { _id: '2', name: 'Ritu Sen', role: 'Product Designer', dept: 'Design', email: 'ritu@example.com' },
  { _id: '3', name: 'Kunal Deshmukh', role: 'Backend Engineer', dept: 'Engineering', email: 'kunal@example.com' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 1500 });
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('members').countDocuments() === 0) {
      await db.collection('members').insertMany(memoryMembers);
    }
  })
  .catch(() => console.log('[MongoDB Offline] Running in memory mode'));

// GET members
app.get('/api/members', async (req, res) => {
  if (db) return res.json(await db.collection('members').find().toArray());
  res.json(memoryMembers);
});

// POST member
app.post('/api/members', async (req, res) => {
  const newMember = { ...req.body, _id: new ObjectId().toString() };
  if (db) await db.collection('members').insertOne(newMember);
  else memoryMembers.push(newMember);
  res.status(201).json(newMember);
});

// DELETE member
app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('members').deleteOne(query);
  } else {
    memoryMembers = memoryMembers.filter(m => String(m._id) !== String(id));
  }
  res.json({ message: 'Member deleted' });
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

app.listen(PORT, () => console.log(`Q8 Team Directory Server running on http://localhost:${PORT}`));
