import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from '../utils/axiosClient';
import confetti from "canvas-confetti";


// --- Modern, Professional Black Theme Classes ---
const panelClass = "bg-gradient-to-br from-black via-gray-900 to-black rounded-xl shadow-lg border border-gray-800";
const cardClass = "bg-black/80 backdrop-blur-lg rounded-lg shadow-sm border border-gray-800 hover:shadow-md transition";
const textFade = "text-gray-300";
const tabActiveClass = "tab tab-active font-bold bg-gray-900 text-white shadow";
const tabClass = "tab bg-transparent hover:bg-gray-800 text-gray-400";
const btnMain = "btn btn-sm px-5 py-2 rounded-lg font-medium border-gray-700 transition hover:scale-105 active:scale-95";
const btnPrimary = "bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-700 hover:bg-gray-700";
const btnDanger = "bg-gradient-to-r from-red-900 to-black text-red-300 border border-red-700 hover:bg-red-700";
const badgeClass = "badge rounded-full px-3 py-1 font-semibold bg-gray-900 text-gray-400 border border-gray-700 shadow";
const scrollbarClass = "scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-black";

// Difficulty badge color
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return "bg-green-800 text-green-400";
    case 'medium': return "bg-yellow-900 text-yellow-400";
    case 'hard': return "bg-red-900 text-red-400";
    default: return "bg-gray-900 text-gray-400";
  }
};

const launchConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
};


const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loadingProblem, setLoadingProblem] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoadingProblem(true);
      try {
        const response = await axiosClient.get(`/problem/getProblemById/${problemId}`);
        const initialCode =
          response.data.startCode.find(
            (sc) => sc.language.toLowerCase() === selectedLanguage.toLowerCase()
          )?.initialCode || '';
        setProblem(response.data);
        setCode(initialCode);
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoadingProblem(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode =
        problem.startCode.find(
          (sc) => sc.language.toLowerCase() === selectedLanguage.toLowerCase()
        )?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      const backendTestResults = response.data;
      const overallSuccess = backendTestResults.every(tc => tc.status_id === 3);
      const totalRuntime = backendTestResults.reduce((sum, tc) => sum + parseFloat(tc.time), 0).toFixed(3);
      const maxMemory = Math.max(...backendTestResults.map(tc => tc.memory));
      const formattedTestCases = backendTestResults.map(tc => ({
        stdin: tc.stdin,
        expected_output: tc.expected_output,
        stdout: tc.stdout,
        status_id: tc.status_id,
      }));
      setRunResult({
        success: overallSuccess,
        runtime: totalRuntime,
        memory: maxMemory,
        testCases: formattedTestCases,
      });
      setActiveRightTab('testcase');
    } catch (error) {
      setRunResult({
        success: false,
        error: error.response?.data?.message || 'Internal server error',
        testCases: [],
      });
      setActiveRightTab('testcase');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      setSubmitResult(response.data);
      setActiveRightTab('result');
    } catch (error) {
      setSubmitResult({
        accepted: false,
        error: 'Internal server error',
        passedTestCases: 0,
        totalTestCases: 0,
      });
      setActiveRightTab('result');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      case 'python': return 'python';
      case 'c': return 'c';
      default: return 'javascript';
    }
  };

  if (loadingProblem && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
    );
  }

  return (
    <div className={"h-screen flex bg-black " + textFade}>
      {/* Left Panel */}
      <div className={"w-1/2 flex flex-col " + panelClass}>
        {/* Tabs */}
        <div className="tabs px-4 pt-4 bg-black border-b border-gray-800 flex gap-2">
          {['description', 'editorial', 'solutions', 'submissions'].map(tab => (
            <button
              key={tab}
              className={activeLeftTab === tab ? tabActiveClass : tabClass}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className={"flex-1 overflow-y-auto p-6 " + scrollbarClass}>
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-3xl font-black text-white">{problem.title}</h1>
                    <div className={"badge " + getDifficultyColor(problem.difficulty)}>{problem.difficulty}</div>
                    <div className={badgeClass} style={{ height: "fit-content" }}>{problem.tags}</div>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-md leading-relaxed text-gray-300">{problem.description}</div>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 text-white">Examples:</h3>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div key={index} className={cardClass + " p-4"}>
                          <h4 className="font-semibold mb-2 text-white">Example {index + 1}:</h4>
                          <div className="space-y-2 text-sm font-mono">
                            <div><strong>Input:</strong> {example.input}</div>
                            <div><strong>Output:</strong> {example.output}</div>
                            <div><strong>Explanation:</strong> {example.explanation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeLeftTab === 'editorial' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-bold mb-4 text-white">Editorial</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-400">
                    {problem.editorial?.content || 'Editorial will be available later.'}
                  </div>
                </div>
              )}
              {activeLeftTab === 'solutions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-white">Solutions</h2>
                  <div className="space-y-6">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div key={index} className={cardClass + " border"}>
                        <div className="bg-black px-4 py-2 rounded-t-lg border-b border-gray-800">
                          <h3 className="font-semibold text-white">{problem?.title} - {solution?.language}</h3>
                        </div>
                        <div className="p-4">
                          <pre className="bg-gray-900 p-4 rounded text-sm overflow-x-auto text-gray-100"><code>{solution?.completeCode}</code></pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeLeftTab === 'submissions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-white">My Submissions</h2>
                  <div className="text-gray-500">Your submission history will appear here.</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Right Panel */}
      <div className={"w-1/2 flex flex-col " + panelClass}>
        <div className="tabs px-4 pt-4 bg-black border-b border-gray-800 flex gap-2">
          {['code', 'testcase', 'result'].map(tab => (
            <button
              key={tab}
              className={activeRightTab === tab ? tabActiveClass : tabClass}
              onClick={() => setActiveRightTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className={"flex-1 flex flex-col " + scrollbarClass}>
          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-black">
                <div className="flex gap-2">
                  {['javascript', 'java', 'cpp', 'python', 'c'].map((lang) => (
                    <button
                      key={lang}
                      className={btnMain + " " + (selectedLanguage === lang ? btnPrimary : "bg-transparent text-gray-400")}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: 'line',
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    mouseWheelZoom: true,
                  }}
                />
              </div>
              <div className="p-4 border-t border-gray-800 flex justify-between bg-black">
                <div className="flex gap-2">
                  <button className={btnMain + " " + btnDanger}
                    onClick={() => setActiveRightTab('testcase')}>
                    Console
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className={btnMain + " " + btnPrimary + (isRunning ? " loading" : "")}
                    onClick={handleRun}
                    disabled={isRunning || isSubmitting}
                  >
                    Run
                  </button>
                  <button
                    className={btnMain + " bg-blue-900 text-blue-200 border-blue-800 " + (isSubmitting ? " loading" : "")}
                    onClick={handleSubmitCode}
                    disabled={isRunning || isSubmitting}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4 text-white">Test Results</h3>
              {runResult ? (
                <div
                  className={cardClass + " border mb-4 " + (runResult.success ? "border-green-700" : "border-red-700")}
                >
                  <div>
                    {runResult.success ? (
                      <div>
                        <h4 className="font-bold text-green-400">✅ All test cases passed!</h4>
                        <p className="text-sm mt-2 text-gray-300">
                          Runtime: {runResult.runtime + ' sec'}
                        </p>
                        <p className="text-sm text-gray-300">
                          Memory: {runResult.memory + ' KB'}
                        </p>
                        <div className="mt-4 space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div
                              key={i}
                              className="bg-black/40 border border-green-700/40 rounded-xl p-4 mb-4 shadow-md shadow-green-900/20 backdrop-blur-sm hover:scale-[1.01] transition-transform"
                            >
                           <div className="font-mono space-y-2 text-sm text-gray-200">
                             <div className="flex justify-between">
                               <span className="font-semibold text-gray-300">Input:</span>
                               <span className="px-2 py-1 rounded bg-gray-800 text-gray-100">
                                 {tc.stdin}
                               </span>
                             </div>

                              <div className="flex justify-between">
                                <span className="font-semibold text-gray-300">Expected:</span>
                                <span className="text-green-400 font-semibold">{tc.expected_output}</span>
                              </div>

                              <div className="flex justify-between">
                                <span className="font-semibold text-gray-300">Output:</span>
                                <span className="text-green-400 font-semibold">{tc.stdout}</span>
                              </div>

                              <div className="flex items-center gap-2 pt-2">
                                <span className="text-green-500 text-lg">✔</span>
                                <span className="font-medium text-green-400">Passed</span>
                              </div>
                            </div>
                          </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-red-400">❌ Error</h4>
                        <div className="mt-4 space-y-2">
                          {runResult.testCases &&
                            runResult.testCases.map((tc, j) => (
                              <div
                                key={j}
                                className="bg-gray-900 p-3 rounded text-xs text-gray-100"
                              >
                                <div className="font-mono">
                                  <div><strong>Input:</strong> {tc.stdin}</div>
                                  <div><strong>Expected:</strong> {tc.expected_output}</div>
                                  <div><strong>Output:</strong> {tc.stdout}</div>
                                  <div
                                    className={
                                      tc.status_id === 3
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                    }
                                  >
                                    {tc.status_id === 3
                                      ? '✓ Passed'
                                      : '✗ Failed'}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Click "Run" to test your code with the example test cases.</div>
              )}
            </div>
          )}
          {activeRightTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4 text-white">Submission Result</h3>
              {submitResult ? (
                <div className={cardClass + " border " + (submitResult.accepted ? "border-green-700" : "border-red-700")}>
                  <div>
                    {submitResult.accepted ? (
                     <div className="p-6 rounded-2xl border border-green-600 bg-black/40 shadow-lg shadow-green-900/30 backdrop-blur-sm transition-transform hover:scale-[1.01]">
                      {/* Status Header */}
                      <div className="flex items-center gap-3">
                        <h4 className="font-extrabold text-2xl text-green-400 tracking-wide">
                          Accepted
                        </h4>
                      </div>

                   {/* Result Details */}
                   <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-200">
                     <div className="bg-black/30 rounded-lg p-3 border border-green-700/40">
                       <p className="text-sm text-gray-400">Test Cases</p>
                       <p className="text-lg font-semibold">
                         {submitResult.passedTestCases}/{submitResult.totalTestCases}
                       </p>
                     </div>
                     <div className="bg-black/30 rounded-lg p-3 border border-green-700/40">
                       <p className="text-sm text-gray-400">Runtime</p>
                       <p className="text-lg font-semibold">{submitResult.runtime} sec</p>
                     </div>
                     <div className="bg-black/30 rounded-lg p-3 border border-green-700/40">
                       <p className="text-sm text-gray-400">Memory</p>
                       <p className="text-lg font-semibold">{submitResult.memory} KB</p>
                     </div>
                      {/* Confetti Animation */}
                        {launchConfetti()}
                   </div>
                </div>

                    ) : (
                      <div>
                        <h4 className="font-bold text-lg text-red-400">❌ {submitResult.error}</h4>
                        <div className="mt-4 space-y-2 text-gray-300">
                          <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Click "Submit" to submit your solution for evaluation.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
