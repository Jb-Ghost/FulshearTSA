const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = __dirname;
const messagesPath = path.join(rootDir, 'data', 'messages.json');
const eventsPath = path.join(rootDir, 'data', 'events.json');

const approvedUsers = {
  fhstsa: 'FulshearTSA2026',
  president: 'ClubLead2026',
  officer: 'EventAccess2026'
};

const sessions = new Map();

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readMessages() {
  return readJson(messagesPath, []);
}

function writeMessages(messages) {
  writeJson(messagesPath, messages);
}

function readEvents() {
  return readJson(eventsPath, []);
}

function writeEvents(events) {
  writeJson(eventsPath, events);
}

function findEventById(events, eventId) {
  return events.find(event => event.id === eventId) || null;
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function getToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  return req.headers['x-auth-token'] || '';
}

function getUserFromToken(token) {
  return sessions.get(token) || null;
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.mp4': return 'video/mp4';
    default: return 'application/octet-stream';
  }
}

function applyNoCacheHeaders(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (['.html', '.css', '.js'].includes(ext)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}

function serveStatic(req, res) {
  let pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const relativePath = decodeURIComponent(pathname).replace(/^\/+/, '');
  const filePath = path.join(rootDir, relativePath);
  const safePath = path.normalize(filePath);

  if (!safePath.startsWith(rootDir)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    applyNoCacheHeaders(res, safePath);
    res.writeHead(200, { 'Content-Type': getContentType(safePath) });
    fs.createReadStream(safePath).pipe(res);
    return;
  }

  const fallbackPath = path.join(rootDir, 'index.html');
  if (fs.existsSync(fallbackPath)) {
    applyNoCacheHeaders(res, fallbackPath);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(fallbackPath).pipe(res);
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/messages' && req.method === 'POST') {
    try {
      const payload = await parseJsonBody(req);
      const messages = readMessages();
      messages.push(payload);
      writeMessages(messages);
      sendJson(res, 200, { success: true, message: 'Saved' });
    } catch (error) {
      sendJson(res, 400, { success: false, error: 'Invalid payload' });
    }
    return;
  }

  if (url.pathname === '/api/messages' && req.method === 'GET') {
    sendJson(res, 200, readMessages());
    return;
  }

  if (url.pathname === '/api/events' && req.method === 'GET') {
    sendJson(res, 200, readEvents());
    return;
  }

  if (url.pathname.startsWith('/api/events/') && req.method === 'PUT') {
    try {
      const token = getToken(req);
      const user = getUserFromToken(token);
      if (!user) {
        sendJson(res, 401, { success: false, error: 'Login required' });
        return;
      }

      const eventId = decodeURIComponent(url.pathname.split('/').pop());
      const payload = await parseJsonBody(req);
      const title = String(payload.title || '').trim();
      const description = String(payload.description || '').trim();
      const date = String(payload.date || '').trim();

      if (!title || !date) {
        sendJson(res, 400, { success: false, error: 'Title and date are required' });
        return;
      }

      const events = readEvents();
      const event = findEventById(events, eventId);
      if (!event) {
        sendJson(res, 404, { success: false, error: 'Event not found' });
        return;
      }

      event.title = title;
      event.date = date;
      event.description = description;
      event.updatedBy = user;
      event.updatedAt = new Date().toISOString();
      events.sort((a, b) => a.date.localeCompare(b.date));
      writeEvents(events);
      sendJson(res, 200, { success: true, event });
    } catch (error) {
      sendJson(res, 400, { success: false, error: 'Invalid payload' });
    }
    return;
  }

  if (url.pathname.startsWith('/api/events/') && req.method === 'DELETE') {
    try {
      const token = getToken(req);
      const user = getUserFromToken(token);
      if (!user) {
        sendJson(res, 401, { success: false, error: 'Login required' });
        return;
      }

      const eventId = decodeURIComponent(url.pathname.split('/').pop());
      const events = readEvents();
      const index = events.findIndex(event => event.id === eventId);
      if (index === -1) {
        sendJson(res, 404, { success: false, error: 'Event not found' });
        return;
      }

      events.splice(index, 1);
      writeEvents(events);
      sendJson(res, 200, { success: true, deletedId: eventId });
    } catch (error) {
      sendJson(res, 400, { success: false, error: 'Invalid payload' });
    }
    return;
  }

  if (url.pathname === '/api/events' && req.method === 'POST') {
    try {
      const token = getToken(req);
      const user = getUserFromToken(token);
      if (!user) {
        sendJson(res, 401, { success: false, error: 'Login required' });
        return;
      }

      const payload = await parseJsonBody(req);
      const title = String(payload.title || '').trim();
      const description = String(payload.description || '').trim();
      const date = String(payload.date || '').trim();

      if (!title || !date) {
        sendJson(res, 400, { success: false, error: 'Title and date are required' });
        return;
      }

      const events = readEvents();
      const event = {
        id: `event-${Date.now()}`,
        title,
        date,
        description,
        createdBy: user,
        createdAt: new Date().toISOString()
      };
      events.push(event);
      events.sort((a, b) => a.date.localeCompare(b.date));
      writeEvents(events);
      sendJson(res, 200, { success: true, event });
    } catch (error) {
      sendJson(res, 400, { success: false, error: 'Invalid payload' });
    }
    return;
  }

  if (url.pathname === '/api/admin/login' && req.method === 'POST') {
    try {
      const payload = await parseJsonBody(req);
      const username = String(payload.username || '').trim();
      const password = String(payload.password || '').trim();
      if (approvedUsers[username] && approvedUsers[username] === password) {
        const token = crypto.randomBytes(24).toString('hex');
        sessions.set(token, username);
        sendJson(res, 200, { success: true, token, username });
      } else {
        sendJson(res, 401, { success: false, error: 'Invalid username or password' });
      }
    } catch (error) {
      sendJson(res, 400, { success: false, error: 'Invalid payload' });
    }
    return;
  }

  if (url.pathname === '/api/admin/me' && req.method === 'GET') {
    const token = getToken(req);
    const user = getUserFromToken(token);
    if (!user) {
      sendJson(res, 401, { success: false, error: 'Login required' });
      return;
    }
    sendJson(res, 200, { success: true, username: user });
    return;
  }

  serveStatic(req, res);
});

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || 3000);

server.listen(port, host, () => {
  console.log(`TSA site server running on http://localhost:${port}`);
  console.log(`Also reachable on your network at http://<your-computer-ip>:${port}`);
});
