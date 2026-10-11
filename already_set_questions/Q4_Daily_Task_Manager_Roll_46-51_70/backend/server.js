const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5004;
const DB_NAME = 'task_manager';

app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

let memoryTasks = [
  { _id: '1', title: 'Complete Lab Assignment', priority: 'High', status: 'Pending' },
  { _id: '2', title: 'Review Express Routing', priority: 'Medium', status: 'In Progress' },
  { _id: '3', title: 'Submit Project Report', priority: 'High', status: 'Completed' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017');
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('tasks').countDocuments() === 0) {
      await db.collection('tasks').insertMany(memoryTasks);
    }
  })
  .catch(() => console.log('[MongoDB] Offline - Using memory'));

app.get('/api/tasks', async (req, res) => {
  if (db) return res.json(await db.collection('tasks').find().toArray());
  res.json(memoryTasks);
});

app.post('/api/tasks', async (req, res) => {
  const task = { ...req.body, status: req.body.status || 'Pending', _id: new ObjectId().toString() };
  if (db) await db.collection('tasks').insertOne(task);
  else memoryTasks.push(task);
  res.status(201).json(task);
});

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (db) await db.collection('tasks').updateOne({ _id: id }, { $set: { status } });
  else memoryTasks = memoryTasks.map(t => t._id === id ? { ...t, status } : t);
  res.json({ message: 'Updated' });
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  if (db) await db.collection('tasks').deleteOne({ _id: id });
  else memoryTasks = memoryTasks.filter(t => t._id !== id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
