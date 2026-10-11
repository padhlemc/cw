# Product and User Management System
> **Roll Numbers:** Special Roll / Syllabus Q1  
> **Backend Port:** `5007`  
> **Database:** MongoDB (`product_user_db`) via Native `MongoClient` Driver (with Offline JSON Fallback)  
> **Frontend:** React 18 (Component State, Hooks, Modern UI)

---

## 📌 Problem Statement
Dual-tab CRUD application for products and users with strict regex validation for email, 10-digit phone, positive price, and stock counts.

---

## 📁 Architecture (Separated Frontend & Backend)

```
Q7_Product_User_Management/
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
Run both frontend and backend seamlessly together on **Port 5007**:

```bash
# Step 1: Navigate to the question folder
cd Q7_Product_User_Management

# Step 2: Install dependencies (optional if node_modules is pre-installed)
npm install

# Step 3: Start the full-stack application
npm start
# (or: npm run dev)
```

Now open your browser at:
👉 **`http://localhost:5007`**

---

### Method 2: Running Frontend & Backend Separately

#### 1. Start the Backend Server:
```bash
cd backend
npm install
npm start
```
*Backend runs at `http://localhost:5007` serving REST API endpoints on `/api/...`.*

#### 2. Open the Frontend:
- Open `frontend/index.html` directly in your browser, **OR**
- Run a live server in the `frontend` folder:
  ```bash
  cd frontend
  npx serve . -p 3000
  ```
*The frontend automatically connects to `http://localhost:5007/api` with CORS enabled!*

---

## 🗄️ MongoDB Native Driver Details
- **Driver:** Official `mongodb` Node.js driver (`MongoClient`, `ObjectId`)
- **Connection URI:** `mongodb://127.0.0.1:27017`
- **Database Name:** `product_user_db`
- **Collections:** `products, users`
- **Offline Fallback:** If MongoDB is not running locally in your lab, the server automatically saves data to `data_fallback.json`. You will never get an unhandled database crash!

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Sample Payload |
|---|---|---|---|
| `GET` | `/api/products` | List all inventory products | N/A |
| `POST` | `/api/products` | Create product (Strict validation: price > 0, stock >= 0) | `{"name":"Mechanical Keyboard","category":"Electronics","price":2499,"stock":15}` |
| `PUT` | `/api/products/:id` | Update product details | `{"price":2299,"stock":12}` |
| `DELETE` | `/api/products/:id` | Delete product | N/A |
| `GET` | `/api/users` | List all registered users | N/A |
| `POST` | `/api/users` | Register user (Strict validation: email regex, 10-digit phone) | `{"name":"Aman Gupta","email":"aman@gmail.com","phone":"9876543210","role":"Customer"}` |
| `PUT` | `/api/users/:id` | Update user | `{"phone":"9811223344"}` |
| `DELETE` | `/api/users/:id` | Delete user | N/A |

### Quick Test via cURL:
```bash
# Fetch products
curl http://localhost:5007/api/products

# Fetch users
curl http://localhost:5007/api/users
```

