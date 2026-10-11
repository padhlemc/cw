# Daily Task Manager Application
> **Roll Numbers:** 46 to 51, 70  
> **Backend Port:** `5004`  
> **Database:** MongoDB (`task_manager`) via Native `MongoClient` Driver (with Offline JSON Fallback)  
> **Frontend:** React 18 (Component State, Hooks, Modern UI)

---

## 📌 Problem Statement
Full task CRUD with status toggles (Pending, In Progress, Completed), priority tagging, and category filters.

---

## 📁 Architecture (Separated Frontend & Backend)

```
Q4_Daily_Task_Manager_Roll_46-51_70/
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
Run both frontend and backend seamlessly together on **Port 5004**:

```bash
# Step 1: Navigate to the question folder
cd Q4_Daily_Task_Manager_Roll_46-51_70

# Step 2: Install dependencies (optional if node_modules is pre-installed)
npm install

# Step 3: Start the full-stack application
npm start
# (or: npm run dev)
```

Now open your browser at:
👉 **`http://localhost:5004`**

---

### Method 2: Running Frontend & Backend Separately

#### 1. Start the Backend Server:
```bash
cd backend
npm install
npm start
```
*Backend runs at `http://localhost:5004` serving REST API endpoints on `/api/...`.*

#### 2. Open the Frontend:
- Open `frontend/index.html` directly in your browser, **OR**
- Run a live server in the `frontend` folder:
  ```bash
  cd frontend
  npx serve . -p 3000
  ```
*The frontend automatically connects to `http://localhost:5004/api` with CORS enabled!*

---

## 🗄️ MongoDB Native Driver Details
- **Driver:** Official `mongodb` Node.js driver (`MongoClient`, `ObjectId`)
- **Connection URI:** `mongodb://127.0.0.1:27017`
- **Database Name:** `task_manager`
- **Collections:** `tasks`
- **Offline Fallback:** If MongoDB is not running locally in your lab, the server automatically saves data to `data_fallback.json`. You will never get an unhandled database crash!

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Sample Payload |
|---|---|---|---|
| `GET` | `/api/tasks` | List tasks (filters: `?priority=...&status=...`) | N/A |
| `POST` | `/api/tasks` | Create a new task | `{"title":"Prepare IA2 PPT","description":"Slide deck on Docker","priority":"High","dueDate":"2026-10-10","status":"Pending"}` |
| `PUT` | `/api/tasks/:id` | Update task or toggle status | `{"status":"Completed"}` |
| `DELETE` | `/api/tasks/:id` | Delete task | N/A |

### Quick Test via cURL:
```bash
# Fetch all tasks
curl http://localhost:5004/api/tasks

# Add a task
curl -X POST http://localhost:5004/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Review React Router\",\"priority\":\"Medium\",\"status\":\"Pending\"}"
```

