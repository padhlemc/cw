import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './style.css';

function ExpensesListView({ expenses, onDelete, totalSpent, categories }) {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', gap: 15, marginBottom: 20 }}>
        <div className="card" style={{ flex: 1 }}>
          <h4 style={{ color: '#1e40af', marginBottom: 6 }}>Total Spent</h4>
          <h2 style={{ color: '#1d4ed8' }}>INR {totalSpent}</h2>
        </div>
        <div className="card" style={{ flex: 2 }}>
          <h4 style={{ marginBottom: 10 }}>Category Breakdown</h4>
          {categories.map(cat => {
            const catTotal = expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount || 0), 0);
            const pct = totalSpent > 0 ? Math.round((catTotal / totalSpent) * 100) : 0;
            return (
              <div key={cat} style={{ marginBottom: 6, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span>{cat}: INR {catTotal}</span><span>{pct}%</span>
                </div>
                <div style={{ background: '#e2e8f0', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ background: '#3b82f6', width: `${pct}%`, height: '100%' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>All Expenses ({expenses.length})</h3>
          <button onClick={() => navigate('/add')} className="btn btn-primary">
            Add New Expense
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>TITLE</th><th>CATEGORY</th><th>DATE</th><th>AMOUNT</th><th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp._id}>
                <td>{exp.title}</td><td>{exp.category}</td><td>{exp.date}</td><td>INR {exp.amount}</td>
                <td>
                  <button onClick={() => onDelete(exp._id)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 20 }}>No expenses logged yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddExpenseView({ onAdd }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    navigate('/');
  };

  return (
    <div className="card">
      <h2>Log New Expense</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Expense Title:</label>
          <input
            required
            placeholder="e.g. Groceries"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Amount (INR):</label>
          <input
            type="number"
            required
            placeholder="Amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option>Food</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Bills</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button type="submit" className="btn btn-primary">Save Expense</button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [expenses, setExpenses] = useState([]);

  const loadExpenses = async () => {
    const res = await fetch('/api/expenses');
    setExpenses(await res.json());
  };

  useEffect(() => { loadExpenses(); }, []);

  const handleAdd = async (formData) => {
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    loadExpenses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    loadExpenses();
  };

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const categories = ['Food', 'Transport', 'Entertainment', 'Bills'];

  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>Daily Expense Tracker (Roll 39-45)</h1>
          <nav className="nav">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/add" className="nav-link">Add Expense</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <ExpensesListView
                  expenses={expenses}
                  onDelete={handleDelete}
                  totalSpent={totalSpent}
                  categories={categories}
                />
              }
            />
            <Route
              path="/add"
              element={<AddExpenseView onAdd={handleAdd} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
