require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

// TEMPORARY: Seed all demo data
app.use('/api/seed', require('./routes/seedAll'));

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/tenants', require('./routes/tenants'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/rents', require('./routes/rents'));
app.use('/api/bank-deposits', require('./routes/bankDeposits'));
app.use('/api/reconciliation', require('./routes/reconciliation'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Serve frontend build from client/dist
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
