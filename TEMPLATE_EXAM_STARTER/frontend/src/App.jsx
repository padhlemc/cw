/**
 * ==============================================================================
 * 🎓 EXAM CHEAT-SHEET: MINIMAL REACT 18 DASHBOARD
 * ==============================================================================
 * Examiner Marking Points:
 * 1. React State Hooks: useState (for items list, form inputs, search)
 * 2. React Lifecycle: useEffect (fetching data automatically on component mount)
 * 3. Controlled Form: value={form.title} and onChange={e => setForm(...)}
 * 4. API Calls: fetch() with GET, POST, DELETE methods
 * 5. Rendering: items.map() to display table rows with unique key
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';

export default function App() {
  // 1. STATE: Store list of items from database
  const [items, setItems] = useState([]);

  // 2. STATE: Form inputs (match these fields to your exam prompt)
  const [form, setForm] = useState({ title: '', category: 'General', status: 'Active' });

  // 3. STATE: Real-time search query
  const [search, setSearch] = useState('');

  // 4. API HELPER: Fetch items from backend via GET /api/items
  const loadData = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Fetch error:', e);
    }
  };

  // 5. LIFECYCLE: Run loadData() once when page loads (empty dependency array [])
  useEffect(() => { loadData(); }, []);

  // 6. FORM HANDLER: Submit new item via POST /api/items
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents standard browser page reload
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ title: '', category: 'General', status: 'Active' }); // Reset form
    loadData(); // Refresh list to show newly added item
  };

  // 7. ACTION HANDLER: Delete item by ID via DELETE /api/items/:id
  const handleDelete = async (id) => {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    loadData(); // Refresh list after deletion
  };

  // 8. FILTER: Filter records matching current search query
  const filtered = items.filter(item =>
    (item.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'sans-serif', padding: 15 }}>
      <h2>🎓 Exam Starter Dashboard</h2>

      {/* --- FORM SECTION: Controlled Input Fields --- */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
          style={{ flex: 1, padding: 8 }}
        />
        <select
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          style={{ padding: 8 }}
        >
          <option>General</option>
          <option>Urgent</option>
          <option>Optional</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Add Item
        </button>
      </form>

      {/* --- SEARCH FILTER SECTION --- */}
      <input
        placeholder="Search records by title..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', boxSizing: 'border-box', padding: 8, marginBottom: 15 }}
      />

      {/* --- DATA TABLE SECTION: items.map() --- */}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(item => (
            <tr key={item._id || item.id}>
              <td>{item.title}</td>
              <td>{item.category}</td>
              <td>{item.status}</td>
              <td>
                <button
                  onClick={() => handleDelete(item._id || item.id)}
                  style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No items found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
