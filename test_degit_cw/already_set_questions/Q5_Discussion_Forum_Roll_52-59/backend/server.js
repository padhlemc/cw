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
app.use(express.static(distPath));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

let memoryPosts = [
  { _id: '1', title: 'Why is React 18 so fast?', author: 'Rohan', content: 'Automatic batching and concurrency make rendering seamless.', upvotes: 12 },
  { _id: '2', title: 'Best practices for Express REST APIs', author: 'Priya', content: 'Always separate your routes, sanitize inputs, and use try-catch.', upvotes: 8 }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017');
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('posts').countDocuments() === 0) {
      await db.collection('posts').insertMany(memoryPosts);
    }
  })
  .catch(() => console.log('[MongoDB] Offline - Using memory'));

app.get('/api/posts', async (req, res) => {
  if (db) return res.json(await db.collection('posts').find().toArray());
  res.json(memoryPosts);
});

app.post('/api/posts', async (req, res) => {
  const post = { ...req.body, upvotes: 0, _id: new ObjectId().toString(), createdAt: new Date() };
  if (db) await db.collection('posts').insertOne(post);
  else memoryPosts.push(post);
  res.status(201).json(post);
});

app.put('/api/posts/:id/upvote', async (req, res) => {
  const { id } = req.params;
  if (db) {
    await db.collection('posts').updateOne({ _id: id }, { $inc: { upvotes: 1 } });
  } else {
    memoryPosts = memoryPosts.map(p => p._id === id ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p);
  }
  res.json({ message: 'Upvoted' });
});

app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  if (db) await db.collection('posts').deleteOne({ _id: id });
  else memoryPosts = memoryPosts.filter(p => p._id !== id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
