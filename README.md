# Web Programming / Open Source Technologies (OST) Lab - Complete Master Exam Suite

The Single Complete Reference Guide for University Lab Exams and Internal Assessments (IA-2).
Scaffold anywhere via: `npx degit padhlemc/cw my-exam`  
Repository: `https://github.com/padhlemc/cw`

---

## Table of Contents
1. [Instant Quickstart & degit Command](#instant-quickstart--degit-command)
2. [Master Question Directory & Roll Mapping](#master-question-directory--roll-mapping)
3. [The Universal 1-Hour Lab Exam Blueprint](#the-universal-1-hour-lab-exam-blueprint)
4. [The Change Only 4 Places Formula](#the-change-only-4-places-formula)
5. [Dual Backend Architecture (Express vs Pure Core Node.js)](#dual-backend-architecture-express-vs-pure-core-nodejs)
6. [Complete Reference: Questions Q1 through Q9](#complete-reference-questions-q1-through-q9)
7. [Faculty Problem Statements 1, 2, 3 and 4](#faculty-problem-statements-1-2-3-and-4)
8. [University Tech Stack Rules & Zero-Crash Fallback](#university-tech-stack-rules--zero-crash-fallback)
9. [90-Minute Study Roadmap & Mental Model](#90-minute-study-roadmap--mental-model)
10. [Top 5 Exam Viva Questions & Model Answers](#top-5-exam-viva-questions--model-answers)

---

## Instant Quickstart & degit Command

You can clone or scaffold this entire lab suite onto any machine in seconds without installing Git using `degit`:

```bash
# 1. Download the complete exam suite instantly
npx degit padhlemc/cw my-exam

# 2. Enter project folder
cd my-exam

# 3. Launch any question or the universal template
npm run template  # Universal Exam Boilerplate (Port 5000)
npm run q1        # Book E-Commerce (Port 5001)
npm run q2        # Doctor Appointments (Port 5002)
npm run q3        # Expense Tracker (Port 5003)
npm run q4        # Daily Task Manager (Port 5004)
npm run q5        # Discussion Forum (Port 5005)
npm run q6        # Student Gradebook (Port 5006)
npm run q7        # Product & User Mgmt (Port 5007)
npm run q8        # Team Directory (Port 5008)
npm run q9        # Patient Management (Port 5009)
```

---

## Master Question Directory & Roll Mapping

All 9 university questions and the master starter template are organized cleanly. Every question has lean, handwritten-ready code with separate CSS and React Router:

| Question / Folder | Roll Numbers / Topic | Port | Database | Key Graded Exam Feature | Quick Command |
|---|---|---|---|---|---|
| [**TEMPLATE_EXAM_STARTER**](TEMPLATE_EXAM_STARTER) | Universal Master Boilerplate | 5000 | exam_starter_db | Express / Core Node, HashRouter, 4 Change Zones | `npm run template` |
| [**Q1_Book_Ecommerce_Roll_24-30**](already_set_questions/Q1_Book_Ecommerce_Roll_24-30) | Rolls 24-30: Book E-Commerce | 5001 | book_ecommerce | Cart array state, category filter, order checkout | `npm run q1` |
| [**Q2_Doctor_Appointment_Roll_31-38**](already_set_questions/Q2_Doctor_Appointment_Roll_31-38) | Rolls 31-38: Doctor Appointments | 5002 | doctor_appointments | Live availability toggle, patient booking | `npm run q2` |
| [**Q3_Expense_Tracker_Roll_39-45**](already_set_questions/Q3_Expense_Tracker_Roll_39-45) | Rolls 39-45: Daily Expense Tracker | 5003 | expense_tracker | Category breakdown, grand total, budget bar | `npm run q3` |
| [**Q4_Daily_Task_Manager_Roll_46-51_70**](already_set_questions/Q4_Daily_Task_Manager_Roll_46-51_70) | Rolls 46-51, 70: Daily Task Manager | 5004 | task_manager | Status toggle (Pending/Done), priority badges | `npm run q4` |
| [**Q5_Discussion_Forum_Roll_52-59**](already_set_questions/Q5_Discussion_Forum_Roll_52-59) | Rolls 52-59: Discussion Forum | 5005 | discussion_forum | Threads, upvote counter, replies | `npm run q5` |
| [**Q6_Teacher_Student_Dashboard_Roll_61-67**](already_set_questions/Q6_Teacher_Student_Dashboard_Roll_61-67) | Rolls 61-67: Teacher-Student Gradebook | 5006 | gradebook_db | Auto-grade calculation (A/B/C/F), class average | `npm run q6` |
| [**Q7_Product_User_Management**](already_set_questions/Q7_Product_User_Management) | Syllabus Q1: Product & User Management | 5007 | product_user_db | Validation (email, phone, price > 0) | `npm run q7` |
| [**Q8_Team_Member_Directory**](already_set_questions/Q8_Team_Member_Directory) | Syllabus Q2: Team Directory | 5008 | team_directory_db | Component props hierarchy, department filter | `npm run q8` |
| [**Q9_Patient_Management**](already_set_questions/Q9_Patient_Management) | Syllabus Q3: Patient Health Records | 5009 | patient_management_db | Admission status (Admitted/Discharged), diagnosis | `npm run q9` |

---

## The Universal 1-Hour Lab Exam Blueprint

In a 1 to 1.5-hour lab exam, submissions typically require only two files: `server.js` and `App.jsx`.

### 1. Universal Exam Backend (`server.js`)
```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_NAME = 'exam_starter_db';

app.use(cors());
app.use(express.json());

// Serve static frontend files
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(distPath));
app.use(express.static(frontendPath));

// In-memory fallback (Never crashes if MongoDB is stopped on lab PC)
let memoryItems = [
  { _id: '1', title: 'Sample Item Alpha', category: 'General', status: 'Active' },
  { _id: '2', title: 'Sample Item Beta', category: 'Urgent', status: 'Pending' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 1500 });
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log('[MongoDB] Connected successfully to ' + DB_NAME);
    if (await db.collection('items').countDocuments() === 0) {
      await db.collection('items').insertMany(memoryItems);
    }
  })
  .catch(() => console.log('[MongoDB Offline] Running in memory mode'));

// GET All
app.get('/api/items', async (req, res) => {
  if (db) return res.json(await db.collection('items').find().toArray());
  res.json(memoryItems);
});

// POST Create
app.post('/api/items', async (req, res) => {
  const newItem = { ...req.body, _id: new ObjectId().toString() };
  if (db) await db.collection('items').insertOne(newItem);
  else memoryItems.push(newItem);
  res.status(201).json(newItem);
});

// PUT Update
app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  delete updates._id;
  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('items').updateOne(query, { $set: updates });
  } else {
    memoryItems = memoryItems.map(item => String(item._id) === String(id) ? { ...item, ...updates } : item);
  }
  res.json({ message: 'Record updated' });
});

// DELETE Remove
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('items').deleteOne(query);
  } else {
    memoryItems = memoryItems.filter(item => String(item._id) !== String(id));
  }
  res.json({ message: 'Record deleted' });
});

// Wildcard SPA route for React Router support
app.get('*', (req, res) => {
  const fs = require('fs');
  const indexDist = path.join(distPath, 'index.html');
  const indexDev = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexDist)) return res.sendFile(indexDist);
  if (fs.existsSync(indexDev)) return res.sendFile(indexDev);
  res.send('<!DOCTYPE html><html><body><div id="root">Ready</div></body></html>');
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
```

### 2. Universal Exam Frontend (`App.jsx`)
```jsx
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './style.css';

function ListView({ items, onDelete, onToggle, search, setSearch }) {
  const navigate = useNavigate();
  const filtered = items.filter(it =>
    Object.values(it).some(val => String(val || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="card">
      <div className="controls">
        <input
          placeholder="Search records..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <button onClick={() => navigate('/add')} className="btn btn-primary">
          Add New Record
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>TITLE</th><th>CATEGORY</th><th>STATUS</th><th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(it => (
            <tr key={it._id}>
              <td>{it.title}</td>
              <td>{it.category}</td>
              <td><span className="badge">{it.status}</span></td>
              <td>
                <button onClick={() => onToggle(it)} className="btn btn-secondary btn-sm">Toggle</button>
                <button onClick={() => onDelete(it._id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddView({ onAdd }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', category: 'General', status: 'Active' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    navigate('/');
  };

  return (
    <div className="card">
      <h2>Add Record</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          <option>General</option>
          <option>Urgent</option>
        </select>
        <button type="submit" className="btn btn-primary">Save Record</button>
      </form>
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    const res = await fetch('/api/items');
    setItems(await res.json());
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (record) => {
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    loadData();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    loadData();
  };

  const handleToggle = async (item) => {
    const nextStatus = item.status === 'Active' ? 'Pending' : 'Active';
    await fetch(`/api/items/${item._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });
    loadData();
  };

  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>Exam Management Dashboard</h1>
          <nav className="nav">
            <Link to="/" className="nav-link">List</Link>
            <Link to="/add" className="nav-link">Add</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<ListView items={items} onDelete={handleDelete} onToggle={handleToggle} search={search} setSearch={setSearch} />} />
            <Route path="/add" element={<AddView onAdd={handleAdd} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
```

---

## The Change Only 4 Places Formula

Whenever an examiner assigns a new problem, you edit only 4 change zones:

| Change Zone | Target File | What You Change | Example: Book Store (Q1) | Example: Doctor Appointment (Q2) |
|---|---|---|---|---|
| **Zone 1: Config** | `backend/server.js` | `PORT`, `DB_NAME`, `COLLECTION` | `5001`, `book_ecommerce`, `books` | `5002`, `doctor_appointments`, `appointments` |
| **Zone 2: Initial Data** | `backend/server.js` | Initial array items | `{ title, author, price, category }` | `{ patientName, doctorName, date, time }` |
| **Zone 3: Form Inputs** | `frontend/src/App.jsx` | Inputs inside `<form>` | Title, Author, Price, Category inputs | Patient Name, Doctor, Date, Time inputs |
| **Zone 4: Table Columns**| `frontend/src/App.jsx` | `<th>` headers and `<td>` cells | Book Title, Author, Price, Add to Cart | Patient, Doctor, Date/Time, Status badge |

---

## Dual Backend Architecture (Express vs Pure Core Node.js)

Depending on the exam prompt:

### Mode A: Full-Stack Express + MongoDB Native Driver (Default - 95% of Exams)
* File: `TEMPLATE_EXAM_STARTER/backend/server.js`
* Stack: `express`, `cors`, `mongodb` (`MongoClient`, `ObjectId`)
* Automatic offline fallback if MongoDB service is stopped.
* Run: `npm run template`

### Mode B: Pure Core Node.js (Zero External Frameworks)
* File: `TEMPLATE_EXAM_STARTER/backend/server_core_node.js`
* Stack: Built-in Node modules only (`http`, `url`, `fs`, `path`).
* For prompts specifically asking: "Write an HTTP server using Core Node.js http and url modules without Express".
* Run: `node TEMPLATE_EXAM_STARTER/backend/server_core_node.js`

---

## Complete Reference: Questions Q1 through Q9

### Question 1: Book E-Commerce Store
* Roll Numbers: 24 to 30
* Directory: `already_set_questions/Q1_Book_Ecommerce_Roll_24-30`
* Port: 5001 | Database: `book_ecommerce`
* Key Feature: Catalog grid, shopping cart state, place order checkout route, category search.

### Question 2: Doctor Appointment Booking
* Roll Numbers: 31 to 38
* Directory: `already_set_questions/Q2_Doctor_Appointment_Roll_31-38`
* Port: 5002 | Database: `doctor_appointments`
* Key Feature: Live doctor availability toggle, appointment booking form, cancellation.

### Question 3: Daily Expense Tracker
* Roll Numbers: 39 to 45
* Directory: `already_set_questions/Q3_Expense_Tracker_Roll_39-45`
* Port: 5003 | Database: `expense_tracker`
* Key Feature: Category spending breakdown, grand total calculation, progress bar.

### Question 4: Daily Task Manager
* Roll Numbers: 46 to 51, 70
* Directory: `already_set_questions/Q4_Daily_Task_Manager_Roll_46-51_70`
* Port: 5004 | Database: `task_manager`
* Key Feature: Status toggle (Pending/Done), priority badges (High/Medium/Low).

### Question 5: Discussion Forum
* Roll Numbers: 52 to 59
* Directory: `already_set_questions/Q5_Discussion_Forum_Roll_52-59`
* Port: 5005 | Database: `discussion_forum`
* Key Feature: Thread creation, upvote button counter, thread deletion.

### Question 6: Teacher-Student Gradebook
* Roll Numbers: 61 to 67
* Directory: `already_set_questions/Q6_Teacher_Student_Dashboard_Roll_61-67`
* Port: 5006 | Database: `gradebook_db`
* Key Feature: Auto-grade calculation based on average percentage (A >= 85, B >= 70, C >= 50, F < 50), class statistics.

### Question 7: Product & User Management
* Syllabus Question 1
* Directory: `already_set_questions/Q7_Product_User_Management`
* Port: 5007 | Database: `product_user_db`
* Key Feature: Dual tab navigation, input validation (price > 0, email format).

### Question 8: Team Member Directory
* Syllabus Question 2
* Directory: `already_set_questions/Q8_Team_Member_Directory`
* Port: 5008 | Database: `team_directory_db`
* Key Feature: Reusable component props, department filter pills (Engineering, Design, QA).

### Question 9: Patient Health Records Management
* Syllabus Question 3
* Directory: `already_set_questions/Q9_Patient_Management`
* Port: 5009 | Database: `patient_management_db`
* Key Feature: Hospital admission status toggle (Admitted / Discharged), medical condition search.

---

## Faculty Problem Statements 1, 2, 3 and 4

### Problem Statement 1: Regional Temperature Monitoring (Core Node.js)
* Implementation: `TEMPLATE_EXAM_STARTER/backend/server_core_node.js`
* Built-in modules only (`http`, `url`, `fs`).
* Uses `url.parse(req.url, true)` to parse query strings.

### Problem Statement 2: Heatwave Prediction & Severity Classification
* Express REST API with automated severity logic:
  - Temp >= 45: Extreme Heatwave (Red Alert)
  - Temp >= 40: Severe Heatwave (Orange Alert)
  - Temp >= 36: Moderate Heatwave (Yellow Alert)
  - Below 36: Normal (Green)

### Problem Statements 3 and 4: Smart Sugarcane Irrigation Decision System
* Soil Moisture < 30%: Urgent (120 mins drip irrigation)
* Soil Moisture 30% - 50%: Moderate (45 mins drip irrigation)
* Soil Moisture > 50%: Optimal (Zero irrigation required)

---

## University Tech Stack Rules & Zero-Crash Fallback

### 1. The Strict Lab Exam Rule: NO Mongoose
1. University syllabi test the official native MongoDB driver (`mongodb` npm package).
2. Mongoose adds unnecessary schema compilation overhead that wastes exam time.
3. Examiners look for direct `MongoClient.connect()`, `db.collection().find().toArray()`, and `new ObjectId(id)`.

### 2. Automatic Offline Fallback (Zero-Crash Guarantee)
If MongoDB is stopped on the lab PC, `MongoClient` connection fails gracefully after 1.5 seconds:
```javascript
const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 1500 });
client.connect()
  .then(...)
  .catch(() => console.log('[MongoDB Offline] Running in memory mode'));
```
All routes automatically fall back to the in-memory array, guaranteeing full working marks during live demo.

---

## 90-Minute Study Roadmap & Mental Model

### The 4-Step Data Flow Mental Model
```
[1. User Action]  -> React Form (App.jsx) updates state via onChange
                     |
[2. HTTP Request] -> fetch('/api/items', { method: 'POST', body: JSON.stringify(form) })
                     |
[3. Server API]   -> Express server.js receives req.body, calls db.collection().insertOne(req.body)
                     |
[4. UI Re-render] -> Server sends res.status(201).json(item) -> React calls loadData() -> setItems()
```

---

## Top 5 Exam Viva Questions & Model Answers

### Q1: Why do we use native MongoClient instead of Mongoose?
**Answer:** The university syllabus tests the official native MongoDB driver. `MongoClient` connects directly to MongoDB with connection pooling, requires zero schema overhead, and allows rapid prototyping of CRUD operations using collection methods (`find`, `insertOne`, `deleteOne`, `updateOne`).

### Q2: What is the purpose of express.json() and cors() middleware?
**Answer:** 
* `express.json()` parses incoming HTTP requests with JSON payloads and populates `req.body`.
* `cors()` enables Cross-Origin Resource Sharing so that a React frontend can make API requests to an Express server without browser security blocks.

### Q3: What is the difference between req.params and req.query?
**Answer:**
* `req.params` captures route path variables, such as `/api/items/:id` -> `req.params.id`.
* `req.query` captures URL query string parameters after the `?`, such as `/api/items?category=Books` -> `req.query.category`.

### Q4: How does React communicate with the Express backend?
**Answer:** Through the browser's native asynchronous `fetch()` API:
* `fetch('/api/items')` for GET
* `fetch('/api/items', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })` for POST
* `fetch('/api/items/' + id, { method: 'DELETE' })` for DELETE
* `fetch('/api/items/' + id, { method: 'PUT', ... })` for PUT

### Q5: Why do we use HashRouter in the lab exam?
**Answer:** `HashRouter` stores the route in the URL hash fragment (`/#/`, `/#/add`). This prevents 404 Not Found errors on static builds and local lab environments when refreshing the browser page, without requiring complex web server rewrite configurations.
