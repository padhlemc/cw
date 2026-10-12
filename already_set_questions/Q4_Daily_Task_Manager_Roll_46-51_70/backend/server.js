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
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(distPath));
app.use(express.static(frontendPath));

let memoryTasks = [
  { _id: '1', title: 'Complete Lab Manual', priority: 'High', status: 'Pending' },
  { _id: '2', title: 'Review MongoDB Queries', priority: 'Medium', status: 'Completed' },
  { _id: '3', title: 'Test React Hooks', priority: 'High', status: 'Pending' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 1500 });
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('tasks').countDocuments() === 0) {
      await db.collection('tasks').insertMany(memoryTasks);
    }
  })
  .catch(() => console.log('[MongoDB Offline] Running in memory mode'));

// GET tasks
app.get('/api/tasks', async (req, res) => {
  if (db) return res.json(await db.collection('tasks').find().toArray());
  res.json(memoryTasks);
});

// POST task
app.post('/api/tasks', async (req, res) => {
  const newTask = { ...req.body, status: req.body.status || 'Pending', _id: new ObjectId().toString() };
  if (db) await db.collection('tasks').insertOne(newTask);
  else memoryTasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT task (toggle status)
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  delete updates._id;

  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('tasks').updateOne(query, { $set: updates });
  } else {
    memoryTasks = memoryTasks.map(t => String(t._id) === String(id) ? { ...t, ...updates } : t);
  }
  res.json({ message: 'Task updated' });
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('tasks').deleteOne(query);
  } else {
    memoryTasks = memoryTasks.filter(t => String(t._id) !== String(id));
  }
  res.json({ message: 'Task deleted' });
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

app.listen(PORT, () => console.log(`Q4 Task Manager Server running on http://localhost:${PORT}`));
