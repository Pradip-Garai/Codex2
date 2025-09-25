// api/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const DBConnect = require('../config/db');
const AuthRouter = require('../routes/auth');
const redisClient = require('../config/redis');
const ProblemRouter = require('../routes/problemHandler');
const SubmitRouter = require('../routes/submissions');
const ResourceAddRouter = require('../routes/resourseRoute');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send("Server is running on Vercel 🚀");
});
app.use('/user', AuthRouter);
app.use('/problem', ProblemRouter);
app.use('/submission', SubmitRouter);
app.use('/resource', ResourceAddRouter);

// Initialize connections before handling requests
(async () => {
  try {
    await Promise.all([redisClient.connect(), DBConnect()]);
    console.log("Connected to Redis & DB");
  } catch (error) {
    console.error("Error connecting: " + error);
  }
})();

// Export the app for Vercel
module.exports = app;
