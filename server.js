const express = require('express');
const app = express();

// Import the student routes
const studentsRoutes = require('./src/routes/studentRoutes'); // Adjust the path if necessary

// Middleware to parse JSON requests
app.use(express.json());

// Use the student routes for requests starting with /api/v1/students
app.use('/api/v1/students', (req, res, next) => {
  console.log('Students route accessed:', req.method, req.path);
  next();
}, studentsRoutes);

// Health check route
app.get('/healthcheck', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
const port = process.env.PORT || 3000; // Use PORT from .env, default to 3000
app.listen(5432, () => {
    console.log("Server running on port 5432");
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});