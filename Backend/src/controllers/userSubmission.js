const Problem = require('../models/problems');
const Submission = require('../models/submission');
const {getLanguageById, submitBatch, submitToken} = require('../utils/ProblemUtility');

// submission code by user 
const submitCode = async (req,res)=>{

    try{
        const userId = req.user._id;
        const problemId = req.params.id;

        const {code,language} = req.body;

        // check validation  
        if(!code || !language || !userId || !problemId){
            return res.status(400).json({
                message : "Some Fields are Missing",
                success : false
            });
        }

        // fetch the problem from database 
        const problem  = await Problem.findById(problemId);

        /* now we can get testcases
         before sending the code to judeg0 i will store in db then status set pending 
         then send judge0 and after that store actuaal result , status in database 
         because suppoes Judeg0 give som error  for some reason, 
         then again user do not send the code */

        //  store code 
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status:'pending',
            testCasesTotal:problem.hiddenTestCases.length
        });

        //  now send this code to judge0
        const languageId  = getLanguageById(language);

        const submissions = problem.hiddenTestCases.map(testcase => ({
                source_code: code,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
        }));

        // Submit to Judge0
        const submitResult = await submitBatch(submissions);

        // Get tokens and check results
        const resultTokens = submitResult.map(item => item.token);
        const testResults = await submitToken(resultTokens);

        // updated submissionResult 
        let testcasePassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errormessage  = null;

        for(const test of testResults){
            if(test.status_id==3){
               testcasePassed++;
               runtime+=parseFloat(test.time);
               memory = Math.max(memory,test.memory);
            }else{
                if(test.status_id == 4){
                    status = 'error';
                    errormessage = test.stderr;
                }else{
                    status = 'wrong';
                    errormessage = test.stderr;
                }
            }
        }

        // store the result in database submission
        submittedResult.status = status;
        submittedResult.testCasesPassed = testcasePassed;
        submittedResult.errorMessage = errormessage;
        submittedResult.memory = memory;

        await submittedResult.save();


        // problem id insert into user schema in problemaSolved . if it is not present there
        if(!req.user.problemSolved.includes(problemId)){
            req.user.problemSolved.push(problemId); // in req.user have all data about user it is from middleware
            await req.user.save();
        }
        

        console.log(submittedResult);
        
        const accepted = (status === 'accepted');
        res.status(201).json({
           accepted,
           totalTestCases: submittedResult.testCasesTotal,
           passedTestCases: submittedResult.testCasesPassed,
           runtime,
           memory
        });




    }catch(err){
    console.error(err); // log full error
    res.status(500).json({
      message : err.message || "Internal Server Error",
      success: false
   });
  }
}

// run code 
const runCode = async(req,res)=>{
    try{
        const userId = req.user._id; 
        const problemId = req.params.id;

        const {code,language} = req.body;

        // check validation  
        if(!code || !language || !userId || !problemId){
            return res.status(400).json({
                message : "Some Fields are Missing",
                success : false
            });
        }

        // fetch the problem from database 
        const problem  = await Problem.findById(problemId);

        //  now send this code to judge0
        const languageId  = getLanguageById(language);

        const submissions = problem.visibleTestCases.map(testcase => ({
                source_code: code,
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

        res.status(201).send(testResults);

    }catch(err){
    console.error(err); // log full error
    res.status(500).json({
      message : err.message || "Internal Server Error",
      success: false
   });
  }
}

module.exports = {submitCode, runCode};