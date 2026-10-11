import React, { useState, useEffect } from 'react';

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', rollNo: '', math: '', science: '', english: '' });
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadStudents = async () => {
    const res = await fetch('/api/students');
    setStudents(await res.json());
  };

  useEffect(() => { loadStudents(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ name: '', rollNo: '', math: '', science: '', english: '' });
    loadStudents();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/students/${id}`, { method: 'DELETE' });
    loadStudents();
  };

  // Class Stats
  const avgPct = students.length > 0 ? (students.reduce((s, st) => s + Number(st.percentage), 0) / students.length).toFixed(1) : 0;
  const topPct = students.length > 0 ? Math.max(...students.map(s => Number(s.percentage))) : 0;

  return (
    <div style={{ maxWidth: 850, margin: '20px auto', fontFamily: 'sans-serif', padding: 15 }}>
      <h2>🎓 Student Gradebook & Dashboard (Roll 61-67)</h2>

      {/* Class Statistics */}
      <div style={{ display: 'flex', gap: 15, marginBottom: 20 }}>
        <div style={{ flex: 1, padding: 12, background: '#eff6ff', borderRadius: 6, border: '1px solid #bfdbfe' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#1e40af' }}>Total Students</p>
          <h3 style={{ margin: '4px 0 0', color: '#1d4ed8' }}>{students.length}</h3>
        </div>
        <div style={{ flex: 1, padding: 12, background: '#f0fdf4', borderRadius: 6, border: '1px solid #bbf7d0' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#166534' }}>Class Average</p>
          <h3 style={{ margin: '4px 0 0', color: '#15803d' }}>{avgPct}%</h3>
        </div>
        <div style={{ flex: 1, padding: 12, background: '#fefce8', borderRadius: 6, border: '1px solid #fef08a' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#854d0e' }}>Highest Score</p>
          <h3 style={{ margin: '4px 0 0', color: '#a16207' }}>{topPct}%</h3>
        </div>
      </div>

      {/* Add Marks Form */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, background: '#f8fafc', padding: 15, borderRadius: 6, border: '1px solid #e2e8f0' }}>
        <input placeholder="Student Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ padding: 8, flex: 2 }} />
        <input placeholder="Roll No" value={form.rollNo} onChange={e => setForm({ ...form, rollNo: e.target.value })} required style={{ padding: 8, flex: 1 }} />
        <input placeholder="Math" type="number" value={form.math} onChange={e => setForm({ ...form, math: e.target.value })} required style={{ padding: 8, width: 70 }} />
        <input placeholder="Science" type="number" value={form.science} onChange={e => setForm({ ...form, science: e.target.value })} required style={{ padding: 8, width: 70 }} />
        <input placeholder="English" type="number" value={form.english} onChange={e => setForm({ ...form, english: e.target.value })} required style={{ padding: 8, width: 70 }} />
        <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Save Student
        </button>
      </form>

      {/* Grade Table */}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th>Roll</th><th>Name</th><th>Math</th><th>Science</th><th>English</th><th>Total</th><th>%</th><th>Grade</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td>{s.rollNo}</td><td>{s.name}</td><td>{s.math}</td><td>{s.science}</td><td>{s.english}</td>
              <td><strong>{s.total}</strong></td><td>{s.percentage}%</td>
              <td><span style={{ fontWeight: 'bold', color: s.grade === 'A' ? '#15803d' : (s.grade === 'F' ? '#b91c1c' : '#b45309') }}>{s.grade}</span></td>
              <td>
                <button onClick={() => setSelectedStudent(s)} style={{ marginRight: 6, padding: '3px 8px', cursor: 'pointer' }}>Report</button>
                <button onClick={() => handleDelete(s._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Report Card Modal */}
      {selectedStudent && (
        <div style={{ marginTop: 20, padding: 15, border: '2px solid #2563eb', borderRadius: 6, background: '#fff' }}>
          <h3>📄 Student Report Card</h3>
          <p><strong>Name:</strong> {selectedStudent.name} | <strong>Roll No:</strong> {selectedStudent.rollNo}</p>
          <p>Math: {selectedStudent.math} | Science: {selectedStudent.science} | English: {selectedStudent.english}</p>
          <p><strong>Total:</strong> {selectedStudent.total}/300 ({selectedStudent.percentage}%) - <strong>Grade: {selectedStudent.grade}</strong></p>
          <button onClick={() => setSelectedStudent(null)} style={{ padding: '6px 12px', cursor: 'pointer' }}>Close Report</button>
        </div>
      )}
    </div>
  );
}
