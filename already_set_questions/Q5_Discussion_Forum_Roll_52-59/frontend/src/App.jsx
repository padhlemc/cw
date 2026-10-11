import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. React Context for Global State
const ForumContext = createContext();

function PostForm() {
  const { addPost } = useContext(ForumContext);
  const [form, setForm] = useState({ title: '', author: '', content: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addPost(form);
    setForm({ title: '', author: '', content: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: 15, borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 20 }}>
      <h3>Create New Post</h3>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <input placeholder="Post Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={{ flex: 2, padding: 8 }} />
        <input placeholder="Your Name" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required style={{ flex: 1, padding: 8 }} />
      </div>
      <textarea placeholder="Write post content..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={3} style={{ width: '100%', boxSizing: 'border-box', padding: 8, marginBottom: 10 }} />
      <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        Publish Post
      </button>
    </form>
  );
}

function PostList() {
  const { posts, upvotePost, deletePost } = useContext(ForumContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3>Community Discussions ({posts.length})</h3>
      {posts.map(p => (
        <div key={p._id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 14, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <h4 style={{ margin: 0, color: '#1e293b' }}>{p.title}</h4>
            <span style={{ fontSize: 13, color: '#64748b' }}>By <strong>{p.author}</strong></span>
          </div>
          <p style={{ margin: '0 0 12px', color: '#334155', fontSize: 14 }}>{p.content}</p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => upvotePost(p._id)} style={{ padding: '4px 10px', background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 4, cursor: 'pointer' }}>
              👍 Upvote ({p.upvotes || 0})
            </button>
            <button onClick={() => deletePost(p._id)} style={{ padding: '4px 10px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
      {posts.length === 0 && <p>No discussions yet. Be the first to start one!</p>}
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

  const addPost = async (postData) => {
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    loadPosts();
  };

  const upvotePost = async (id) => {
    await fetch(`/api/posts/${id}/upvote`, { method: 'PUT' });
    loadPosts();
  };

  const deletePost = async (id) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    loadPosts();
  };

  return (
    <ForumContext.Provider value={{ posts, addPost, upvotePost, deletePost }}>
      <div style={{ maxWidth: 750, margin: '20px auto', fontFamily: 'sans-serif', padding: 15 }}>
        <h2>💬 Discussion Forum (Roll 52-59 - React Context API)</h2>
        <PostForm />
        <PostList />
      </div>
    </ForumContext.Provider>
  );
}
