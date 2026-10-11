# Open Source Technologies (OST) / Web Programming Lab - Complete Solutions & Master Exam Suite

Production-grade, fully working solutions for all **9 Internal Assessment (IA-2) & Lab Exam Questions**, plus the **Universal Exam Template** that allows any student to solve ANY question in 10 minutes.

---

## 🌟 The Universal Exam Template (Learn 1 Template, Solve Any Question!)

Before checking individual questions, check the guides and inspect [**TEMPLATE_EXAM_STARTER/**](TEMPLATE_EXAM_STARTER):
- 🎬 [**EXAM_STUDY_AND_VIDEO_GUIDE.md**](EXAM_STUDY_AND_VIDEO_GUIDE.md): The **90-minute video roadmap** + mental model for when and how to change the code.
- 🎓 [**UNIVERSAL_EXAM_TEMPLATE.md**](UNIVERSAL_EXAM_TEMPLATE.md): Master cheatsheet covering the 4 problem statements + questions Q1-Q9.
- **The "Change Only 4 Things" Rule**: You only change: (1) Port & Collection Name, (2) Schema fields, (3) Form Inputs, and (4) Table Display columns!
- **Zero Lab Crashes**: Built-in automatic fallback to local JSON storage if MongoDB is not running on the college computer.
- **Vite React Architecture (No Babel)**: Pure React 18 + Vite with ES modules, zero Babel CDN runtime lag, pre-built production bundles, and offline resilience!

---

## 📋 Master Question Directory & Roll Number Mapping

| Question | Roll Numbers / Topic | Port | Database | Frontend & Concepts Tested | Quick Command |
|---|---|---|---|---|---|
| [**TEMPLATE_EXAM_STARTER**](TEMPLATE_EXAM_STARTER/README.md) | **Universal Master Boilerplate** | `5000` | `exam_starter_db` | Master CRUD Template (Add, Edit, Delete, Filter) | `npm run template` |
| [**Q1_Book_Ecommerce_Roll_24-30**](already_set_questions/Q1_Book_Ecommerce_Roll_24-30/README.md) | **Rolls 24 to 30**: Book E-Commerce Store | `5001` | `book_ecommerce` | React Router DOM v6, Cart, Orders, Admin panel | `npm run q1` |
| [**Q2_Doctor_Appointment_Roll_31-38**](already_set_questions/Q2_Doctor_Appointment_Roll_31-38/README.md) | **Rolls 31 to 38**: Doctor Appointment Booking | `5002` | `doctor_appointments` | Patient booking, reschedule, cancel, Doctor schedule | `npm run q2` |
| [**Q3_Expense_Tracker_Roll_39-45**](already_set_questions/Q3_Expense_Tracker_Roll_39-45/README.md) | **Rolls 39 to 45**: Daily Expense Tracker & Reports | `5003` | `expense_tracker` | Expense CRUD, Category breakdown progress bars | `npm run q3` |
| [**Q4_Daily_Task_Manager_Roll_46-51_70**](already_set_questions/Q4_Daily_Task_Manager_Roll_46-51_70/README.md) | **Rolls 46-51, 70**: Daily Task Manager | `5004` | `task_manager` | Task CRUD, status toggling, priority filters | `npm run q4` |
| [**Q5_Discussion_Forum_Roll_52-59**](already_set_questions/Q5_Discussion_Forum_Roll_52-59/README.md) | **Rolls 52 to 59**: Discussion Forum Threads | `5005` | `discussion_forum` | React Context API (`ForumContext`), Upvoting, Replies | `npm run q5` |
| [**Q6_Teacher_Student_Dashboard_Roll_61-67**](already_set_questions/Q6_Teacher_Student_Dashboard_Roll_61-67/README.md) | **Rolls 61 to 67**: Teacher-Student Gradebook | `5006` | `gradebook_db` | Grade calculations, Class stats, Printable Report Card | `npm run q6` |
| [**Q7_Product_User_Management**](already_set_questions/Q7_Product_User_Management/README.md) | **Product & User Management**: Dual-tab CRUD | `5007` | `product_user_db` | Strict Regex validation (email, phone, price > 0) | `npm run q7` |
| [**Q8_Team_Member_Directory**](already_set_questions/Q8_Team_Member_Directory/README.md) | **Team Member Directory**: Reusable Components | `5008` | `team_directory_db` | Props passing (`<Navbar />`, `<TeamCard />`), Vite support | `npm run q8` |
| [**Q9_Patient_Management**](already_set_questions/Q9_Patient_Management/README.md) | **Patient Management**: Health Record CRUD | `5009` | `patient_management_db` | Patient admission, diagnosis, status management | `npm run q9` |

---

## ⚡ Quick 1-Command Execution

You can run any question directly from the root repository:

```bash
# Run Question 1
npm run q1

# Run Question 9
npm run q9

# Run the Universal Template
npm run template

# Build all 10 Vite frontends in 1 command
npm run build

# Verify all questions in 1 command
npm run verify
```

Or navigate to any folder:
```bash
# 1. Start the backend & serve the React app
cd already_set_questions/Q1_Book_Ecommerce_Roll_24-30
npm start

# 2. Or start the Vite development server with hot-reload
cd frontend
npm run dev
```
Then open: **`http://localhost:5001`** (or `http://localhost:3000` for Vite dev).

---

## 📁 Standardized Folder Architecture

Every single question strictly adheres to the same clean full-stack architecture:

```
Q1_Book_Ecommerce_Roll_24-30/
├── backend/
│   ├── server.js              # Express REST API + Native MongoClient + JSON fallback
│   ├── package.json           # Backend dependencies (express, cors, mongodb)
│   └── data_fallback.json     # Automatic offline data store
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # React 18 component, hooks & state
│   │   ├── main.jsx           # React DOM root mounting
│   │   └── style.css          # Modern responsive CSS
│   ├── index.html             # Vite entry point (No Babel, No CDN)
│   ├── vite.config.js         # Vite config with backend proxy
│   └── package.json           # Frontend Vite scripts (dev, build, preview)
├── package.json               # Root scripts to run both in 1 command
└── README.md                  # Detailed question-specific instructions & curl tests
```
```

---

## 🗄️ MongoDB Native Driver + Automatic Offline Fallback

All backends use the official native MongoDB driver (`MongoClient`) matching university requirements:
```javascript
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 2000 });
await client.connect();
```

### 🛡️ Why You Will Never Crash in the Exam:
If MongoDB is not installed or running as a service on the lab computer:
- The server **does not crash**.
- It logs: `[MongoClient] MongoDB offline. Seamless JSON fallback active.`
- All operations (Create, Read, Update, Delete) are saved to `backend/data_fallback.json`.

---

## 📖 Master Exam Tutorial
- [**UNIVERSAL_EXAM_TEMPLATE.md**](UNIVERSAL_EXAM_TEMPLATE.md) - The master tutorial & 15-minute exam cheatsheet.

