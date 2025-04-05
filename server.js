const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

// Create an HTTP server that handles GET and POST requests.
const server = http.createServer((req, res) => {
  if ((req.method === 'GET') && req.url != `/spectator`) {
    // Serve client.html for any GET request.
    const filePath = path.join(__dirname, 'client.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading client.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if ((req.method === 'GET') && req.url === `/spectator`) {
    // Serve client.html for any GET request.
    const filePath = path.join(__dirname, 'spectator.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading spectator.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.method === 'POST' && req.url === '/spectator') {
    // Accumulate the request body.
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        // Parse the JSON payload.
        const data = JSON.parse(body);
        // Look for the event type in the JSON payload.
        const eventType = data.event;
        if (!eventType) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing "event" field in payload' }));
          return;
        }
        
        let message;
        switch (eventType) {
          case 'machineAdjustment':
            // Expect a string "text" and boolean "flag".
            message = JSON.stringify({
              label: 'machineAdjustment',
              winRates: data.winrates,
              adjustments: data.adjustments
            });
            break;
          case 'playerPosition':
            message = JSON.stringify({
              label: 'playerPosition',
              x: data.x,
              z: data.z,
              theta: data.theta,
            });
            console.log("recieved playerPosition")
            break;
          default:
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unknown event type' }));
            return;
        }
        
        // Broadcast the message to all connected WebSocket clients.
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/participant') {
    // Accumulate the request body.
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        // Parse the JSON payload.
        const data = JSON.parse(body);
        // Look for the event type in the JSON payload.
        const eventType = data.event;
        if (!eventType) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing "event" field in payload' }));
          return;
        }
        
        let message;
        switch (eventType) {
          case 'callRequest':
            // Expect a string "text" and boolean "flag".
            if (typeof data.text === 'string' && typeof data.flag === 'boolean') {
              message = JSON.stringify({
                label: 'callRequest',
                text: data.text,
                flag: data.flag
              });
            } else {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid parameters for callRequest: expected a string and a boolean' }));
              return;
            }
            break;
          case 'awareness':
            message = JSON.stringify({
              label: 'awareness',
              timestamp: Date.now()
            });
            break;
          case 'outcome':
            message = JSON.stringify({
              label: 'outcome',
              machine: data.machine,
              success: data.success
            });
            break;
          default:
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unknown event type' }));
            return;
        }
        
        // Broadcast the message to all connected WebSocket clients.
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    // If endpoint not found.
    res.writeHead(404);
    res.end();
  }
});

// Create a WebSocket server on top of the HTTP server.
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  ws.on('message', (message) => {
    console.log('Received:', message);
    // For demonstration, echo messages back to the sender.
    ws.send(`Echo: ${message}`);
  });
});

// Start the server on port 3000.
server.listen(3000, () => console.log('Server listening on port 3000'));
