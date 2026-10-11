/**
 * ==============================================================================
 * 🎓 THE UNIVERSAL EXAM REACT DASHBOARD (Lean, Aesthetic, 4 Change Zones)
 * ==============================================================================
 * Examiner Marking Points:
 * 1. useState: items list, form fields, search filter
 * 2. useEffect: auto-load records on component mount
 * 3. Controlled form inputs with standard validation
 * 4. Full REST communication: fetch with GET, POST, DELETE
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import './style.css';

export default function App() {
  // 1. STATE: Database records list
  const [items, setItems] = useState([]);

  // 2. STATE [CHANGE ZONE 3]: Form input state
  const [form, setForm] = useState({ title: '', category: 'General', status: 'Active' });

  // 3. STATE: Real-time search query
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // 4. API: Fetch all records from Express + MongoDB
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/items');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // 5. API: Submit new record (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setForm({ title: '', category: 'General', status: 'Active' });
    loadData();
  };

  // 6. API: Delete record by ID (DELETE)
  const handleDelete = async (id) => {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    loadData();
  };

  // 7. FILTER: Search filtering
  const filtered = items.filter(item =>
    (item.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      {/* --- DASHBOARD HEADER --- */}
      <div className="header">
        <div>
          <h1 className="title">Exam Starter Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Universal Full-Stack CRUD (MongoDB + Express + React)</p>
        </div>
        <span className="db-pill">🟢 MongoDB Connected</span>
      </div>

      {/* --- CHANGE ZONE 3: FORM INPUTS --- */}
      <form onSubmit={handleSubmit} className="form-grid">
        <input
          placeholder="Item title / name..."
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
          style={{ flex: 2 }}
        />
        <select
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          style={{ flex: 1 }}
        >
          <option value="General">General</option>
          <option value="Urgent">Urgent</option>
          <option value="Optional">Optional</option>
        </select>
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          style={{ flex: 1 }}
        >
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit" className="btn-primary">
          + Add
        </button>
      </form>

      {/* --- SEARCH FILTER --- */}
      <input
        type="text"
        className="search-input"
        placeholder="🔍 Search items by title..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* --- CHANGE ZONE 4: DATA TABLE --- */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(item => (
            <tr key={item._id || item.id}>
              <td><strong>{item.title}</strong></td>
              <td><span className={`badge badge-${item.category}`}>{item.category}</span></td>
              <td><span className={`badge badge-${item.status}`}>{item.status}</span></td>
              <td style={{ textAlign: 'right' }}>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(item._id || item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                {loading ? 'Loading records...' : 'No records found. Add one above!'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
