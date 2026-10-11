/**
 * ============================================================================
 * 🎓 CORE NODE.JS UNIVERSAL EXAM SERVER (Zero Express, Zero External Packages!)
 * ============================================================================
 * Meets University Lab Exam requirements for:
 * - Pure Node.js using ONLY built-in modules: http, url, fs, path
 * - URL-based RESTful services (GET, POST, PUT, DELETE)
 * - Query string parsing via 'url' module
 * - JSON-based file persistence via 'fs' module
 * - Full CORS headers and static frontend file serving
 *
 * Perfect for Problem Statement 1 (Regional Temperature Monitoring Dashboard)
 * and any lab question specifying "Core Node.js without Express".
 * ============================================================================
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

/* ============================================================================
 * ✏️ [CHANGE ZONE 1: CONFIGURATION & ENTITY]
 * Change the PORT and API prefix to match your question.
 * ============================================================================ */
const PORT = process.env.PORT || 5000;
const API_BASE = '/api/items'; // e.g. '/api/temperature' or '/api/items'
const DATA_FILE = path.join(__dirname, 'data_fallback.json');

/* ============================================================================
 * ✏️ [CHANGE ZONE 2: INITIAL DATA SCHEMA & SEED RECORDS]
 * Change the fields below to match your question entity.
 * (e.g. { id, region, temperature, humidity, recordedAt, status })
 * ============================================================================ */
let memoryData = [
  { id: '1', title: 'Sample Item Alpha', category: 'General', description: 'Core Node.js CRUD item', status: 'Active' },
  { id: '2', title: 'Sample Item Beta', category: 'Urgent', description: 'Second core item for testing', status: 'Pending' },
  { id: '3', title: 'Sample Item Gamma', category: 'General', description: 'Third core item for filtering', status: 'Completed' }
];

/* ============================================================================
 * ✏️ [CHANGE ZONE 3: OPTIONAL FIELD VALIDATION & AI LOGIC]
 * Put custom calculations or validations here (e.g., Heatwave severity or Irrigation).
 * ============================================================================ */
function validateAndEnrich(record) {
  // Example AI calculation / classification:
  // if (record.temperature > 40) record.severity = 'Extreme Heatwave';
  // else if (record.temperature > 35) record.severity = 'Moderate Heatwave';
  // else record.severity = 'Normal';
  return {
    ...record,
    updatedAt: new Date().toISOString()
  };
}

/* ============================================================================
 * 🔒 [PERSISTENCE HELPERS (FS MODULE)]
 * ============================================================================ */
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      memoryData = JSON.parse(content);
    } catch (e) {
      console.error('[CoreNode] Error loading JSON file:', e.message);
    }
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryData, null, 2), 'utf-8');
  } catch (e) {
    console.error('[CoreNode] Error writing JSON file:', e.message);
  }
}

// Initial load from file
loadData();

/* ============================================================================
 * 🔒 [REQUEST BODY PARSER (STREAM READER)]
 * Reads incoming JSON payload chunks from req stream.
 * ============================================================================ */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

/* ============================================================================
 * 🔒 [MIME TYPE RESOLVER FOR STATIC FRONTEND SERVING]
 * ============================================================================ */
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.jsx': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

/* ============================================================================
 * 🔒 [HTTP REQUEST ROUTER (CORE HTTP ENGINE)]
 * ============================================================================ */
const server = http.createServer(async (req, res) => {
  // Enable Universal CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Parse URL & Query parameters using 'url' module
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  const method = req.method;

  // JSON Response Helper
  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // --------------------------------------------------------------------------
  // API ROUTE 1: GET ALL (with query filtering & search)
  // --------------------------------------------------------------------------
  if (method === 'GET' && pathname === API_BASE) {
    let results = [...memoryData];

    // Query filter by category / region / status
    if (query.category && query.category !== 'All') {
      results = results.filter(i => i.category === query.category);
    }
    if (query.region && query.region !== 'All') {
      results = results.filter(i => i.region === query.region);
    }
    if (query.status && query.status !== 'All') {
      results = results.filter(i => i.status === query.status);
    }

    // Universal full-text search across all string fields
    if (query.search) {
      const q = query.search.toLowerCase();
      results = results.filter(item =>
        Object.values(item).some(val => typeof val === 'string' && val.toLowerCase().includes(q))
      );
    }

    return sendJson(200, results);
  }

  // --------------------------------------------------------------------------
  // API ROUTE 2: GET ONE BY ID (/api/items/:id)
  // --------------------------------------------------------------------------
  if (method === 'GET' && pathname.startsWith(`${API_BASE}/`)) {
    const id = pathname.replace(`${API_BASE}/`, '');
    const item = memoryData.find(i => String(i.id) === String(id));
    if (!item) return sendJson(404, { error: 'Record not found' });
    return sendJson(200, item);
  }

  // --------------------------------------------------------------------------
  // API ROUTE 3: CREATE RECORD (POST)
  // --------------------------------------------------------------------------
  if (method === 'POST' && pathname === API_BASE) {
    try {
      const body = await readJsonBody(req);
      const newRecord = validateAndEnrich({
        ...body,
        id: body.id || 'id_' + Date.now(),
        createdAt: new Date().toISOString()
      });

      memoryData.unshift(newRecord);
      saveData();
      return sendJson(201, newRecord);
    } catch (err) {
      return sendJson(400, { error: err.message });
    }
  }

  // --------------------------------------------------------------------------
  // API ROUTE 4: UPDATE RECORD (PUT /api/items/:id)
  // --------------------------------------------------------------------------
  if (method === 'PUT' && pathname.startsWith(`${API_BASE}/`)) {
    const id = pathname.replace(`${API_BASE}/`, '');
    const index = memoryData.findIndex(i => String(i.id) === String(id));
    if (index === -1) return sendJson(404, { error: 'Record not found' });

    try {
      const updates = await readJsonBody(req);
      const updated = validateAndEnrich({
        ...memoryData[index],
        ...updates,
        id
      });
      memoryData[index] = updated;
      saveData();
      return sendJson(200, updated);
    } catch (err) {
      return sendJson(400, { error: err.message });
    }
  }

  // --------------------------------------------------------------------------
  // API ROUTE 5: DELETE RECORD (DELETE /api/items/:id)
  // --------------------------------------------------------------------------
  if (method === 'DELETE' && pathname.startsWith(`${API_BASE}/`)) {
    const id = pathname.replace(`${API_BASE}/`, '');
    const initialLen = memoryData.length;
    memoryData = memoryData.filter(i => String(i.id) !== String(id));

    if (memoryData.length === initialLen) {
      return sendJson(404, { error: 'Record not found' });
    }
    saveData();
    return sendJson(200, { success: true, id });
  }

  // --------------------------------------------------------------------------
  // STATIC FRONTEND SERVING (Serves React Vite build or fallback)
  // --------------------------------------------------------------------------
  const distDir = path.join(__dirname, '..', 'frontend', 'dist');
  const frontendDir = fs.existsSync(distDir) ? distDir : path.join(__dirname, '..', 'frontend');
  let filePath = path.join(frontendDir, pathname === '/' ? 'index.html' : pathname);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(frontendDir, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    sendJson(404, { error: 'Resource not found' });
  }
});

/* ============================================================================
 * 🔒 [SERVER START]
 * ============================================================================ */
server.listen(PORT, () => {
  console.log('=================================================================');
  console.log(`[Core Node.js Server] Running at: http://localhost:${PORT}`);
  console.log(`Modules Used: http, url, fs, path (Zero External Dependencies)`);
  console.log(`API Base: http://localhost:${PORT}${API_BASE}`);
  console.log(`Offline Storage: ${DATA_FILE}`);
  console.log('=================================================================');
});
