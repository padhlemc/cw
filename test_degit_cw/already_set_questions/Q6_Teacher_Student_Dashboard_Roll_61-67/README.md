# Teacher / Student Dashboard & Gradebook
> **Roll Numbers:** 61 to 67  
> **Backend Port:** `5006`  
> **Database:** MongoDB (`gradebook_db`) via Native `MongoClient` Driver (with Offline JSON Fallback)  
> **Frontend:** React 18 (Component State, Hooks, Modern UI)

---

## 📌 Problem Statement
Manage student marks, automatic percentage and letter grade calculation, class statistics (highest, lowest, class average), and printable student report card modal.

---

## 📁 Architecture (Separated Frontend & Backend)

```
Q6_Teacher_Student_Dashboard_Roll_61-67/
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
Run both frontend and backend seamlessly together on **Port 5006**:

```bash
# Step 1: Navigate to the question folder
cd Q6_Teacher_Student_Dashboard_Roll_61-67

# Step 2: Install dependencies (optional if node_modules is pre-installed)
npm install

# Step 3: Start the full-stack application
npm start
# (or: npm run dev)
```

Now open your browser at:
👉 **`http://localhost:5006`**

---

### Method 2: Running Frontend & Backend Separately

#### 1. Start the Backend Server:
```bash
cd backend
npm install
npm start
```
*Backend runs at `http://localhost:5006` serving REST API endpoints on `/api/...`.*

#### 2. Open the Frontend:
- Open `frontend/index.html` directly in your browser, **OR**
- Run a live server in the `frontend` folder:
  ```bash
  cd frontend
  npx serve . -p 3000
  ```
*The frontend automatically connects to `http://localhost:5006/api` with CORS enabled!*

---

## 🗄️ MongoDB Native Driver Details
- **Driver:** Official `mongodb` Node.js driver (`MongoClient`, `ObjectId`)
- **Connection URI:** `mongodb://127.0.0.1:27017`
- **Database Name:** `gradebook_db`
- **Collections:** `students`
- **Offline Fallback:** If MongoDB is not running locally in your lab, the server automatically saves data to `data_fallback.json`. You will never get an unhandled database crash!

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Sample Payload |
|---|---|---|---|
| `GET` | `/api/students` | List all students with grades & stats | N/A |
| `POST` | `/api/students` | Add a new student record | `{"rollNo":"24IT105","name":"Kavita Patel","department":"IT","marks":{"os":88,"dbms":92,"cn":85},"attendance":94}` |
| `PUT` | `/api/students/:id` | Update student marks or attendance | `{"marks":{"os":90,"dbms":95,"cn":88}}` |
| `DELETE` | `/api/students/:id` | Delete student record | N/A |

### Quick Test via cURL:
```bash
# Fetch students list and calculated grades
curl http://localhost:5006/api/students

# Add a student record
curl -X POST http://localhost:5006/api/students \
  -H "Content-Type: application/json" \
  -d "{\"rollNo\":\"24CS201\",\"name\":\"Vikram Singh\",\"department\":\"CSE\",\"marks\":{\"os\":85,\"dbms\":80,\"cn\":78},\"attendance\":90}"
```

