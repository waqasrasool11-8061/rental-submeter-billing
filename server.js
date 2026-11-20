const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

// یقینی بنائیں کہ ڈیٹا ڈائریکٹری موجود ہے
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonFile(filename, defaultData) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
  }
  return defaultData;
}

function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

const server = http.createServer((req, res) => {
  // CORS ہیڈرز
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // 1. تمام ڈیٹا حاصل کرنے کا API اینڈ پوائنٹ
  if (req.method === 'GET' && pathname === '/api/data') {
    const data = {
      settings: readJsonFile('settings.json', {}),
      readings: readJsonFile('readings.json', []),
      ledger: readJsonFile('ledger.json', {}),
      bills: readJsonFile('bills.json', [])
    };
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
    return;
  }

  // 2. بل سیو کرنے کا API
  if (req.method === 'POST' && pathname === '/api/save-bill') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const bill = JSON.parse(body);
        let bills = readJsonFile('bills.json', []);
        const idx = bills.findIndex(b => b.month === bill.month);
        if (idx >= 0) {
          bills[idx] = bill;
        } else {
          bills.unshift(bill);
        }
        writeJsonFile('bills.json', bills);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Bill saved to database', bills }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // 3. سب میٹر ریڈنگ سیو کرنے کا API
  if (req.method === 'POST' && pathname === '/api/save-reading') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const newReading = JSON.parse(body);
        let readings = readJsonFile('readings.json', []);
        const idx = readings.findIndex(r => r.month.toLowerCase() === newReading.month.toLowerCase());
        if (idx >= 0) {
          readings[idx] = newReading;
        } else {
          readings.push(newReading);
        }
        writeJsonFile('readings.json', readings);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, readings }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // 4. جامد فائلز (Static files) پیش کرنا (index.html, demo.html)
  let filePath = path.join(__dirname, pathname === '/' ? 'demo.html' : pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'demo.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Rental Billing Server running at http://localhost:${PORT}`);
});
