import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './style.css';

function GradebookListView({ students, onDelete, avgMarks }) {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', gap: 15, marginBottom: 20 }}>
        <div className="card" style={{ flex: 1 }}>
          <h4 style={{ color: '#1e40af', marginBottom: 4 }}>Total Students</h4>
          <h2 style={{ color: '#1d4ed8' }}>{students.length}</h2>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h4 style={{ color: '#166534', marginBottom: 4 }}>Class Average</h4>
          <h2 style={{ color: '#15803d' }}>{avgMarks}%</h2>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>Student Performance Records</h3>
          <button onClick={() => navigate('/add')} className="btn btn-primary">
            Add New Student
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>STUDENT NAME</th><th>ROLL NO</th><th>SUBJECT</th><th>MARKS</th><th>GRADE</th><th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td><strong>{s.name}</strong></td>
                <td>{s.roll}</td>
                <td>{s.subject}</td>
                <td>{s.marks}/100</td>
                <td>
                  <span className={`badge ${s.grade === 'A' ? 'badge-good' : 'badge-warn'}`}>
                    Grade {s.grade}
                  </span>
                </td>
                <td>
                  <button onClick={() => onDelete(s._id)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 20 }}>No student records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddStudentView({ onAdd }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', roll: '', subject: 'Web Dev', marks: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    navigate('/');
  };

  return (
    <div className="card">
      <h2>Add Student Record</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Student Full Name:</label>
          <input
            required
            placeholder="Enter student name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Roll Number:</label>
          <input
            required
            placeholder="e.g. 64"
            value={form.roll}
            onChange={e => setForm({ ...form, roll: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Subject:</label>
          <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
            <option>Web Dev</option>
            <option>Database</option>
            <option>Operating Systems</option>
          </select>
        </div>

        <div className="form-group">
          <label>Marks (0-100):</label>
          <input
            type="number"
            min="0"
            max="100"
            required
            placeholder="e.g. 88"
            value={form.marks}
            onChange={e => setForm({ ...form, marks: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button type="submit" className="btn btn-primary">Save Student</button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [students, setStudents] = useState([]);

  const loadStudents = async () => {
    const res = await fetch('/api/students');
    setStudents(await res.json());
  };

  useEffect(() => { loadStudents(); }, []);

  const handleAdd = async (formData) => {
    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    loadStudents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student record?')) return;
    await fetch(`/api/students/${id}`, { method: 'DELETE' });
    loadStudents();
  };

  const avgMarks = students.length > 0
    ? (students.reduce((s, st) => s + Number(st.marks || 0), 0) / students.length).toFixed(1)
    : '0';

  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>Student Gradebook System (Roll 61-67)</h1>
          <nav className="nav">
            <Link to="/" className="nav-link">Gradebook</Link>
            <Link to="/add" className="nav-link">Add Student</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <GradebookListView
                  students={students}
                  onDelete={handleDelete}
                  avgMarks={avgMarks}
                />
              }
            />
            <Route
              path="/add"
              element={<AddStudentView onAdd={handleAdd} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
