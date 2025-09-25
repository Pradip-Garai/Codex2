require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const DBConnect = require('./config/db');
const AuthRouter = require('./routes/auth');
const redisClient = require('./config/redis');
const ProblemRouter = require('./routes/problemHandler');
const SubmitRouter = require('./routes/submissions');
const ResourceAddRouter = require('./routes/resourseRoute'); // For adding resources


const app = express();




app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send("Server is running");
});
app.use('/user', AuthRouter);
app.use('/problem', ProblemRouter);
app.use('/submission', SubmitRouter);
app.use('/resource', ResourceAddRouter); // POST routes for adding resources


const InitlizeConnection = async () => {
  try {
    Promise.all([redisClient.connect(), DBConnect()]);
    console.log("Connected to DB");

    app.listen(process.env.PORT, () => {
      console.log(`Server Running at http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error : " + error);
  }
};

InitlizeConnection();

