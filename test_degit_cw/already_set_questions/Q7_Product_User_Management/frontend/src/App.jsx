import React, { useState, useEffect } from 'react';

export default function App() {
  const [tab, setTab] = useState('products'); // 'products' or 'users'
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // Forms
  const [prodForm, setProdForm] = useState({ name: '', price: '', stock: '', category: 'Electronics' });
  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '' });

  const loadData = async () => {
    const pRes = await fetch('/api/products');
    setProducts(await pRes.json());
    const uRes = await fetch('/api/users');
    setUsers(await uRes.json());
  };

  useEffect(() => { loadData(); }, []);

  // Product Submit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (Number(prodForm.price) <= 0 || Number(prodForm.stock) < 0) {
      alert('Price must be > 0 and stock >= 0');
      return;
    }
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prodForm)
    });
    setProdForm({ name: '', price: '', stock: '', category: 'Electronics' });
    loadData();
  };

  // User Submit
  const handleAddUser = async (e) => {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email);
    const phoneOk = /^\d{10}$/.test(userForm.phone);
    if (!emailOk) { alert('Please enter a valid email address.'); return; }
    if (!phoneOk) { alert('Please enter a 10-digit phone number.'); return; }

    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm)
    });
    setUserForm({ name: '', email: '', phone: '' });
    loadData();
  };

  const handleDeleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    loadData();
  };

  const handleDeleteUser = async (id) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    loadData();
  };

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'sans-serif', padding: 15 }}>
      <h2>📦 Product & User Management System (Regex Validated)</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab('products')} style={{ padding: '8px 16px', background: tab === 'products' ? '#2563eb' : '#e2e8f0', color: tab === 'products' ? '#fff' : '#000', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          📦 Products ({products.length})
        </button>
        <button onClick={() => setTab('users')} style={{ padding: '8px 16px', background: tab === 'users' ? '#2563eb' : '#e2e8f0', color: tab === 'users' ? '#fff' : '#000', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          👥 Users ({users.length})
        </button>
      </div>

      {/* 1. Products Tab */}
      {tab === 'products' && (
        <div>
          <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <input placeholder="Product Name" value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} required style={{ padding: 8 }} />
            <input placeholder="Price (₹ > 0)" type="number" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} required style={{ padding: 8, width: 110 }} />
            <input placeholder="Stock (>= 0)" type="number" value={prodForm.stock} onChange={e => setProdForm({ ...prodForm, stock: e.target.value })} required style={{ padding: 8, width: 110 }} />
            <select value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} style={{ padding: 8 }}>
              <option>Electronics</option><option>Accessories</option><option>Stationery</option>
            </select>
            <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Add Product</button>
          </form>

          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead><tr style={{ background: '#f1f5f9' }}><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td><td>{p.category}</td><td>₹{p.price}</td><td>{p.stock}</td>
                  <td><button onClick={() => handleDeleteProduct(p._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Users Tab */}
      {tab === 'users' && (
        <div>
          <form onSubmit={handleAddUser} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <input placeholder="Full Name" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required style={{ padding: 8 }} />
            <input placeholder="Email (abc@xyz.com)" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required style={{ padding: 8 }} />
            <input placeholder="10-digit Phone" value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })} required style={{ padding: 8, width: 120 }} />
            <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Add User</button>
          </form>

          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead><tr style={{ background: '#f1f5f9' }}><th>Name</th><th>Email</th><th>Phone</th><th>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td>
                  <td><button onClick={() => handleDeleteUser(u._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
