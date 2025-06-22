const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// CORS configuration to allow requests from your frontend domain
app.use(cors({
  origin: ['https://connect.measmony.me'],
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic health check endpoint
app.get('/api/hello', (req, res) => {
  res.json({ 
    message: 'Hello from backend!',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// Endpoint to receive messages from frontend
app.post('/api/message', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ 
      error: 'Message is required',
      response: 'Please provide a message in the request body'
    });
  }

  // Echo the message back with some processing
  const response = `Backend received: "${message}". Message length: ${message.length} characters.`;
  
  res.json({ 
    response,
    originalMessage: message,
    timestamp: new Date().toISOString()
  });
});

// Endpoint to get server time
app.get('/api/time', (req, res) => {
  const now = new Date();
  res.json({ 
    time: now.toISOString(),
    formatted: now.toLocaleString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
});

// Endpoint to get server info
app.get('/api/info', (req, res) => {
  res.json({
    server: 'Express.js Backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    availableRoutes: [
      'GET /api/hello',
      'POST /api/message',
      'GET /api/time',
      'GET /api/info'
    ]
  });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Available endpoints:`);
  console.log(`  GET  /api/hello - Health check`);
  console.log(`  POST /api/message - Send message to backend`);
  console.log(`  GET  /api/time - Get server time`);
  console.log(`  GET  /api/info - Get server info`);
});
