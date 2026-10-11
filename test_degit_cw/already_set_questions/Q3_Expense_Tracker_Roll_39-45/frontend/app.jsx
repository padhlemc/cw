import React, { useState, useEffect } from 'react';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });

  const loadExpenses = async () => {
    const res = await fetch('/api/expenses');
    setExpenses(await res.json());
  };

  useEffect(() => { loadExpenses(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
    loadExpenses();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    loadExpenses();
  };

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const categories = ['Food', 'Transport', 'Entertainment', 'Bills'];

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'sans-serif', padding: 15 }}>
      <h2>💰 Daily Expense Tracker (Roll 39-45)</h2>

      {/* Summary KPI Card */}
      <div style={{ display: 'flex', gap: 15, marginBottom: 20 }}>
        <div style={{ flex: 1, padding: 15, background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 5px', color: '#1e40af' }}>Total Monthly Spent</h4>
          <h2 style={{ margin: 0, color: '#1d4ed8' }}>₹{totalSpent}</h2>
        </div>
        <div style={{ flex: 2, padding: 15, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 8px' }}>Category Breakdown</h4>
          {categories.map(cat => {
            const catTotal = expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0);
            const pct = totalSpent > 0 ? Math.round((catTotal / totalSpent) * 100) : 0;
            return (
              <div key={cat} style={{ marginBottom: 6, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span>{cat}: ₹{catTotal}</span><span>{pct}%</span>
                </div>
                <div style={{ background: '#e2e8f0', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ background: '#3b82f6', width: `${pct}%`, height: '100%' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Expense Form */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <input placeholder="Expense Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={{ flex: 2, padding: 8 }} />
        <input placeholder="Amount (₹)" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required style={{ flex: 1, padding: 8 }} />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ padding: 8 }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={{ padding: 8 }} />
        <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Add Expense
        </button>
      </form>

      {/* Expense History Table */}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th>Date</th><th>Title</th><th>Category</th><th>Amount</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(e => (
            <tr key={e._id}>
              <td>{e.date}</td><td>{e.title}</td><td>{e.category}</td><td>₹{e.amount}</td>
              <td>
                <button onClick={() => handleDelete(e._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {expenses.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No expenses recorded yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
