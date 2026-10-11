# 🚀 Universal Full-Stack Exam Template & Starter Boilerplate

> **The 1-Template Solution for Any Web Programming / OST Lab Exam Question in 10 Minutes!**  
> Supports both **Full-Stack Express + MongoDB + React 18** and **Pure Core Node.js (`http`, `url`, `fs`)**.

---

## ⚡ The "Only Change 4 Places" Rule

You never write an application from scratch in an exam. You copy this starter folder and edit **ONLY 4 NUMBERED CHANGE ZONES**:

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

| Change Zone | File | What to Edit | Example: Sugarcane Irrigation (PS 3 & 4) | Example: Temperature Monitor (PS 1 & 2) |
|---|---|---|---|---|
| **Zone 1: Config** | `backend/server.js` | `PORT`, `DB_NAME`, `COLLECTION_NAME` | `PORT = 5000`<br>`COLLECTION = 'plots'` | `PORT = 5000`<br>`COLLECTION = 'temperature_records'` |
| **Zone 2: Seed Data** | `backend/server.js` | 2-3 sample records in `memoryData` | `{ plotId, farmer, moisture, cropStage }` | `{ region, temperature, humidity, date }` |
| **Zone 3: Form Inputs** | `frontend/src/App.jsx` | Input fields inside `<form>` | Plot ID, Farmer, Moisture %, Stage inputs | Region, Temperature (°C), Humidity % inputs |
| **Zone 4: Table Display**| `frontend/src/App.jsx` | `<th>` headers and `<td>` cells | Plot ID, Soil Moisture, AI Recommendation | Region, Temp, Humidity, Severity Badge |

---

## 🛠️ Which Backend Mode Does Your Question Demand?

This starter folder includes **both modes** ready to run:

### Mode A: Full-Stack Express + MongoDB + React 18 (Default - 95% of exams)
Used for **Problem Statement 2, 3, 4** and Questions **Q1 - Q9**.
- Dual-mode: Native `MongoClient` + Seamless offline JSON fallback (never crashes if MongoDB service is stopped).
- Run:
  ```bash
  npm start
  # or from project root: npm run template
  ```
- URL: **`http://localhost:5000`** (serves both REST API and React UI).

### Mode B: Pure Core Node.js (`http`, `url`, `fs`) (Zero external packages!)
Used specifically for **Problem Statement 1** or questions stating *"Use Core Node.js http, url, fs without Express"*.
- Built using only built-in modules (`http`, `url`, `fs`, `path`).
- Reads URL query parameters via `url.parse(req.url, true)`.
- Persists records to JSON using `fs.readFileSync` / `fs.writeFileSync`.
- Run:
  ```bash
  npm run start:core
  # or: node backend/server_core_node.js
  ```
- URL: **`http://localhost:5000`**.

---

## 📁 File Structure

```
TEMPLATE_EXAM_STARTER/
├── backend/
│   ├── server.js              # Express + MongoDB Native Client + Offline JSON Fallback
│   ├── server_core_node.js    # Pure Core Node.js server (http, url, fs - zero dependencies)
│   ├── data_fallback.json     # Offline data store (auto-generated)
│   └── package.json           # express, cors, mongodb
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # React 18 Dashboard with 4 Change Zones
│   │   ├── main.jsx           # React DOM mounting
│   │   └── style.css          # Responsive modern styling (zero external CSS)
│   ├── index.html             # Vite entry point
│   ├── vite.config.js         # Proxy configuration
│   └── package.json           # Vite scripts
├── package.json               # Root scripts (start, start:core, build)
└── README.md                  # This guide
```

---

## 🧪 Testing REST Endpoints with cURL / Postman

### 1. GET all records (with optional query filter):
```bash
curl http://localhost:5000/api/items
curl "http://localhost:5000/api/items?search=Alpha"
```

### 2. POST create a new record:
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Plot #104\",\"category\":\"Agriculture\",\"status\":\"Active\",\"description\":\"Sugarcane field 4\"}"
```

### 3. PUT update an existing record:
```bash
curl -X PUT http://localhost:5000/api/items/1 \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"Completed\",\"description\":\"Irrigation finished\"}"
```

### 4. DELETE a record:
```bash
curl -X DELETE http://localhost:5000/api/items/1
```

---

## 📖 Complete Exam Solutions & Cheatsheet

For copy-paste code snippets for:
- **Problem Statement 1** (Regional Temperature Monitoring Dashboard)
- **Problem Statement 2** (Heatwave Prediction & Severity Classification)
- **Problem Statement 3** (Smart Irrigation Recommendation System Backend)
- **Problem Statement 4** (Integrated Smart Sugarcane Irrigation Dashboard)
- **Questions Q1 through Q9**

👉 **Read [UNIVERSAL_EXAM_TEMPLATE.md](../UNIVERSAL_EXAM_TEMPLATE.md) in the repository root.**
