# Doctor Appointment Scheduling Web App
> **Roll Numbers:** 31 to 38  
> **Backend Port:** `5002`  
> **Database:** MongoDB (`doctor_appointments`) via Native `MongoClient` Driver (with Offline JSON Fallback)  
> **Frontend:** React 18 (Component State, Hooks, Modern UI)

---

## 📌 Problem Statement
Patients book, reschedule, or cancel appointments. Doctors view daily schedules and manage live availability toggle.

---

## 📁 Architecture (Separated Frontend & Backend)

```
Q2_Doctor_Appointment_Roll_31-38/
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
Run both frontend and backend seamlessly together on **Port 5002**:

```bash
# Step 1: Navigate to the question folder
cd Q2_Doctor_Appointment_Roll_31-38

# Step 2: Install dependencies (optional if node_modules is pre-installed)
npm install

# Step 3: Start the full-stack application
npm start
# (or: npm run dev)
```

Now open your browser at:
👉 **`http://localhost:5002`**

---

### Method 2: Running Frontend & Backend Separately

#### 1. Start the Backend Server:
```bash
cd backend
npm install
npm start
```
*Backend runs at `http://localhost:5002` serving REST API endpoints on `/api/...`.*

#### 2. Open the Frontend:
- Open `frontend/index.html` directly in your browser, **OR**
- Run a live server in the `frontend` folder:
  ```bash
  cd frontend
  npx serve . -p 3000
  ```
*The frontend automatically connects to `http://localhost:5002/api` with CORS enabled!*

---

## 🗄️ MongoDB Native Driver Details
- **Driver:** Official `mongodb` Node.js driver (`MongoClient`, `ObjectId`)
- **Connection URI:** `mongodb://127.0.0.1:27017`
- **Database Name:** `doctor_appointments`
- **Collections:** `doctors, appointments`
- **Offline Fallback:** If MongoDB is not running locally in your lab, the server automatically saves data to `data_fallback.json`. You will never get an unhandled database crash!

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Sample Payload |
|---|---|---|---|
| `GET` | `/api/doctors` | List all available doctors and status | N/A |
| `GET` | `/api/appointments` | List all booked appointments | N/A |
| `POST` | `/api/appointments` | Book new doctor appointment | `{"patientName":"Rahul","doctorId":"doc1","doctorName":"Dr. Mehta","date":"2026-10-15","time":"10:00 AM","reason":"General Checkup"}` |
| `PUT` | `/api/appointments/:id` | Reschedule or update appointment | `{"status":"Confirmed","date":"2026-10-16"}` |
| `DELETE` | `/api/appointments/:id` | Cancel appointment | N/A |

### Quick Test via cURL:
```bash
# Fetch doctors
curl http://localhost:5002/api/doctors

# Fetch appointments
curl http://localhost:5002/api/appointments
```

