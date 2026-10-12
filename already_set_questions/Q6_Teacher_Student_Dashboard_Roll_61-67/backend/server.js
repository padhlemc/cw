const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5006;
const DB_NAME = 'gradebook_db';

app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(distPath));
app.use(express.static(frontendPath));

let memoryStudents = [
  { _id: '1', name: 'Aarav Sharma', roll: '61', subject: 'Web Dev', marks: 85, grade: 'A' },
  { _id: '2', name: 'Diya Patel', roll: '62', subject: 'Web Dev', marks: 72, grade: 'B' },
  { _id: '3', name: 'Ishaan Verma', roll: '63', subject: 'Web Dev', marks: 91, grade: 'A' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 1500 });
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('students').countDocuments() === 0) {
      await db.collection('students').insertMany(memoryStudents);
    }
  })
  .catch(() => console.log('[MongoDB Offline] Running in memory mode'));

// GET students
app.get('/api/students', async (req, res) => {
  if (db) return res.json(await db.collection('students').find().toArray());
  res.json(memoryStudents);
});

// POST student
app.post('/api/students', async (req, res) => {
  const m = Number(req.body.marks || 0);
  const grade = m >= 80 ? 'A' : m >= 60 ? 'B' : m >= 40 ? 'C' : 'F';
  const newStudent = { ...req.body, marks: m, grade, _id: new ObjectId().toString() };
  if (db) await db.collection('students').insertOne(newStudent);
  else memoryStudents.push(newStudent);
  res.status(201).json(newStudent);
});

// DELETE student
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('students').deleteOne(query);
  } else {
    memoryStudents = memoryStudents.filter(s => String(s._id) !== String(id));
  }
  res.json({ message: 'Student record deleted' });
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

app.listen(PORT, () => console.log(`Q6 Gradebook Server running on http://localhost:${PORT}`));
