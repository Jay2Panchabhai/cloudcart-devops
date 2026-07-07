require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      'http://localhost:5173',
    credentials: true
  })
);

app.use(express.json());

app.use('/api/users', authRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'user-service'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `🚀 User Service running on port ${PORT}`
  );
});