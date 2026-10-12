/**
 * ==============================================================================
 * UNIVERSAL EXAM FRONTEND (App.jsx) - React 18 + React Router v6
 * ==============================================================================
 * Examiner Marking Points:
 * 1. React Router: HashRouter with Routes, Route, Link, useNavigate
 * 2. React Hooks: useState (items, form, search) & useEffect (fetch on mount)
 * 3. Controlled Form: value={form.title} and onChange={e => setForm(...)}
 * 4. API Calls: fetch() with GET, POST, PUT, DELETE methods
 * 5. Rendering: items.map() with unique key, search filter, delete & status actions
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './style.css';

/* ==============================================================================
 * CHANGE ZONE 1: INITIAL FORM FIELDS (Change these to match your question)
 * ==============================================================================
 * Example for Books:   { title: '', author: '', price: '', category: 'Tech' }
 * Example for Tasks:   { title: '', priority: 'High', dueDate: '', status: 'Pending' }
 * Example for Expense: { title: '', amount: '', category: 'Food', date: '' }
 */
const INITIAL_FORM = {
  title: '',
  category: 'General',
  status: 'Active'
};

// ------------------------------------------------------------------------------
// ROUTE 1: RECORDS TABLE VIEW ('/')
// ------------------------------------------------------------------------------
function ListView({ items, onDelete, onToggle, search, setSearch }) {
  const navigate = useNavigate();

  // Filter records by search keyword
  const filtered = items.filter(it =>
    Object.values(it).some(val => String(val || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="card">
      <div className="controls">
        <input
          placeholder="Search records by keyword..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <button onClick={() => navigate('/add')} className="btn btn-primary">
          Add New Record
        </button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              {/* CHANGE ZONE 2: TABLE HEADERS */}
              <th>TITLE</th>
              <th>CATEGORY</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(it => (
              <tr key={it._id}>
                {/* CHANGE ZONE 3: TABLE DATA CELLS */}
                <td>{it.title}</td>
                <td>{it.category}</td>
                <td>
                  <span className={`badge ${it.status === 'Active' ? 'badge-good' : 'badge-warn'}`}>
                    {it.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => onToggle(it)} className="btn btn-secondary btn-sm">
                    Toggle
                  </button>
                  <button onClick={() => onDelete(it._id)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="empty">
                  No records found. Click "Add New Record" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------
// ROUTE 2: ADD RECORD FORM VIEW ('/add')
// ------------------------------------------------------------------------------
function AddView({ onAdd }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd(form);
    navigate('/'); // Redirect back to table
  };

  return (
    <div className="card">
      <h2>Add New Record</h2>
      <form onSubmit={handleSubmit} className="form">
        {/* CHANGE ZONE 4: FORM INPUT FIELDS */}
        <div className="form-group">
          <label>Title:</label>
          <input
            required
            placeholder="Enter title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option>General</option>
            <option>Urgent</option>
            <option>Optional</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save Record</button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

// ------------------------------------------------------------------------------
// MASTER APP CONTAINER (REACT ROUTER WRAPPER)
// ------------------------------------------------------------------------------
export default function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  // 1. Fetch items from backend
  const loadData = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log('Backend fetch error:', e);
    }
  };

  useEffect(() => { loadData(); }, []);

  // 2. Add item via POST /api/items
  const handleAdd = async (newRecord) => {
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    });
    loadData();
  };

  // 3. Delete item via DELETE /api/items/:id
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    loadData();
  };

  // 4. Update status via PUT /api/items/:id
  const handleToggle = async (item) => {
    const nextStatus = item.status === 'Active' ? 'Pending' : 'Active';
    await fetch(`/api/items/${item._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });
    loadData();
  };

  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>Exam Management Dashboard</h1>
          <nav className="nav">
            <Link to="/" className="nav-link">Records List</Link>
            <Link to="/add" className="nav-link">Add Record</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <ListView
                  items={items}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  search={search}
                  setSearch={setSearch}
                />
              }
            />
            <Route path="/add" element={<AddView onAdd={handleAdd} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
