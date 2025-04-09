const WebSocket = require('ws');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

// HTTP server for Railway health checks
app.get('/', (req, res) => {
  res.send('Tank Camera Server');
});

// Create the HTTP server (no need to listen separately for WebSocket)
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket Server: This will work with the same HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New ESP32 Camera Connected');

  ws.on('message', (data) => {
    // Broadcast to all clients (e.g., React Native apps)
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    console.log('ESP32 Camera Disconnected');
  });
});
