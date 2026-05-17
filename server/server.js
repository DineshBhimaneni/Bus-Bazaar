require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Test database connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database tables
const User = require('./models/User');
User.createUsersTable();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'APSRTC Backend is running successfully!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
