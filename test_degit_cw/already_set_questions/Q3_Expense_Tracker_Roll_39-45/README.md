# Daily Expense Tracker & Reports
> **Roll Numbers:** 39 to 45  
> **Backend Port:** `5003`  
> **Database:** MongoDB (`expense_tracker`) via Native `MongoClient` Driver (with Offline JSON Fallback)  
> **Frontend:** React 18 (Component State, Hooks, Modern UI)

---

## 📌 Problem Statement
Add, update, and delete daily expenses across categories (Food, Transport, Entertainment, etc.) with category breakdown progress bars and monthly summaries.

---

## 📁 Architecture (Separated Frontend & Backend)

```
Q3_Expense_Tracker_Roll_39-45/
├── backend/
│   ├── server.js              # Node.js + Express API + MongoClient Native Driver
│   ├── package.json           # Backend dependencies (express, cors, mongodb)
│   └── data_fallback.json     # Automatic offline data persistence store
├── frontend/
│   ├── index.html             # HTML entry point (React 18 + Babel)
│   ├── app.jsx                # React 18 component hierarchy, state & API calls
│   ├── style.css              # Responsive modern CSS styling
│   └── package.json           # Frontend helper scripts
├── package.json               # Root scripts to run the entire app in 1 command
└── README.md                  # This step-by-step documentation
```

---

## 🚀 How to Run

### Method 1: Quick 2-Step Run (Recommended for Exams)
Run both frontend and backend seamlessly together on **Port 5003**:

```bash
# Step 1: Navigate to the question folder
cd Q3_Expense_Tracker_Roll_39-45

# Step 2: Install dependencies (optional if node_modules is pre-installed)
npm install

# Step 3: Start the full-stack application
npm start
# (or: npm run dev)
```

Now open your browser at:
👉 **`http://localhost:5003`**

---

### Method 2: Running Frontend & Backend Separately

#### 1. Start the Backend Server:
```bash
cd backend
npm install
npm start
```
*Backend runs at `http://localhost:5003` serving REST API endpoints on `/api/...`.*

#### 2. Open the Frontend:
- Open `frontend/index.html` directly in your browser, **OR**
- Run a live server in the `frontend` folder:
  ```bash
  cd frontend
  npx serve . -p 3000
  ```
*The frontend automatically connects to `http://localhost:5003/api` with CORS enabled!*

---

## 🗄️ MongoDB Native Driver Details
- **Driver:** Official `mongodb` Node.js driver (`MongoClient`, `ObjectId`)
- **Connection URI:** `mongodb://127.0.0.1:27017`
- **Database Name:** `expense_tracker`
- **Collections:** `expenses`
- **Offline Fallback:** If MongoDB is not running locally in your lab, the server automatically saves data to `data_fallback.json`. You will never get an unhandled database crash!

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Sample Payload |
|---|---|---|---|
| `GET` | `/api/expenses` | List all expenses (with category summaries) | N/A |
| `POST` | `/api/expenses` | Add a new daily expense | `{"title":"Lunch","amount":250,"category":"Food","date":"2026-10-07","paymentMethod":"UPI"}` |
| `PUT` | `/api/expenses/:id` | Update an existing expense | `{"title":"Dinner","amount":350,"category":"Food"}` |
| `DELETE` | `/api/expenses/:id` | Delete an expense | N/A |

### Quick Test via cURL:
```bash
# Fetch all expenses
curl http://localhost:5003/api/expenses

# Add a new expense
curl -X POST http://localhost:5003/api/expenses \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Books\",\"amount\":450,\"category\":\"Education\",\"date\":\"2026-10-07\"}"
```

