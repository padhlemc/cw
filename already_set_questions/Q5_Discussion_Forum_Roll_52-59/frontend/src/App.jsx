import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './style.css';

function PostsListView({ posts, onUpvote, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>Discussion Threads ({posts.length})</h3>
        <button onClick={() => navigate('/add')} className="btn btn-primary">
          Start New Thread
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>TITLE</th><th>AUTHOR</th><th>CATEGORY</th><th>UPVOTES</th><th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p._id}>
              <td><strong>{p.title}</strong></td>
              <td>{p.author}</td>
              <td>{p.category}</td>
              <td>{p.upvotes || 0}</td>
              <td>
                <button onClick={() => onUpvote(p._id)} className="btn btn-secondary btn-sm">
                  +1 Upvote
                </button>
                <button onClick={() => onDelete(p._id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: 20 }}>No discussions yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function AddPostView({ onAdd }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', author: '', category: 'Tech', content: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    navigate('/');
  };

  return (
    <div className="card">
      <h2>Start New Discussion Thread</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Thread Title:</label>
          <input
            required
            placeholder="e.g. How does MongoDB connection work?"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Your Name / Author:</label>
          <input
            required
            placeholder="Enter author name"
            value={form.author}
            onChange={e => setForm({ ...form, author: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option>Tech</option>
            <option>General</option>
            <option>Questions</option>
          </select>
        </div>

        <div className="form-group">
          <label>Content:</label>
          <textarea
            required
            rows="3"
            placeholder="Write your discussion post..."
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button type="submit" className="btn btn-primary">Post Thread</button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    const res = await fetch('/api/posts');
    setPosts(await res.json());
  };

  useEffect(() => { loadPosts(); }, []);

  const handleAdd = async (formData) => {
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    loadPosts();
  };

  const handleUpvote = async (id) => {
    await fetch(`/api/posts/${id}/upvote`, { method: 'PUT' });
    loadPosts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    loadPosts();
  };

  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>DevConnect Discussion Forum (Roll 52-59)</h1>
          <nav className="nav">
            <Link to="/" className="nav-link">All Threads</Link>
            <Link to="/add" className="nav-link">New Thread</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <PostsListView
                  posts={posts}
                  onUpvote={handleUpvote}
                  onDelete={handleDelete}
                />
              }
            />
            <Route
              path="/add"
              element={<AddPostView onAdd={handleAdd} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
