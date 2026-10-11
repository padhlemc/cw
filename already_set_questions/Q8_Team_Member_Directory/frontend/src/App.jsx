import React, { useState, useEffect } from 'react';

// Reusable Component 1: Navbar with Props
function Navbar({ title, count }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: 10, marginBottom: 20 }}>
      <h2 style={{ margin: 0 }}>👥 {title}</h2>
      <span style={{ background: '#2563eb', color: '#fff', padding: '4px 10px', borderRadius: 12, fontSize: 13, fontWeight: 'bold' }}>
        Total: {count}
      </span>
    </header>
  );
}

// Reusable Component 2: TeamCard with Props
function TeamCard({ member, onDelete }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 15, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <h4 style={{ margin: '0 0 4px', color: '#1e293b' }}>{member.name}</h4>
      <p style={{ margin: '0 0 4px', color: '#2563eb', fontSize: 13, fontWeight: 'bold' }}>{member.role}</p>
      <p style={{ margin: '0 0 6px', color: '#64748b', fontSize: 13 }}>📧 {member.email}</p>
      <p style={{ margin: '0 0 10px', fontSize: 12, background: '#f1f5f9', padding: '3px 6px', borderRadius: 4, display: 'inline-block' }}>
        🛠 {member.skills || 'General'}
      </p>
      <div>
        <button
          onClick={() => onDelete(member._id)}
          style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', email: '', skills: '' });

  const loadMembers = async () => {
    const res = await fetch('/api/members');
    setMembers(await res.json());
  };

  useEffect(() => { loadMembers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ name: '', role: '', email: '', skills: '' });
    loadMembers();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/members/${id}`, { method: 'DELETE' });
    loadMembers();
  };

  return (
    <div style={{ maxWidth: 850, margin: '20px auto', fontFamily: 'sans-serif', padding: 15 }}>
      <Navbar title="Team Member Directory (Reusable Components)" count={members.length} />

      {/* Add Form */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 25, background: '#f8fafc', padding: 15, borderRadius: 6, border: '1px solid #e2e8f0' }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ padding: 8, flex: 1 }} />
        <input placeholder="Job Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required style={{ padding: 8, flex: 1 }} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={{ padding: 8, flex: 1 }} />
        <input placeholder="Skills (e.g. React, Node)" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} style={{ padding: 8, flex: 1 }} />
        <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Add Member
        </button>
      </form>

      {/* Grid of Team Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 15 }}>
        {members.map(m => (
          <TeamCard key={m._id} member={m} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
