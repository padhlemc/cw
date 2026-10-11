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
app.use(express.static(distPath));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

let memoryMembers = [
  { _id: '1', name: 'Aarav Patel', role: 'Frontend Engineer', email: 'aarav@company.com', skills: 'React, CSS' },
  { _id: '2', name: 'Neha Sharma', role: 'Backend Developer', email: 'neha@company.com', skills: 'Node, Express, MongoDB' },
  { _id: '3', name: 'Rohan Verma', role: 'DevOps Lead', email: 'rohan@company.com', skills: 'Docker, CI/CD' },
  { _id: '4', name: 'Pooja Iyer', role: 'UI/UX Designer', email: 'pooja@company.com', skills: 'Figma, Prototyping' },
  { _id: '5', name: 'Vikram Singh', role: 'QA Engineer', email: 'vikram@company.com', skills: 'Jest, Cypress' },
  { _id: '6', name: 'Ananya Roy', role: 'Product Manager', email: 'ananya@company.com', skills: 'Agile, Scrum' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017');
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('members').countDocuments() === 0) {
      await db.collection('members').insertMany(memoryMembers);
    }
  })
  .catch(() => console.log('[MongoDB] Offline - Using memory'));

app.get('/api/members', async (req, res) => {
  if (db) return res.json(await db.collection('members').find().toArray());
  res.json(memoryMembers);
});

app.post('/api/members', async (req, res) => {
  const member = { ...req.body, _id: new ObjectId().toString() };
  if (db) await db.collection('members').insertOne(member);
  else memoryMembers.push(member);
  res.status(201).json(member);
});

app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  if (db) await db.collection('members').deleteOne({ _id: id });
  else memoryMembers = memoryMembers.filter(m => m._id !== id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
