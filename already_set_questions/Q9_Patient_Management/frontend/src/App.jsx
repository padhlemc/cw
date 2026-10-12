import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './style.css';

function PatientListView({ patients, onToggleStatus, onDelete, filter, setFilter, search, setSearch }) {
  const navigate = useNavigate();

  const filtered = patients
    .filter(p => filter === 'All' || p.status === filter)
    .filter(p =>
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.condition || '').toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="card">
      <div className="controls">
        <input
          placeholder="Search by name or condition..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <div style={{ display: 'flex', gap: 8 }}>
          {['All', 'Admitted', 'Discharged'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              {f}
            </button>
          ))}
          <button onClick={() => navigate('/admit')} className="btn btn-primary btn-sm">
            Admit Patient
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>PATIENT NAME</th>
            <th>AGE</th>
            <th>GENDER</th>
            <th>CONDITION</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p._id}>
              <td><strong>{p.name}</strong></td>
              <td>{p.age}</td>
              <td>{p.gender}</td>
              <td>{p.condition}</td>
              <td>
                <span className={`badge ${p.status === 'Admitted' ? 'badge-admitted' : 'badge-discharged'}`}>
                  {p.status}
                </span>
              </td>
              <td>
                <button onClick={() => onToggleStatus(p)} className="btn btn-secondary btn-sm" style={{ marginRight: 6 }}>
                  Toggle Status
                </button>
                <button onClick={() => onDelete(p._id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: 20 }}>
                No patient records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function AddPatientView({ onAdd }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', age: '', gender: 'Male', condition: '', status: 'Admitted' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    navigate('/');
  };

  return (
    <div className="card">
      <h2>Admit / Register Patient</h2>
      <form onSubmit={handleSubmit} className="form" style={{ marginTop: 16 }}>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            required
            placeholder="e.g. Ramesh Gupta"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            required
            placeholder="e.g. 45"
            value={form.age}
            onChange={e => setForm({ ...form, age: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Medical Condition / Diagnosis:</label>
          <input
            required
            placeholder="e.g. Hypertension, Viral Fever"
            value={form.condition}
            onChange={e => setForm({ ...form, condition: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Admission Status:</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option>Admitted</option>
            <option>Discharged</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button type="submit" className="btn btn-primary">Save Patient</button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const loadPatients = async () => {
    const res = await fetch('/api/patients');
    setPatients(await res.json());
  };

  useEffect(() => { loadPatients(); }, []);

  const handleAdd = async (formData) => {
    await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    loadPatients();
  };

  const handleToggleStatus = async (patient) => {
    const nextStatus = patient.status === 'Admitted' ? 'Discharged' : 'Admitted';
    await fetch(`/api/patients/${patient._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });
    loadPatients();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient record?')) return;
    await fetch(`/api/patients/${id}`, { method: 'DELETE' });
    loadPatients();
  };

  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>Patient Management System (Roll Q9)</h1>
          <nav className="nav">
            <Link to="/" className="nav-link">Patient Records</Link>
            <Link to="/admit" className="nav-link">Admit Patient</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <PatientListView
                  patients={patients}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                  filter={filter}
                  setFilter={setFilter}
                  search={search}
                  setSearch={setSearch}
                />
              }
            />
            <Route
              path="/admit"
              element={<AddPatientView onAdd={handleAdd} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
