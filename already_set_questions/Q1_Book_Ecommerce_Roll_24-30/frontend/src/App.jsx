import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import './style.css';

function CatalogView({ books, cart, onAddToCart, onPlaceOrder, search, setSearch }) {
  const filtered = books.filter(b => (b.title || '').toLowerCase().includes(search.toLowerCase()));
  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return (
    <div>
      <h3>Book Catalog</h3>
      <div className="controls">
        <input
          placeholder="Search books..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {filtered.map(book => (
          <div key={book._id} className="card">
            <h4>{book.title}</h4>
            <p style={{ color: '#666', fontSize: 13, margin: '4px 0' }}>By {book.author}</p>
            <p style={{ fontWeight: 'bold', margin: '4px 0 8px' }}>INR {book.price}</p>
            <button onClick={() => onAddToCart(book)} className="btn btn-primary btn-sm">
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, padding: 15, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6 }}>
        <h4>Shopping Cart ({cart.length} items)</h4>
        {cart.length === 0 ? <p className="empty">Cart is empty.</p> : (
          <div>
            <ul>
              {cart.map((item, idx) => (
                <li key={idx} style={{ margin: '4px 0' }}>{item.title} - INR {item.price}</li>
              ))}
            </ul>
            <p style={{ margin: '8px 0' }}><strong>Total: INR {cartTotal}</strong></p>
            <button onClick={onPlaceOrder} className="btn btn-primary btn-sm">
              Checkout & Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminView({ books, onAddBook, onDeleteBook }) {
  const [form, setForm] = useState({ title: '', author: '', price: '', category: 'Tech' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddBook(form);
    setForm({ title: '', author: '', price: '', category: 'Tech' });
  };

  return (
    <div className="card">
      <h3>Admin: Manage Inventory</h3>
      <form onSubmit={handleSubmit} className="form" style={{ maxWidth: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
        <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required style={{ width: 100 }} />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          <option>Tech</option>
          <option>Self-Help</option>
          <option>Fiction</option>
        </select>
        <button type="submit" className="btn btn-primary">Add Book</button>
      </form>

      <table className="table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>TITLE</th><th>AUTHOR</th><th>PRICE</th><th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b._id}>
              <td>{b.title}</td><td>{b.author}</td><td>INR {b.price}</td>
              <td>
                <button onClick={() => onDeleteBook(b._id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

  const loadBooks = async () => {
    const res = await fetch('/api/books');
    setBooks(await res.json());
  };

  useEffect(() => { loadBooks(); }, []);

  const handleAddBook = async (bookData) => {
    await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
    loadBooks();
  };

  const handleDeleteBook = async (id) => {
    await fetch(`/api/books/${id}`, { method: 'DELETE' });
    loadBooks();
  };

  const handlePlaceOrder = async () => {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, total: cart.reduce((s, b) => s + Number(b.price || 0), 0) })
    });
    alert('Order placed successfully!');
    setCart([]);
  };

  return (
    <HashRouter>
      <div className="container">
        <header className="header">
          <h1>ReadHub Book Store (Roll 24-30)</h1>
          <nav className="nav">
            <Link to="/" className="nav-link">Catalog & Cart</Link>
            <Link to="/admin" className="nav-link">Admin Panel</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={
            <CatalogView
              books={books}
              cart={cart}
              onAddToCart={b => setCart([...cart, b])}
              onPlaceOrder={handlePlaceOrder}
              search={search}
              setSearch={setSearch}
            />
          } />
          <Route path="/admin" element={
            <AdminView
              books={books}
              onAddBook={handleAddBook}
              onDeleteBook={handleDeleteBook}
            />
          } />
        </Routes>
      </div>
    </HashRouter>
  );
}
