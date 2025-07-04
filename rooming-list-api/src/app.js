require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');

const app = express();
const roomingListRoutes = require('./routes/roomingListRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());

app.use('/api', roomingListRoutes);
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;