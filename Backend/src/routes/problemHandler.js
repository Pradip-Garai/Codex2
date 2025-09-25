const express = require('express');
const ProblemRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const AuthValidation = require('../middleware/AuthValidation');
const { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblems, solvedAllProblembyUser, submittedProblems } = require('../controllers/problemAuth');


// create , update and delete problems with admin access
ProblemRouter.post('/create',adminMiddleware,createProblem);
ProblemRouter.put('/update/:id',adminMiddleware,updateProblem);
ProblemRouter.delete('/delete/:id',adminMiddleware,deleteProblem);


// fetch specific , all problems and solved by user with user access
ProblemRouter.get('/getAllProblems',AuthValidation,getAllProblems);
ProblemRouter.get('/getProblemById/:id',AuthValidation,getProblemById);
ProblemRouter.get('/problemSolvedByUser',AuthValidation,solvedAllProblembyUser);
ProblemRouter.get('/submittedProblem/:id',AuthValidation,submittedProblems);


module.exports = ProblemRouter; 