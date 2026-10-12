const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5005;
const DB_NAME = 'discussion_forum';

app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(distPath));
app.use(express.static(frontendPath));

let memoryPosts = [
  { _id: '1', title: 'Why use Native Mongo over Mongoose?', author: 'Aryan', category: 'Tech', upvotes: 12 },
  { _id: '2', title: 'React Router v6 vs state tabs in exams', author: 'Rahul', category: 'General', upvotes: 8 }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 1500 });
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('posts').countDocuments() === 0) {
      await db.collection('posts').insertMany(memoryPosts);
    }
  })
  .catch(() => console.log('[MongoDB Offline] Running in memory mode'));

// GET posts
app.get('/api/posts', async (req, res) => {
  if (db) return res.json(await db.collection('posts').find().toArray());
  res.json(memoryPosts);
});

// POST post
app.post('/api/posts', async (req, res) => {
  const newPost = { ...req.body, upvotes: 0, _id: new ObjectId().toString() };
  if (db) await db.collection('posts').insertOne(newPost);
  else memoryPosts.push(newPost);
  res.status(201).json(newPost);
});

// PUT post (upvote)
app.put('/api/posts/:id/upvote', async (req, res) => {
  const { id } = req.params;
  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('posts').updateOne(query, { $inc: { upvotes: 1 } });
  } else {
    memoryPosts = memoryPosts.map(p => String(p._id) === String(id) ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p);
  }
  res.json({ message: 'Upvoted' });
});

// DELETE post
app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('posts').deleteOne(query);
  } else {
    memoryPosts = memoryPosts.filter(p => String(p._id) !== String(id));
  }
  res.json({ message: 'Post deleted' });
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

app.listen(PORT, () => console.log(`Q5 Discussion Forum Server running on http://localhost:${PORT}`));
