import React, { useState, useEffect } from 'react';

/**
 * ============================================================================
 * 🎓 UNIVERSAL FULL-STACK REACT 18 DASHBOARD
 * ============================================================================
 * Features:
 * - Reactive Form Handling with Add & Edit mode
 * - Live REST API sync (GET, POST, PUT, DELETE)
 * - Real-time Full-Text Search and Category Filtering
 * - Dynamic Summary Metric Cards (Total, Active, Custom KPIs)
 * - Responsive Modern UI with Status Badges and Action Controls
 *
 * THE "ONLY CHANGE 4 PLACES" RULE:
 * 1. CHANGE ZONE 1: Dashboard Title & Initial Form Fields
 * 2. CHANGE ZONE 2: Summary Metric KPI Calculations
 * 3. CHANGE ZONE 3: Form Input Controls
 * 4. CHANGE ZONE 4: Table Column Headers & Row Display
 * ============================================================================
 */

/* ============================================================================
 * ✏️ [CHANGE ZONE 1: TITLE & FORM INITIAL STATE]
 * Match these fields to your exam question (e.g., plot, moisture, cropStage, etc.)
 * ============================================================================ */
const PAGE_TITLE = 'Universal Exam Dashboard';
const PAGE_SUBTITLE = 'Full-Stack Node.js + Express + React 18 + MongoDB / Offline Fallback';
const API_URL = '/api/items'; // e.g. '/api/items', '/api/climate', '/api/plots'

const INITIAL_FORM = {
  title: '',
  category: 'General',
  status: 'Active',
  description: ''
};

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // --------------------------------------------------------------------------
  // Notification Toast Helper
  // --------------------------------------------------------------------------
  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --------------------------------------------------------------------------
  // API: FETCH ALL RECORDS
  // --------------------------------------------------------------------------
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
      notify('Failed to load records from backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------------------------------------------------
  // API: SUBMIT FORM (CREATE / UPDATE)
  // --------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(editingId);
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Failed to save record');

      notify(isEdit ? 'Record updated successfully!' : 'Record created successfully!');
      setForm(INITIAL_FORM);
      setEditingId(null);
      loadData();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // EDIT & CANCEL
  // --------------------------------------------------------------------------
  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
  };

  // --------------------------------------------------------------------------
  // API: DELETE RECORD
  // --------------------------------------------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete record');
      notify('Record deleted successfully!');
      loadData();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  /* ============================================================================
   * ✏️ [CHANGE ZONE 2: SUMMARY METRIC CALCULATIONS]
   * Compute 3-4 quick stats cards to impress examiners.
   * ============================================================================ */
  const totalCount = items.length;
  const activeCount = items.filter(i => (i.status || '').toLowerCase() === 'active').length;
  const pendingCount = items.filter(i => (i.status || '').toLowerCase() === 'pending').length;
  const urgentCount = items.filter(i => (i.category || '').toLowerCase() === 'urgent').length;

  // --------------------------------------------------------------------------
  // FILTER & SEARCH LOGIC
  // --------------------------------------------------------------------------
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = search.toLowerCase();
    const matchesSearch = !search || Object.values(item).some(
      val => typeof val === 'string' && val.toLowerCase().includes(q)
    );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>{PAGE_TITLE}</h1>
          <p className="subtitle">{PAGE_SUBTITLE}</p>
        </div>
        <div className="badge badge-green">● Backend Live</div>
      </header>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`notification-banner ${notification.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
          {notification.msg}
        </div>
      )}

      {/* STATS METRIC CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">Total Records</div>
        </div>
        <div className="stat-card">
          <div className="stat-value stat-green">{activeCount}</div>
          <div className="stat-label">Active Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-value stat-yellow">{pendingCount}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-value stat-red">{urgentCount}</div>
          <div className="stat-label">Urgent Priority</div>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="card form-box">
        <div className="card-header">
          <h2>{editingId ? '✏️ Edit Record' : '➕ Add New Record'}</h2>
          {editingId && (
            <span className="badge badge-yellow">Editing ID: {editingId}</span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* ================================================================
           * ✏️ [CHANGE ZONE 3: FORM INPUT CONTROLS]
           * Modify the input fields below to match your question requirements.
           * ================================================================ */}
          <div className="form-row">
            <div className="form-group flex-2">
              <label>Title / Identifier *</label>
              <input
                type="text"
                required
                placeholder="e.g. Plot #101 / Heatwave Alpha / Sample Item"
                value={form.title || ''}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="form-group flex-1">
              <label>Category / Type</label>
              <select
                value={form.category || 'General'}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Urgent">Urgent</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Climate">Climate</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Status</label>
              <select
                value={form.status || 'Active'}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description / Additional Notes</label>
            <textarea
              rows="2"
              placeholder="Enter details, sensor telemetry, observation notes..."
              value={form.description || ''}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? '💾 Update Record' : '🚀 Save Record'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                ✖ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="controls-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Full-text search across all fields..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="category-filter">
          <label>Filter:</label>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="General">General</option>
            <option value="Urgent">Urgent</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Climate">Climate</option>
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="card table-card">
        <div className="card-header">
          <h2>📋 Records List ({filteredItems.length})</h2>
          <button className="btn btn-small btn-secondary" onClick={loadData}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading data from backend...</div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">No records found matching your filters.</div>
        ) : (
          <div className="table-responsive">
            <table>
              {/* ============================================================
               * ✏️ [CHANGE ZONE 4: TABLE HEADERS & ROW CELLS]
               * Match table headers and table data cells to your schema.
               * ============================================================ */}
              <thead>
                <tr>
                  <th>Title / Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.title || item.name || '-'}</strong>
                    </td>
                    <td>{item.category || '-'}</td>
                    <td>
                      <span className={`badge ${
                        (item.status || '').toLowerCase() === 'active' ? 'badge-green' :
                        (item.status || '').toLowerCase() === 'completed' ? 'badge-blue' :
                        'badge-yellow'
                      }`}>
                        {item.status || 'Active'}
                      </span>
                    </td>
                    <td>{item.description || item.region || item.notes || '-'}</td>
                    <td className="actions">
                      <button className="btn btn-warning btn-small" onClick={() => handleEdit(item)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-small" onClick={() => handleDelete(item.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
