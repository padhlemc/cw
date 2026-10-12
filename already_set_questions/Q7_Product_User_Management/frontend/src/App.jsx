import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './style.css';

function ProductListView({ products, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>Product Inventory ({products.length})</h3>
        <button onClick={() => navigate('/add')} className="btn btn-primary">
          Add New Product
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>PRODUCT NAME</th><th>PRICE</th><th>STOCK</th><th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td><strong>{p.name}</strong></td>
              <td>INR {p.price}</td>
              <td>{p.stock} units</td>
              <td>
                <button onClick={() => onDelete(p._id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr><td colSpan="4" style={{ textAlign: 'center', padding: 20 }}>No products found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function AddProductView({ onAdd }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', price: '', stock: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(form.price) <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    onAdd(form);
    navigate('/');
  };

  return (
    <div className="card">
      <h2>Add Product Record</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Product Name:</label>
          <input
            required
            placeholder="e.g. Mechanical Keyboard"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Price (INR):</label>
          <input
            type="number"
            min="1"
            required
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Stock Count:</label>
          <input
            type="number"
            min="0"
            required
            placeholder="Stock units"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button type="submit" className="btn btn-primary">Save Product</button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const res = await fetch('/api/products');
    setProducts(await res.json());
  };

  useEffect(() => { loadProducts(); }, []);

  const handleAdd = async (formData) => {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    loadProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    loadProducts();
  };

  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>Product Management System (Q7)</h1>
          <nav className="nav">
            <Link to="/" className="nav-link">Products</Link>
            <Link to="/add" className="nav-link">Add Product</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <ProductListView
                  products={products}
                  onDelete={handleDelete}
                />
              }
            />
            <Route
              path="/add"
              element={<AddProductView onAdd={handleAdd} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
