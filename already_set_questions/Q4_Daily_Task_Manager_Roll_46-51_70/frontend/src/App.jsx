import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './style.css';

function TaskListView({ tasks, onDelete, onToggle, filter, setFilter }) {
  const navigate = useNavigate();
  const filtered = tasks.filter(t => filter === 'All' || t.status === filter);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['All', 'Pending', 'Completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => navigate('/add')} className="btn btn-primary">
          Add New Task
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>TASK</th><th>PRIORITY</th><th>STATUS</th><th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t._id}>
              <td style={{ textDecoration: t.status === 'Completed' ? 'line-through' : 'none', color: t.status === 'Completed' ? '#888' : '#000' }}>
                {t.title}
              </td>
              <td>
                <span className={`badge ${t.priority === 'High' ? 'badge-warn' : 'badge-good'}`}>
                  {t.priority}
                </span>
              </td>
              <td>
                <span className={`badge ${t.status === 'Completed' ? 'badge-good' : 'badge-warn'}`}>
                  {t.status}
                </span>
              </td>
              <td>
                <button onClick={() => onToggle(t)} className="btn btn-secondary btn-sm">
                  {t.status === 'Completed' ? 'Mark Pending' : 'Mark Done'}
                </button>
                <button onClick={() => onDelete(t._id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="4" style={{ textAlign: 'center', padding: 20 }}>No tasks found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function AddTaskView({ onAdd }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', priority: 'Medium', status: 'Pending' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    navigate('/');
  };

  return (
    <div className="card">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Task Title:</label>
          <input
            required
            placeholder="Enter task title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Priority:</label>
          <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button type="submit" className="btn btn-primary">Save Task</button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  const loadTasks = async () => {
    const res = await fetch('/api/tasks');
    setTasks(await res.json());
  };

  useEffect(() => { loadTasks(); }, []);

  const handleAdd = async (formData) => {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    loadTasks();
  };

  const handleToggle = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    await fetch(`/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });
    loadTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
  };

  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>Daily Task Manager (Roll 46-51, 70)</h1>
          <nav className="nav">
            <Link to="/" className="nav-link">Task List</Link>
            <Link to="/add" className="nav-link">Add Task</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <TaskListView
                  tasks={tasks}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  filter={filter}
                  setFilter={setFilter}
                />
              }
            />
            <Route
              path="/add"
              element={<AddTaskView onAdd={handleAdd} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
