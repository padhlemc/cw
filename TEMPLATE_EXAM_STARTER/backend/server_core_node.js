/**
 * ==============================================================================
 * CORE NODE.JS EXAM SERVER (Zero Express, Zero npm packages)
 * ==============================================================================
 * For questions specifically stating:
 * "Develop using Core Node.js using http, url, and fs modules without Express"
 *
 * Core Concepts Tested:
 * 1. http.createServer() to handle incoming requests & responses
 * 2. url.parse(req.url, true) to extract pathname and query strings
 * 3. fs.readFileSync / fs.writeFileSync to persist data without any database
 * 4. Streaming req.on('data') & req.on('end') to read POST request body
 * ==============================================================================
 */

// Step 1: Built-in Node modules ONLY (Zero npm install needed)
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'climate_data.json');

// Step 2: Auto-initialize dummy JSON file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  const seeds = [
    { id: '1', region: 'North', temperature: 42.5, humidity: 30 },
    { id: '2', region: 'South', temperature: 31.0, humidity: 75 }
  ];
  fs.writeFileSync(DATA_FILE, JSON.stringify(seeds, null, 2));
}

// Step 3: Create HTTP Server
const server = http.createServer((req, res) => {
  // Parse URL: parsed.pathname gives '/api/temperature', parsed.query gives query params
  const parsed = url.parse(req.url, true);

  // Set CORS headers so browser fetch() can communicate without errors
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle pre-flight browser OPTIONS check
  if (req.method === 'OPTIONS') return res.end();

  // ROUTE 1: GET /api/temperature -> Read from JSON file
  if (parsed.pathname === '/api/temperature' && req.method === 'GET') {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(data);
  }

  // ROUTE 2: POST /api/temperature -> Stream body, append, write back to file
  if (parsed.pathname === '/api/temperature' && req.method === 'POST') {
    let body = '';
    // Node streams incoming payload in chunks:
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const records = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      const newRecord = { id: String(Date.now()), ...JSON.parse(body) };
      records.push(newRecord);
      fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2));
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newRecord));
    });
    return;
  }

  // Default Fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint Not Found' }));
});

// Step 4: Start server
server.listen(PORT, () => {
  console.log(`[CORE NODE] Running at http://localhost:${PORT}`);
});
