const express = require('express');
const app = express();
const giftRoutes = require('./routes/admin/giftRoutes');

// Middleware and other routes
// ...existing code...

// Add routes
app.use('/api/admin', giftRoutes);

// Error handling and other configurations
// ...existing code...

module.exports = app;