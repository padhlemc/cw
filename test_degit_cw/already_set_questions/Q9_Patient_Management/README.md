# Patient Management CRUD Application
> **Roll Numbers:** Special Roll / Syllabus Q3  
> **Backend Port:** `5009`  
> **Database:** MongoDB (`patient_management_db`) via Native `MongoClient` Driver (with Offline JSON Fallback)  
> **Frontend:** React 18 (Component State, Hooks, Modern UI)

---

## 📌 Problem Statement
Complete REST API and UI to add, view, update, and delete patient records (Name, Age, Gender, Medical Condition, Admission Date, Status).

---

## 📁 Architecture (Separated Frontend & Backend)

```
Q9_Patient_Management/
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
Run both frontend and backend seamlessly together on **Port 5009**:

```bash
# Step 1: Navigate to the question folder
cd Q9_Patient_Management

# Step 2: Install dependencies (optional if node_modules is pre-installed)
npm install

# Step 3: Start the full-stack application
npm start
# (or: npm run dev)
```

Now open your browser at:
👉 **`http://localhost:5009`**

---

### Method 2: Running Frontend & Backend Separately

#### 1. Start the Backend Server:
```bash
cd backend
npm install
npm start
```
*Backend runs at `http://localhost:5009` serving REST API endpoints on `/api/...`.*

#### 2. Open the Frontend:
- Open `frontend/index.html` directly in your browser, **OR**
- Run a live server in the `frontend` folder:
  ```bash
  cd frontend
  npx serve . -p 3000
  ```
*The frontend automatically connects to `http://localhost:5009/api` with CORS enabled!*

---

## 🗄️ MongoDB Native Driver Details
- **Driver:** Official `mongodb` Node.js driver (`MongoClient`, `ObjectId`)
- **Connection URI:** `mongodb://127.0.0.1:27017`
- **Database Name:** `patient_management_db`
- **Collections:** `patients`
- **Offline Fallback:** If MongoDB is not running locally in your lab, the server automatically saves data to `data_fallback.json`. You will never get an unhandled database crash!

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Sample Payload |
|---|---|---|---|
| `GET` | `/api/patients` | List all patient health records | N/A |
| `POST` | `/api/patients` | Admit new patient | `{"name":"Rohan Verma","age":29,"gender":"Male","medicalCondition":"Acute Appendicitis","contact":"9876123450","roomNumber":"Room 302","status":"Admitted"}` |
| `PUT` | `/api/patients/:id` | Update patient treatment or status | `{"status":"Discharged","roomNumber":"N/A"}` |
| `DELETE` | `/api/patients/:id` | Remove patient record | N/A |

### Quick Test via cURL:
```bash
# Fetch patient records
curl http://localhost:5009/api/patients

# Admit a new patient
curl -X POST http://localhost:5009/api/patients \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Meera Nair\",\"age\":42,\"gender\":\"Female\",\"medicalCondition\":\"Asthma Management\",\"contact\":\"9811334455\",\"roomNumber\":\"Room 112\",\"status\":\"Under Treatment\"}"
```

