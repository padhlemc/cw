# 🎬 90-Minute Exam Study Guide & Video Roadmap

> **The Minimal Video Playlist & Mental Model to Master Web Programming / OST Lab Exams in 90 Minutes.**  
> Learn how everything connects (Node.js + Express + React 18 + MongoDB) and develop the exact intuition for **when and how to change the code**.

---

## 📺 The 3 Essential Videos (Total Time: ~90 Mins)

You do **not** need 10-hour courses. Watching these 3 focused videos will give you 100% of the theory tested in lab exams.

### 1. Backend REST API & Routing (35 Minutes)
* **Video:** [**Learn Express JS In 35 Minutes**](https://www.youtube.com/watch?v=SccSCuHhOw0) by **Web Dev Simplified (Kyle)**
* **Why this video matters:**
  * Maps 1-to-1 with [`TEMPLATE_EXAM_STARTER/backend/server.js`](TEMPLATE_EXAM_STARTER/backend/server.js).
  * Teaches how `app.get()`, `app.post()`, `app.put()`, and `app.delete()` receive browser requests and return JSON via `res.json()`.
  * Explains `req.body` (payload received from HTML forms) and `req.params.id` (URL parameters like `/api/items/:id`).
  * Demonstrates `express.json()` and serving static files.
* **Timestamps to Focus On:**
  * `02:30 - 08:00`: Setting up an Express app and basic routes.
  * `10:00 - 18:30`: Route parameters (`req.params`) and query strings (`req.query`).
  * `20:00 - 27:00`: Parsing JSON body data (`req.body`) and middleware.

---

### 2. Frontend State, Forms & Fetching (30 Minutes)
* **Video:** [**Learn React In 30 Minutes**](https://www.youtube.com/watch?v=hQAHSlTtcmY) by **Web Dev Simplified (Kyle)**  
  *(Hindi alternative: **Chai aur Code** by Hitesh Choudhary – React State & Hooks in One Shot)*
* **Why this video matters:**
  * Teaches the exact two React hooks powering [`TEMPLATE_EXAM_STARTER/frontend/src/App.jsx`](TEMPLATE_EXAM_STARTER/frontend/src/App.jsx):
    1. `useState`: Stores the form input data and the array of items.
    2. `useEffect`: Runs `loadData()` automatically when the page loads.
  * Teaches Controlled Form Inputs: `<input value={form.title} onChange={e => setForm({...form, title: e.target.value})} />`.
* **Timestamps to Focus On:**
  * `05:00 - 15:00`: Components, JSX syntax, and props.
  * `15:00 - 24:00`: `useState` and handling form inputs.
  * `24:00 - 29:00`: `useEffect` and side effects (fetching data).

---

### 3. Core Node.js Built-in Modules (25 Minutes)
* **Video:** [**Node.js Crash Course - Core Modules (`http`, `url`, `fs`)**](https://www.youtube.com/watch?v=fBNz5xF-Kx4) by **Traversy Media**  
  *(Alternative: Dave Gray's **Node.js Tutorial: Web Server from Scratch**)*
* **Why this video matters:**
  * Specifically for **Problem Statement 1** where university examiners state: *"Use Core Node.js http, url, and fs modules without Express"*.
  * Explains how [`TEMPLATE_EXAM_STARTER/backend/server_core_node.js`](TEMPLATE_EXAM_STARTER/backend/server_core_node.js) operates:
    * `http.createServer((req, res) => ...)`
    * `url.parse(req.url, true)` to extract query strings (`?region=North`)
    * `fs.readFileSync()` & `fs.writeFileSync()` to persist data to JSON without any database.
* **Timestamps to Focus On:**
  * `12:00 - 20:00`: Creating an HTTP server and setting response headers.
  * `20:00 - 26:00`: Reading and writing files with the `fs` module.

---

## 🧠 The Mental Model: "When and How to Change Code"

Whenever an examiner gives you a question prompt, trace this **4-step data pipeline**:

```
[STEP 1: USER INTERACTION]
Browser (App.jsx)
  │  User types into form inputs
  ▼
React State: form = { field1: '', field2: '', ... }
  │
  ▼ [fetch('/api/items', { method: 'POST', body: JSON.stringify(form) })]

[STEP 2: NETWORK & ROUTING]
HTTP Request arrives at Express (server.js)
  │  app.post('/api/items', (req, res) => ...)
  ▼
req.body contains { field1, field2, ... }

[STEP 3: ENRICHMENT & PERSISTENCE]
validateAndEnrich(req.body)
  │  AI logic computes: status / severity / recommendation
  ▼
MongoDB insert: db.collection.insertOne(item)
(or auto-saves to backend/data_fallback.json if Mongo is offline)
  │
  ▼ res.status(201).json(item)

[STEP 4: UI RE-RENDER]
React receives response -> loadData() -> setItems(data)
  │
  ▼
Table automatically displays new row with badges:
  <td>{item.field1}</td>
  <td><span className="badge">{item.field2}</span></td>
```

---

## ⚡ The 60-Second Exam Adaptation Rule

No matter how complex the question sounds, you **only edit 4 marked zones**:

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

### Practical Example: Sugar-Cane Irrigation Question
*Requirement: Manage sugarcane plots with Farmer, Plot Number, Soil Moisture %, Crop Stage, and AI Recommendation.*

| Zone | File | What to write |
|---|---|---|
| **Zone 1: Config** | `server.js` | `const PORT = 5000; const COLLECTION_NAME = 'plots';` |
| **Zone 2: Seed Schema** | `server.js` | `let memoryData = [{ id: '1', farmer: 'Ramesh', plot: 'P-101', moisture: 28, stage: 'Tillering' }];` |
| **Zone 3: Form Inputs** | `App.jsx` | Add `<input placeholder="Farmer Name">`, `<input type="number" placeholder="Moisture %">`, etc. |
| **Zone 4: Table Display** | `App.jsx` | Put `<th>Farmer</th><th>Plot</th><th>Moisture</th>` and `<td>{item.farmer}</td><td>{item.moisture}%</td>` |

---

## 🛡️ Quick Troubleshooting & Common Lab Exam Gotchas

### 1. "Port 5000 is already in use" (EADDRINUSE)
* **Cause:** Another node server is already running on port 5000 in another terminal or in the background.
* **Fix:** Change `PORT = 5000` to `PORT = 5050` in Zone 1 of `server.js`, or kill the process:
  ```powershell
  # Windows PowerShell:
  Get-Process node | Stop-Process -Force
  ```

### 2. "MongoDB is not running / connection refused"
* **Fix:** **Do nothing!** The Universal Template has a built-in offline fail-safe. If MongoDB is offline, it logs:
  `[MongoClient] MongoDB offline/unavailable. Seamless JSON fallback active.`
  All data will automatically save to `backend/data_fallback.json` without throwing any crash or unhandled rejection!

### 3. Faculty forbids Express (demands Core Node.js)
* **Fix:** Run the Core Node.js server instead:
  ```bash
  npm run template:core
  # or: node TEMPLATE_EXAM_STARTER/backend/server_core_node.js
  ```
  It has the exact same 4 change zones and saves to JSON using pure `http`, `url`, and `fs`!

---

## 🚀 How to Clone & Run Anywhere

To pull this entire master suite or the standalone template onto any college computer:

```bash
# Clone the complete project:
npx degit padhlemc/hw my-project
cd my-project
npm run template

# Or clone JUST the starter boilerplate:
npx degit padhlemc/hw/TEMPLATE_EXAM_STARTER my-exam
cd my-exam
npm start
```
