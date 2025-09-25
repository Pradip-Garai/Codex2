const { getLanguageById, submitBatch, submitToken } = require('../utils/ProblemUtility');
const Problem = require('../models/problems');
const User = require('../models/users');
const Submission = require('../models/submission');


// Create Coding Problme by Admin
const createProblem = async (req, res) => {
    const { 
        title, 
        description, 
        difficulty, 
        tags,
        visibleTestCases, 
        hiddenTestCases, 
        startCode,
        referenceSolution 
    } = req.body;

    // Basic validation
    if (!title || !description || !difficulty || !referenceSolution || !visibleTestCases) {
        return res.status(400).json({ 
            message: "Missing required fields", 
            success: false 
        });
    }

    try {
        // Validate reference solution with test cases
        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language);
            if (!languageId) {
                return res.status(400).json({ 
                    message: `Unsupported language: ${language}`, 
                    success: false 
                });
            }

            // Prepare submissions for Judge0
            const submissions = visibleTestCases.map(testcase => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            // Submit to Judge0
            const submitResult = await submitBatch(submissions);
            
            // Get tokens and check results
            const resultTokens = submitResult.map(item => item.token);
            const testResults = await submitToken(resultTokens);

            console.log(testResults);

            // Check each test result
            for (const result of testResults) {
                if (!result.status) {
                    return res.status(500).json({ 
                        message: "Invalid response from Judge0", 
                        success: false 
                    });
                }

                switch (result.status.id) {
                    case 1: // In Queue
                    case 2: // Processing
                        return res.status(400).json({ 
                            message: `Solution is ${result.status.description.toLowerCase()}`, 
                            success: false 
                        });
                    case 3: // Accepted (do nothing)
                        break;
                    case 4: // Wrong Answer
                        return res.status(400).json({ 
                            message: `Wrong answer on test case`, 
                            success: false 
                        });
                    case 5: // Time Limit Exceeded
                        return res.status(400).json({ 
                            message: "Time limit exceeded", 
                            success: false 
                        });
                    case 6: // Compilation Error
                        return res.status(400).json({ 
                            message: `Compilation error: ${result.compile_output || result.stderr}`, 
                            success: false 
                        });
                    case 7: // Runtime Error
                        return res.status(400).json({ 
                            message: `Runtime error: ${result.stderr}`, 
                            success: false 
                        });
                    default:
                        return res.status(400).json({ 
                            message: `Unexpected result: ${result.status.description}`, 
                            success: false 
                        });
                }
            }
        }

        // All tests passed - save to database
        const newProblem = await Problem.create({
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution,
            problemContributor: req.user._id // Assuming user is attached to request
        });

        return res.status(201).json({ 
            message: "Problem created successfully", 
            success: true,
            problemId: newProblem._id 
        });

    } catch (error) {
        console.error("Error creating problem:", error);
        return res.status(500).json({ 
            message: error.message || "Internal server error", 
            success: false 
        });
    }
};

// Update Problme by Admin
const updateProblem = async (req,res) =>{
    const {id} = req.params;

    const { 
        title, 
        description, 
        difficulty, 
        tags,
        visibleTestCases, 
        hiddenTestCases, 
        startCode,
        referenceSolution 
    } = req.body;

    try{

        if(!id){
            return res.status(400).json({
                message:"Invalid Problem ID ",
                success:false
            });
        }

        const isIdPresent = await Problem.findById(id);
        if(!isIdPresent){
            return res.status(404).json({
                message:"Problem Not Found !!!",
                success:false
            });
        }

        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language);
            if (!languageId) {
                return res.status(400).json({ 
                    message: `Unsupported language: ${language}`, 
                    success: false 
                });
            }

            // Prepare submissions for Judge0
            const submissions = visibleTestCases.map(testcase => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            // Submit to Judge0
            const submitResult = await submitBatch(submissions);
            
            // Get tokens and check results
            const resultTokens = submitResult.map(item => item.token);
            const testResults = await submitToken(resultTokens);

            // Check each test result
            for (const result of testResults) {
                if (!result.status) {
                    return res.status(500).json({ 
                        message: "Invalid response from Judge0", 
                        success: false 
                    });
                }

                switch (result.status.id) {
                    case 1: // In Queue
                    case 2: // Processing
                        return res.status(400).json({ 
                            message: `Solution is ${result.status.description.toLowerCase()}`, 
                            success: false 
                        });
                    case 3: // Accepted (do nothing)
                        break;
                    case 4: // Wrong Answer
                        return res.status(400).json({ 
                            message: `Wrong answer on test case`, 
                            success: false 
                        });
                    case 5: // Time Limit Exceeded
                        return res.status(400).json({ 
                            message: "Time limit exceeded", 
                            success: false 
                        });
                    case 6: // Compilation Error
                        return res.status(400).json({ 
                            message: `Compilation error: ${result.compile_output || result.stderr}`, 
                            success: false 
                        });
                    case 7: // Runtime Error
                        return res.status(400).json({ 
                            message: `Runtime error: ${result.stderr}`, 
                            success: false 
                        });
                    default:
                        return res.status(400).json({ 
                            message: `Unexpected result: ${result.status.description}`, 
                            success: false 
                        });
                }
            }
        }

        const newProblems = await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators:true, new:true});

        res.status(200).json({
            message:"Problem Updated Successfull",
            success:true
        });



    }catch(err){
      res.status(400).json({
        message:err,
        success:true
      })
    }
}

// Delete Problme by Admin
const deleteProblem = async (req,res) =>{
    const {id}=req.params;
    
    try{
      
        if(!id){
            return res.status(404).json({
                message:"Missing Id",
                success:false
            });
        }

        const isIdExsits = await  Problem.findById(id);

        if(!isIdExsits){
            return res.status(404).json({
                message:"Problem Not Found",
                success:flase
            });
        }

        await Problem.findByIdAndDelete(id);
        res.status(200).json({
            message:"Problem Deleted Successfull",
            success:true
        })

    }catch(err){
       res.status(500).json({
            message:err,
            success:false
        })
    }
}

// Fetch Problem by ID
const getProblemById = async (req,res) =>{
    const {id}=req.params;
    
    try{
      
        if(!id){
            return res.status(404).json({
                message:"Missing Id",
                success:false
            });
        }

        // here come only those filds which selected
        const dsaProblems = await Problem.findById(id).select('_id title description difficulty tags  visibleTestCases startCode referenceSolution ');
        res.status(200).send(dsaProblems);

    }catch(err){
       res.status(500).json({
            message:err,
            success:false 
        })
    }
}

// Fetch All Problem 
const getAllProblems = async (req,res) =>{
    
    try{

        // here come only those filds which selected
        const allDsaProblems = await Problem.find({}).select('_id title difficulty tags');
        res.status(200).send(allDsaProblems);

    }catch(err){
       res.status(500).json({
            message:err,
            success:false
        })
    }
}


//  fetch solvedAll problem by each user 
const solvedAllProblembyUser = async(req,res)=>{
    try{ 
      
        const userID = req.user._id;
        const user = await User.findById(userID).populate({ // populate use when used schema ref
            path:"problemSolved",
            select:"_id title difficulty tags"
        });
        res.status(200).send(user);

    }catch(err){
        res.status(500).send("Server Error");
    }
}

// fetched submitted data;
const submittedProblems = async(req,res)=>{

    try{
        const userId = req.user._id;
        const problemId = req.params.pid;

        const ans = await Submission.find({userId,problemId});

        if(ans.length==0){
            return res.status(404).json({
                message : "No Submission",
                success: false
            });
        }
        res.status(200).json({
            message : ans,
            success : true
        });

    }catch(err){
        res.status(500).json({
            message : err.message || "Internal Server Error",
            success: false
        })
    }
}


module.exports = { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblems, solvedAllProblembyUser, submittedProblems };