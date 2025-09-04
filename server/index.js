require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/tenants', require('./routes/tenants'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/rents', require('./routes/rents'));
app.use('/api/bank-deposits', require('./routes/bankDeposits'));
app.use('/api/reconciliation', require('./routes/reconciliation'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Serve frontend build
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, ()=> console.log('Server started on port', PORT));
