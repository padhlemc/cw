# 🎓 The Universal Full-Stack Exam Handbook & Master Guide

> **Master 1 Universal Template, Solve ANY Web Programming / OST Lab Exam Question in 10 Minutes!**  
> Covers **Core Node.js (`http`, `url`, `fs`)**, **Express.js REST APIs**, **MongoDB Native Driver**, and **React 18 Dashboards**.

---

## 💡 The Golden Secret: Every Lab Exam Question is the Same!

Whether your exam asks for:
- 🌡️ **Regional Temperature Monitoring Dashboard** (Region, Temperature, Humidity, Date)
- 🔥 **Heatwave Prediction & Severity Classification** (Region, Max Temp, Severity, Heat Index)
- 🌾 **Sugarcane Smart Irrigation System** (Farmer, Plot ID, Soil Moisture, Crop Stage, Weather, AI Recommendation)
- 📚 **Book E-Commerce Store** (Title, Author, Price, Category, Stock)
- 🩺 **Doctor Appointments** (Patient, Doctor, Date, Time, Status)
- 💰 **Daily Expense Tracker** (Title, Amount, Category, Date)
- 📝 **Daily Task Manager** (Title, Priority, Due Date, Status)
- 💬 **Discussion Forum** (Post Title, Author, Content, Upvotes)
- 🎓 **Student Gradebook** (Student Name, Subject Marks, Grade)
- 📦 **Product Management** (Product Name, Price, Stock, Category)
- 👥 **Team Directory** (Name, Role, Department, Email)
- 🏥 **Patient Health Records** (Name, Age, Disease, Status)

👉 **95% of the codebase is 100% IDENTICAL.**  
Every application is fundamentally a **RESTful CRUD entity management system**:
1. Connects to MongoDB (with automatic local offline JSON fallback so code **never crashes** if the lab computer has MongoDB service issues).
2. Serves standard RESTful endpoints (`GET`, `POST`, `PUT`, `DELETE`).
3. Uses React 18 with reactive state (`useState`, `useEffect`) to render summary metrics, forms, and tables.

---

## ⚡ The "Only Change 4 Places" Formula

When given any exam problem statement, open the starter template in [`TEMPLATE_EXAM_STARTER/`](TEMPLATE_EXAM_STARTER/) and edit **ONLY 4 NUMBERED CHANGE ZONES**:

```
                              ┌────────────────────────────────────────┐
                              │     THE UNIVERSAL EXAM BLUEPRINT       │
                              └───────────────────┬────────────────────┘
                                                  │
            ┌───────────────────┬─────────────────┴───────┬────────────────────┐
            ▼                   ▼                         ▼                    ▼
     [CHANGE ZONE 1]     [CHANGE ZONE 2]           [CHANGE ZONE 3]      [CHANGE ZONE 4]
   Port & Collection       Sample Seed Data         React Form Inputs     Table Display Cols
     (server.js: L24)      (server.js: L41)          (App.jsx: L185)       (App.jsx: L280)
```

| Change Zone | File | What You Change | Example: Heatwave & Temperature | Example: Sugarcane Irrigation |
|---|---|---|---|---|
| **Zone 1: Port & Names** | `backend/server.js` | `PORT`, `DB_NAME`, `COLLECTION_NAME` | `PORT = 5000`<br>`COLLECTION = 'climate_data'` | `PORT = 5000`<br>`COLLECTION = 'irrigation_plots'` |
| **Zone 2: Initial Schema**| `backend/server.js` | 2-3 sample items in `memoryData` | `{ region, temperature, humidity, severity }` | `{ farmer, plotId, moisture, cropStage, recommendation }` |
| **Zone 3: Form Inputs** | `frontend/src/App.jsx` | Fields inside `<form>` | Region, Temp (°C), Humidity (%) inputs | Farmer, Plot ID, Moisture (%), Crop Stage |
| **Zone 4: Table Display** | `frontend/src/App.jsx` | `<th>` headers and `<td>` cells | Region, Temp, Humidity, Severity Badge | Plot, Farmer, Moisture, Stage, AI Advice |

---

## 🛠️ Dual Backend Architecture: Choose Your Mode

Depending on the exact phrasing of your question:

### Mode 1: Express + MongoDB Native Client + React 18 (Default - 95% of exams)
- File: [`TEMPLATE_EXAM_STARTER/backend/server.js`](TEMPLATE_EXAM_STARTER/backend/server.js)
- Run: `npm run template` (or `cd TEMPLATE_EXAM_STARTER && npm start`)
- Best for: **Problem Statements 2, 3, 4** and **Questions Q1 - Q9**.
- Dual-Mode: Automatically connects to `mongodb://127.0.0.1:27017`. If MongoDB is stopped, seamlessly switches to `backend/data_fallback.json` with zero errors!

### Mode 2: Pure Core Node.js (`http`, `url`, `fs`, `path`) (Zero External Dependencies)
- File: [`TEMPLATE_EXAM_STARTER/backend/server_core_node.js`](TEMPLATE_EXAM_STARTER/backend/server_core_node.js)
- Run: `npm run template:core` (or `cd TEMPLATE_EXAM_STARTER && npm run start:core`)
- Best for: **Problem Statement 1** or questions specifically stating *"Develop using Core Node.js using http, url, and fs modules without Express"*.

---

# 📚 Detailed Solutions for Faculty Practice Problems

---

## 🌡️ Problem Statement 1: Regional Temperature Monitoring Dashboard (Core Node.js)

### Requirements:
- Use **Core Node.js** built-in modules: `http`, `url`, `fs`.
- Manage historical and current temperature records collected from different regions.
- Provide URL-based services consumed by React dashboard.
- Read/write JSON-based climate data.

### 1. How to Adapt the Template:
Use [`TEMPLATE_EXAM_STARTER/backend/server_core_node.js`](TEMPLATE_EXAM_STARTER/backend/server_core_node.js):

```javascript
// CHANGE ZONE 1:
const PORT = 5000;
const API_BASE = '/api/temperature';

// CHANGE ZONE 2 (Initial Sample Climate Data):
let memoryData = [
  { id: '1', region: 'North', temperature: 42.5, humidity: 30, recordedAt: '2026-06-15 14:00', status: 'Active' },
  { id: '2', region: 'South', temperature: 31.0, humidity: 75, recordedAt: '2026-06-15 14:00', status: 'Normal' },
  { id: '3', region: 'West',  temperature: 46.2, humidity: 22, recordedAt: '2026-06-15 14:00', status: 'Warning' }
];

// CHANGE ZONE 3 (URL Query & Query Filter):
// The template automatically parses URL with: const parsedUrl = url.parse(req.url, true);
// Supports: GET /api/temperature?region=North
```

### 2. Run Command:
```bash
node TEMPLATE_EXAM_STARTER/backend/server_core_node.js
```

### 3. Test with cURL:
```bash
# Get all temperature records:
curl http://localhost:5000/api/temperature

# Filter by region URL query:
curl "http://localhost:5000/api/temperature?region=North"

# Add new climate record:
curl -X POST http://localhost:5000/api/temperature \
  -H "Content-Type: application/json" \
  -d '{"region":"Central","temperature":38.4,"humidity":45,"status":"Active"}'
```

---

## 🔥 Problem Statement 2: Heatwave Prediction & Severity Classification (Express REST + Validation)

### Requirements:
- RESTful backend using **Node.js and Express.js**.
- Manage temperature observations and predicted heatwave severity.
- REST APIs to Create, Retrieve, Update, and Delete regional climate records.
- Validate incoming JSON data and return error/success status codes.
- Test all routes using Postman.

### 1. How to Adapt the Template:
In [`TEMPLATE_EXAM_STARTER/backend/server.js`](TEMPLATE_EXAM_STARTER/backend/server.js):

```javascript
// CHANGE ZONE 1:
const PORT = 5000;
const DB_NAME = 'heatwave_db';
const COLLECTION_NAME = 'climate_observations';
const API_BASE = '/api/heatwave';

// CHANGE ZONE 2:
let memoryData = [
  { id: '1', region: 'Vidarbha', temperature: 45.8, humidity: 24, severity: 'Extreme Heatwave', prediction: 'Alert Level Red' },
  { id: '2', region: 'Marathwada', temperature: 41.2, humidity: 32, severity: 'Severe Heatwave', prediction: 'Alert Level Orange' },
  { id: '3', region: 'Konkan', temperature: 34.0, humidity: 80, severity: 'Normal', prediction: 'No Heatwave' }
];

// CHANGE ZONE 3 (Validation & AI Severity Classification Rule):
function validateAndEnrich(record) {
  const temp = Number(record.temperature);
  if (isNaN(temp) || temp < -20 || temp > 60) {
    throw new Error('Temperature must be a valid number between -20°C and 60°C');
  }
  if (!record.region || record.region.trim() === '') {
    throw new Error('Region name is required');
  }

  // AI Heatwave Severity Rule
  if (temp >= 45) {
    record.severity = 'Extreme Heatwave';
    record.prediction = 'Alert Level Red (Avoid outdoor activity)';
  } else if (temp >= 40) {
    record.severity = 'Severe Heatwave';
    record.prediction = 'Alert Level Orange (High risk for elderly)';
  } else if (temp >= 36) {
    record.severity = 'Moderate Heatwave';
    record.prediction = 'Alert Level Yellow (Stay hydrated)';
  } else {
    record.severity = 'Normal';
    record.prediction = 'No Heatwave';
  }

  return { ...record, updatedAt: new Date().toISOString() };
}
```

### 2. Postman Verification Test Suite:
1. **GET `/api/heatwave`** -> Returns status `200 OK` with JSON array of observations.
2. **POST `/api/heatwave`** with Body:
   ```json
   {
     "region": "Rajasthan Desert",
     "temperature": 47.5,
     "humidity": 18
   }
   ```
   -> Returns status `201 Created` with automatically classified severity: `"Extreme Heatwave"`.
3. **POST `/api/heatwave` (Invalid Validation Test)** with Body:
   ```json
   {
     "region": "",
     "temperature": 150
   }
   ```
   -> Returns status `400 Bad Request` with error message.
4. **PUT `/api/heatwave/:id`** -> Returns status `200 OK` with updated record.
5. **DELETE `/api/heatwave/:id`** -> Returns status `200 OK` `{ "success": true, "id": "..." }`.

---

## 🌾 Problem Statement 3 & 4: Integrated Smart Sugarcane Irrigation System (MongoDB + Express + React)

### Requirements:
- Backend: Node.js, Express.js, MongoDB database.
- Maintain **Farmer**, **Plot**, **Soil Moisture**, **Crop Stage**, **Weather**, and **Irrigation** records.
- Provide RESTful APIs for CRUD and plot-specific information retrieval for AI decision support.
- Frontend: Responsive **ReactJS dashboard** displaying plots, soil moisture, weather, and AI recommendations.

### 1. Backend (`TEMPLATE_EXAM_STARTER/backend/server.js`):
```javascript
// CHANGE ZONE 1:
const PORT = 5000;
const DB_NAME = 'sugarcane_irrigation_db';
const COLLECTION_NAME = 'plots';
const API_BASE = '/api/plots';

// CHANGE ZONE 2:
let memoryData = [
  {
    id: '1',
    plotNumber: 'Plot #101',
    farmerName: 'Ramesh Patil',
    cropStage: 'Tillering',
    soilMoisture: 28,
    weather: 'Sunny (38°C)',
    recommendation: 'Urgent: Irrigate 120 mins immediately'
  },
  {
    id: '2',
    plotNumber: 'Plot #102',
    farmerName: 'Suresh More',
    cropStage: 'Grand Growth',
    soilMoisture: 58,
    weather: 'Cloudy (30°C)',
    recommendation: 'Moisture Adequate: No irrigation required today'
  },
  {
    id: '3',
    plotNumber: 'Plot #103',
    farmerName: 'Anita Deshmukh',
    cropStage: 'Germination',
    soilMoisture: 42,
    weather: 'Hot & Dry (36°C)',
    recommendation: 'Moderate: Schedule 45 min drip irrigation'
  }
];

// CHANGE ZONE 3 (AI Decision Support Logic):
function validateAndEnrich(record) {
  const moisture = Number(record.soilMoisture || 0);

  // AI Irrigation Recommendation Algorithm:
  if (moisture < 30) {
    record.recommendation = '⚠️ CRITICAL: Soil moisture low (<30%). Irrigate 120 mins immediately!';
    record.status = 'Urgent';
  } else if (moisture < 50) {
    record.recommendation = '💧 SCHEDULED: Soil moisture moderate (30-50%). Apply 45 mins drip irrigation.';
    record.status = 'Pending';
  } else {
    record.recommendation = '✅ OPTIMAL: Moisture adequate (>50%). Zero irrigation required.';
    record.status = 'Completed';
  }

  return { ...record, updatedAt: new Date().toISOString() };
}
```

### 2. Frontend (`TEMPLATE_EXAM_STARTER/frontend/src/App.jsx`):
```jsx
// CHANGE ZONE 1:
const PAGE_TITLE = '🌾 Smart Sugarcane Irrigation Decision Dashboard';
const API_URL = '/api/plots';
const INITIAL_FORM = {
  plotNumber: '',
  farmerName: '',
  cropStage: 'Tillering',
  soilMoisture: 40,
  weather: 'Sunny (35°C)'
};

// CHANGE ZONE 3 (Form Inputs):
<div className="form-row">
  <div className="form-group flex-1">
    <label>Plot Identifier *</label>
    <input
      type="text"
      placeholder="e.g. Plot #104"
      value={form.plotNumber || ''}
      onChange={e => setForm({ ...form, plotNumber: e.target.value })}
      required
    />
  </div>
  <div className="form-group flex-1">
    <label>Farmer Name *</label>
    <input
      type="text"
      placeholder="e.g. Ganesh Shinde"
      value={form.farmerName || ''}
      onChange={e => setForm({ ...form, farmerName: e.target.value })}
      required
    />
  </div>
  <div className="form-group flex-1">
    <label>Soil Moisture (%) *</label>
    <input
      type="number"
      min="0"
      max="100"
      value={form.soilMoisture || ''}
      onChange={e => setForm({ ...form, soilMoisture: Number(e.target.value) })}
      required
    />
  </div>
  <div className="form-group flex-1">
    <label>Crop Stage</label>
    <select
      value={form.cropStage || 'Tillering'}
      onChange={e => setForm({ ...form, cropStage: e.target.value })}
    >
      <option value="Germination">Germination</option>
      <option value="Tillering">Tillering</option>
      <option value="Grand Growth">Grand Growth</option>
      <option value="Maturity">Maturity</option>
    </select>
  </div>
</div>

// CHANGE ZONE 4 (Table Columns):
<thead>
  <tr>
    <th>Plot</th>
    <th>Farmer</th>
    <th>Crop Stage</th>
    <th>Soil Moisture</th>
    <th>AI Recommendation</th>
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  {filteredItems.map(item => (
    <tr key={item.id}>
      <td><strong>{item.plotNumber}</strong></td>
      <td>{item.farmerName}</td>
      <td>{item.cropStage}</td>
      <td>
        <span className={`badge ${item.soilMoisture < 30 ? 'badge-red' : item.soilMoisture < 50 ? 'badge-yellow' : 'badge-green'}`}>
          {item.soilMoisture}%
        </span>
      </td>
      <td>{item.recommendation}</td>
      <td className="actions">
        <button className="btn btn-warning btn-small" onClick={() => handleEdit(item)}>Edit</button>
        <button className="btn btn-danger btn-small" onClick={() => handleDelete(item.id)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>
```

---

## 📋 Master Cheatsheet for Questions Q1 through Q9

Located in [`already_set_questions/`](already_set_questions/):

| Question | Entity & Port | Database | Model Fields to Change | Special Feature / Viva Hook |
|---|---|---|---|---|
| **Q1: Book Store** | `books` (`5001`) | `book_ecommerce` | `title`, `author`, `price`, `category`, `stock` | Cart array state `[cart, setCart]`, React Router v6 |
| **Q2: Doctor Appt** | `appointments` (`5002`) | `doctor_appointments` | `patientName`, `doctorName`, `date`, `time`, `status` | Doctor schedule filters, Status toggles |
| **Q3: Expense Tracker** | `expenses` (`5003`) | `expense_tracker` | `title`, `amount`, `category`, `date` | Category budget breakdown progress bars |
| **Q4: Daily Task Mgr** | `tasks` (`5004`) | `task_manager` | `title`, `priority` (High/Med/Low), `dueDate`, `status` | Status toggle checkbox with `PUT` endpoint |
| **Q5: Discussion Forum** | `posts` (`5005`) | `discussion_forum` | `title`, `content`, `author`, `upvotes` | Upvote button sending `upvotes: item.upvotes + 1` |
| **Q6: Teacher Gradebook** | `students` (`5006`) | `gradebook_db` | `name`, `roll`, `marks1`, `marks2`, `marks3` | Auto-calculates Average mark and Letter Grade |
| **Q7: Product & User Mgmt**| `products` (`5007`) | `product_user_db` | `name`, `price`, `stock`, `email`, `phone` | Strict Regex validation (`/^\S+@\S+\.\S+$/`) |
| **Q8: Team Directory** | `members` (`5008`) | `team_directory_db` | `name`, `role`, `department`, `email`, `bio` | Reusable props passing (`<Navbar />`, `<TeamCard />`) |
| **Q9: Patient Records** | `patients` (`5009`) | `patient_management_db` | `name`, `age`, `disease`, `room`, `status` | Hospital admission filtering (Admitted / Discharged) |

---

## 🛡️ Top 5 Exam Viva Questions & Model Answers

### Q1: Why do you use `MongoClient` directly instead of Mongoose?
**Answer:** The official university syllabus and exam rubrics evaluate the official native MongoDB driver (`mongodb` npm package). `MongoClient` directly interacts with the database via connection pooling, requires zero schema lock-in, and starts up with zero overhead.

### Q2: What happens if MongoDB is not running on the examiner's PC?
**Answer:** Our universal architecture includes an automatic fail-safe. If the MongoDB service is stopped or port 27017 is blocked, the server catches the error, activates local JSON file persistence (`data_fallback.json`), and continues serving full CRUD requests with zero downtime or crash.

### Q3: What is the difference between Core Node.js and Express.js?
**Answer:** Core Node.js uses native modules (`http`, `url`, `fs`) where request routing, URL parsing, and streaming request body parsing must be handled manually. Express.js is a minimal, flexible web framework built on top of Core Node.js that provides high-level routing, built-in body parsing middleware (`express.json()`), and cleaner syntax.

### Q4: How does React communicate with the Express backend?
**Answer:** Through the browser's native `fetch` API using standard HTTP verbs:
- `fetch('/api/items', { method: 'GET' })` to read.
- `fetch('/api/items', { method: 'POST', body: JSON.stringify(data) })` to create.
- `fetch('/api/items/:id', { method: 'PUT', body: JSON.stringify(data) })` to update.
- `fetch('/api/items/:id', { method: 'DELETE' })` to delete.

### Q5: How do you serve the React app and Express API from the same port?
**Answer:** Express statically hosts the production build of React via `app.use(express.static(path.join(__dirname, '../frontend/dist')))`, with a catch-all route `app.get('*', ...)` serving `index.html`. This avoids CORS issues and allows running the entire application on a single port (e.g., `5000`).
