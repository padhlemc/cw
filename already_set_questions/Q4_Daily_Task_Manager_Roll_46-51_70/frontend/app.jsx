import React, { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', priority: 'Medium' });
  const [filter, setFilter] = useState('All');

  const loadTasks = async () => {
    const res = await fetch('/api/tasks');
    setTasks(await res.json());
  };

  useEffect(() => { loadTasks(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ title: '', priority: 'Medium' });
    loadTasks();
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : (task.status === 'Pending' ? 'In Progress' : 'Completed');
    await fetch(`/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });
    loadTasks();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
  };

  const filtered = tasks.filter(t => filter === 'All' || t.status === filter);

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'sans-serif', padding: 15 }}>
      <h2>📝 Daily Task Manager (Roll 46-51, 70)</h2>

      {/* Form */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input placeholder="New task title..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={{ flex: 1, padding: 8 }} />
        <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ padding: 8 }}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Add Task
        </button>
      </form>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
        {['All', 'Pending', 'In Progress', 'Completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ padding: '6px 12px', background: filter === f ? '#2563eb' : '#f1f5f9', color: filter === f ? '#fff' : '#000', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer' }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task Table */}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th>Task</th><th>Priority</th><th>Status (Click to toggle)</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t._id}>
              <td style={{ textDecoration: t.status === 'Completed' ? 'line-through' : 'none' }}>{t.title}</td>
              <td>
                <span style={{ padding: '2px 6px', borderRadius: 4, background: t.priority === 'High' ? '#fee2e2' : '#fef3c7', color: t.priority === 'High' ? '#991b1b' : '#92400e', fontSize: 12 }}>
                  {t.priority}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleToggleStatus(t)}
                  style={{ padding: '4px 8px', borderRadius: 4, border: 'none', cursor: 'pointer', background: t.status === 'Completed' ? '#dcfce7' : '#e0e7ff', color: t.status === 'Completed' ? '#166534' : '#3730a3' }}
                >
                  {t.status} 🔄
                </button>
              </td>
              <td>
                <button onClick={() => handleDelete(t._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No tasks found in this view.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
