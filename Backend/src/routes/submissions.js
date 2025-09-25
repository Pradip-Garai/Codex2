const express = require('express');
const SubmitRouter = express.Router();
const AuthValidation = require('../middleware/AuthValidation');
const {submitCode, runCode} = require('../controllers/userSubmission');

SubmitRouter.post('/submit/:id', AuthValidation, submitCode);
SubmitRouter.post('/run/:id',AuthValidation,runCode);

module.exports = SubmitRouter;