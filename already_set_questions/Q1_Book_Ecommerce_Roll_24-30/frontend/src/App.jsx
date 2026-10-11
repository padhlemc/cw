import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';

function CatalogView({ books, cart, onAddToCart, onPlaceOrder, search, setSearch }) {
  const filtered = books.filter(b => (b.title || '').toLowerCase().includes(search.toLowerCase()));
  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div>
      <h3>Book Catalog</h3>
      <input
        placeholder="Search books..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', boxSizing: 'border-box', padding: 8, marginBottom: 15 }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {filtered.map(book => (
          <div key={book._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, background: '#fff' }}>
            <h4 style={{ margin: '0 0 6px' }}>{book.title}</h4>
            <p style={{ margin: '0 0 4px', color: '#666', fontSize: 13 }}>By {book.author}</p>
            <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>₹{book.price}</p>
            <button
              onClick={() => onAddToCart(book)}
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 25, padding: 15, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6 }}>
        <h4>Shopping Cart ({cart.length} items)</h4>
        {cart.length === 0 ? <p>Cart is empty.</p> : (
          <div>
            <ul>
              {cart.map((item, idx) => (
                <li key={idx}>{item.title} - ₹{item.price}</li>
              ))}
            </ul>
            <p><strong>Total: ₹{cartTotal}</strong></p>
            <button
              onClick={onPlaceOrder}
              style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
            >
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
    <div>
      <h3>Admin: Manage Inventory</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={{ padding: 8 }} />
        <input placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required style={{ padding: 8 }} />
        <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required style={{ padding: 8, width: 90 }} />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ padding: 8 }}>
          <option>Tech</option>
          <option>Self-Help</option>
          <option>Fiction</option>
        </select>
        <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Add Book
        </button>
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th>Title</th><th>Author</th><th>Price</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b._id}>
              <td>{b.title}</td><td>{b.author}</td><td>₹{b.price}</td>
              <td>
                <button onClick={() => onDeleteBook(b._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>
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
    const data = await res.json();
    setBooks(Array.isArray(data) ? data : []);
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
      body: JSON.stringify({ items: cart, total: cart.reduce((s, b) => s + Number(b.price), 0) })
    });
    alert('Order placed successfully!');
    setCart([]);
  };

  return (
    <HashRouter>
      <div style={{ maxWidth: 850, margin: '20px auto', fontFamily: 'sans-serif', padding: 15 }}>
        <h2>📚 ReadHub Book Store (Roll 24-30)</h2>
        <nav style={{ display: 'flex', gap: 15, marginBottom: 20, borderBottom: '1px solid #ddd', paddingBottom: 10 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 'bold' }}>Catalog & Cart</Link>
          <Link to="/admin" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 'bold' }}>Admin Panel</Link>
        </nav>

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
