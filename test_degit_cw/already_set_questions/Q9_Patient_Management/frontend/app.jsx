import React, { useState, useEffect } from 'react';

export default function App() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', gender: 'Male', condition: '', status: 'Admitted' });

  const loadPatients = async () => {
    const res = await fetch('/api/patients');
    setPatients(await res.json());
  };

  useEffect(() => { loadPatients(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ name: '', age: '', gender: 'Male', condition: '', status: 'Admitted' });
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
    await fetch(`/api/patients/${id}`, { method: 'DELETE' });
    loadPatients();
  };

  return (
    <div style={{ maxWidth: 850, margin: '20px auto', fontFamily: 'sans-serif', padding: 15 }}>
      <h2>🏥 Patient Record Management System (Roll Q3)</h2>

      {/* Form */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, background: '#f8fafc', padding: 15, borderRadius: 6, border: '1px solid #e2e8f0' }}>
        <input placeholder="Patient Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ padding: 8, flex: 2 }} />
        <input placeholder="Age" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required style={{ padding: 8, width: 80 }} />
        <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={{ padding: 8 }}>
          <option>Male</option><option>Female</option><option>Other</option>
        </select>
        <input placeholder="Medical Condition" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} required style={{ padding: 8, flex: 2 }} />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ padding: 8 }}>
          <option>Admitted</option><option>Discharged</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Add Patient
        </button>
      </form>

      {/* Table */}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th>Name</th><th>Age</th><th>Gender</th><th>Condition</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td><td>{p.condition}</td>
              <td>
                <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 12, fontWeight: 'bold', background: p.status === 'Admitted' ? '#fee2e2' : '#dcfce7', color: p.status === 'Admitted' ? '#991b1b' : '#166534' }}>
                  {p.status}
                </span>
              </td>
              <td>
                <button onClick={() => handleToggleStatus(p)} style={{ marginRight: 6, padding: '3px 8px', cursor: 'pointer' }}>
                  Toggle Status
                </button>
                <button onClick={() => handleDelete(p._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: 4, cursor: 'pointer' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {patients.length === 0 && (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No patient records found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
