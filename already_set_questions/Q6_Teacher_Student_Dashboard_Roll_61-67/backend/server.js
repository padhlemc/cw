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
app.use(express.static(distPath));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

let memoryStudents = [
  { _id: '1', name: 'Aarav Sharma', rollNo: '61', math: 85, science: 90, english: 88, total: 263, percentage: 87.7, grade: 'A' },
  { _id: '2', name: 'Bhavna Patel', rollNo: '62', math: 72, science: 65, english: 78, total: 215, percentage: 71.7, grade: 'B' },
  { _id: '3', name: 'Chirag Rao', rollNo: '63', math: 45, science: 52, english: 48, total: 145, percentage: 48.3, grade: 'C' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017');
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('students').countDocuments() === 0) {
      await db.collection('students').insertMany(memoryStudents);
    }
  })
  .catch(() => console.log('[MongoDB] Offline - Using memory'));

app.get('/api/students', async (req, res) => {
  if (db) return res.json(await db.collection('students').find().toArray());
  res.json(memoryStudents);
});

app.post('/api/students', async (req, res) => {
  const m1 = Number(req.body.math || 0);
  const m2 = Number(req.body.science || 0);
  const m3 = Number(req.body.english || 0);
  const total = m1 + m2 + m3;
  const percentage = Number((total / 3).toFixed(1));
  let grade = 'F';
  if (percentage >= 80) grade = 'A';
  else if (percentage >= 60) grade = 'B';
  else if (percentage >= 40) grade = 'C';

  const student = { ...req.body, math: m1, science: m2, english: m3, total, percentage, grade, _id: new ObjectId().toString() };
  if (db) await db.collection('students').insertOne(student);
  else memoryStudents.push(student);
  res.status(201).json(student);
});

app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  if (db) await db.collection('students').deleteOne({ _id: id });
  else memoryStudents = memoryStudents.filter(s => s._id !== id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
