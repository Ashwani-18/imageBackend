const express = require('express');
const cors = require('cors');
require('dotenv').config(); // ✅ Load .env
const connectDB = require('./config/database');
const authRoute = require('./routes/authRoute');
const imageRoute = require('./routes/imageRoute');
const transactionRoute = require('./routes/transactionRoute');

const PORT = 5000;
const app = express();

connectDB();
app.use(express.json());
app.use(cors({
  origin: 'https://imagefrontend-1.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors({
  origin: 'https://imagefrontend-1.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/image', imageRoute);
app.use('/api/v1/transaction', transactionRoute);

app.get('/', (req, res) => {
  res.send({ message: "Welcome to ecommerce platform" });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
