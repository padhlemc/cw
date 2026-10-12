import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './style.css';

function MemberListView({ members, onDelete, deptFilter, setDeptFilter }) {
  const navigate = useNavigate();
  const filtered = members.filter(m => deptFilter === 'All' || m.dept === deptFilter);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['All', 'Engineering', 'Design', 'QA'].map(d => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={`btn ${deptFilter === d ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              {d}
            </button>
          ))}
        </div>
        <button onClick={() => navigate('/add')} className="btn btn-primary">
          Add Team Member
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>NAME</th><th>ROLE</th><th>DEPARTMENT</th><th>EMAIL</th><th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(m => (
            <tr key={m._id}>
              <td><strong>{m.name}</strong></td>
              <td>{m.role}</td>
              <td><span className="badge">{m.dept}</span></td>
              <td>{m.email}</td>
              <td>
                <button onClick={() => onDelete(m._id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: 20 }}>No members found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function AddMemberView({ onAdd }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', role: '', dept: 'Engineering', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    navigate('/');
  };

  return (
    <div className="card">
      <h2>Add New Team Member</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Full Name:</label>
          <input
            required
            placeholder="e.g. John Doe"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Role / Position:</label>
          <input
            required
            placeholder="e.g. Frontend Developer"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Department:</label>
          <select value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
            <option>Engineering</option>
            <option>Design</option>
            <option>QA</option>
          </select>
        </div>

        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email"
            required
            placeholder="e.g. john@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button type="submit" className="btn btn-primary">Save Member</button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [members, setMembers] = useState([]);
  const [deptFilter, setDeptFilter] = useState('All');

  const loadMembers = async () => {
    const res = await fetch('/api/members');
    setMembers(await res.json());
  };

  useEffect(() => { loadMembers(); }, []);

  const handleAdd = async (formData) => {
    await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    loadMembers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    await fetch(`/api/members/${id}`, { method: 'DELETE' });
    loadMembers();
  };

  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>Team Directory (Roll Q8)</h1>
          <nav className="nav">
            <Link to="/" className="nav-link">Directory</Link>
            <Link to="/add" className="nav-link">Add Member</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <MemberListView
                  members={members}
                  onDelete={handleDelete}
                  deptFilter={deptFilter}
                  setDeptFilter={setDeptFilter}
                />
              }
            />
            <Route
              path="/add"
              element={<AddMemberView onAdd={handleAdd} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
