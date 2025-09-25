import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Updated Zod schema with backend-supported language codes
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum([
    'array', 'string', 'linkedList', 'tree', 'graph',
    'dynamicProgramming', 'math', 'hashTable', 'binarySearch',
    'sorting', 'greedy', 'backtracking', 'stack', 'queue',
    'heap', 'recursion', 'divideAndConquer', 'bitManipulation'
  ]),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['cpp', 'java', 'javascript', 'python', 'c']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(5, 'All five languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['cpp', 'java', 'javascript', 'python', 'c']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(5, 'All five languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'cpp', initialCode: '' },
        { language: 'java', initialCode: '' },
        { language: 'javascript', initialCode: '' },
        { language: 'python', initialCode: '' },
        { language: 'c', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'cpp', completeCode: '' },
        { language: 'java', completeCode: '' },
        { language: 'javascript', completeCode: '' },
        { language: 'python', completeCode: '' },
        { language: 'c', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    console.log('Submit triggered with data:', data); // Debug log
    setIsSubmitting(true);
    try {
      const response = await axiosClient.post('/problem/create', data);
      console.log('API success:', response); // Debug log
      toast.success('Problem created successfully!');
      navigate('/practice-problems');
    } catch (error) {
      console.error('API error:', error); // Debug log
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    document.body.classList.add('bg-black');
    return () => {
      document.body.classList.remove('bg-black');
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-3">
            Create New Problem
          </h1>
          <p className="text-gray-400 text-lg">Design a coding challenge for the platform</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Basic Information */}
          <section className="bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-800 hover:shadow-purple-700/40 transition-shadow duration-300">
            <div className="flex items-center mb-8">
              <div className="bg-blue-600/20 p-3 rounded-xl mr-4 flex items-center justify-center w-12 h-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Basic Information</h2>
            </div>

            <div className="space-y-7">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  {...register('title')}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.title ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Enter problem title"
                />
                {errors.title && (
                  <p className="text-red-500 mt-1 text-sm flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  {...register('description')}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-40 ${
                    errors.description ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Describe the problem in detail"
                />
                {errors.description && (
                  <p className="text-red-500 mt-1 text-sm flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                  <select
                    {...register('difficulty')}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.difficulty ? 'border-red-500' : 'border-gray-700'
                    }`}
                  >
                    <option value="easy" className="bg-gray-800 text-green-400">Easy</option>
                    <option value="medium" className="bg-gray-800 text-yellow-400">Medium</option>
                    <option value="hard" className="bg-gray-800 text-red-400">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tag</label>
                  <select
                    {...register('tags')}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.tags ? 'border-red-500' : 'border-gray-700'
                    }`}
                  >
                    <option value="array" className="bg-gray-800">Array</option>
                    <option value="string" className="bg-gray-800">String</option>
                    <option value="linkedList" className="bg-gray-800">Linked List</option>
                    <option value="tree" className="bg-gray-800">Tree</option>
                    <option value="graph" className="bg-gray-800">Graph</option>
                    <option value="dynamicProgramming" className="bg-gray-800">Dynamic Programming</option>
                    <option value="math" className="bg-gray-800">Math</option>
                    <option value="hashTable" className="bg-gray-800">Hash Table</option>
                    <option value="binarySearch" className="bg-gray-800">Binary Search</option>
                    <option value="sorting" className="bg-gray-800">Sorting</option>
                    <option value="greedy" className="bg-gray-800">Greedy</option>
                    <option value="backtracking" className="bg-gray-800">Backtracking</option>
                    <option value="stack" className="bg-gray-800">Stack</option>
                    <option value="queue" className="bg-gray-800">Queue</option>
                    <option value="heap" className="bg-gray-800">Heap</option>
                    <option value="recursion" className="bg-gray-800">Recursion</option>
                    <option value="divideAndConquer" className="bg-gray-800">Divide &amp; Conquer</option>
                    <option value="bitManipulation" className="bg-gray-800">Bit Manipulation</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Test Cases */}
          <section className="bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-800 hover:shadow-green-700/40 transition-shadow duration-300">
            <div className="flex items-center mb-8">
              <div className="bg-green-600/20 p-3 rounded-xl mr-4 flex items-center justify-center w-12 h-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Test Cases</h2>
            </div>

            {/* Visible Test Cases */}
            <div className="space-y-7 mb-10">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-xl text-white">Visible Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-transform duration-300 transform hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Visible Case
                </button>
              </div>

              {visibleFields.map((field, index) => (
                <div key={field.id} className="bg-gray-800 p-6 rounded-2xl space-y-4 border border-gray-700 hover:border-blue-500/50 transition-colors duration-300">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-300">Test Case #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeVisible(index)}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold py-1 px-3 rounded-lg transition-colors duration-300 flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">Input</label>
                      <input
                        {...register(`visibleTestCases.${index}.input`)}
                        placeholder="Test input"
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">Output</label>
                      <input
                        {...register(`visibleTestCases.${index}.output`)}
                        placeholder="Expected output"
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Explanation</label>
                    <textarea
                      {...register(`visibleTestCases.${index}.explanation`)}
                      placeholder="Explanation of the test case"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Hidden Test Cases */}
            <div className="space-y-7">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-xl text-white">Hidden Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-transform duration-300 transform hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Hidden Case
                </button>
              </div>

              {hiddenFields.map((field, index) => (
                <div key={field.id} className="bg-gray-800 p-6 rounded-2xl space-y-4 border border-gray-700 hover:border-green-500/50 transition-colors duration-300">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-300">Hidden Test Case #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeHidden(index)}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold py-1 px-3 rounded-lg transition-colors duration-300 flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">Input</label>
                      <input
                        {...register(`hiddenTestCases.${index}.input`)}
                        placeholder="Test input"
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">Output</label>
                      <input
                        {...register(`hiddenTestCases.${index}.output`)}
                        placeholder="Expected output"
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Code Templates */}
          <section className="bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-800 hover:shadow-purple-700/40 transition-shadow duration-300">
            <div className="flex items-center mb-8">
              <div className="bg-purple-700/20 p-3 rounded-xl mr-4 flex items-center justify-center w-12 h-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Code Templates</h2>
            </div>

            <div className="space-y-8">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="space-y-6 bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-purple-500/60 transition-colors duration-300">
                  <h3 className="font-semibold text-xl text-white border-b border-gray-700 pb-3">
                    {index === 0 ? 'C++' :
                      index === 1 ? 'Java' :
                        index === 2 ? 'JavaScript' :
                          index === 3 ? 'Python' : 'C'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Initial Code</label>
                      <textarea
                        {...register(`startCode.${index}.initialCode`)}
                        className="w-full bg-gray-700 rounded-xl p-4 font-mono text-sm text-white focus:outline-none resize-none transition"
                        rows={10}
                        spellCheck="false"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Reference Solution</label>
                      <textarea
                        {...register(`referenceSolution.${index}.completeCode`)}
                        className="w-full bg-gray-700 rounded-xl p-4 font-mono text-sm text-white focus:outline-none resize-none transition"
                        rows={10}
                        spellCheck="false"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-800 hover:to-blue-700 text-white font-extrabold py-4 rounded-3xl transition-transform duration-500 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Problem...
              </>
            ) : (
              'Create Problem'
            )}
          </button>
        </form>
      </div>

     <style>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }
  body {
    background-color: #000000;
  }
`}</style>

    </div>
  );
}

export default AdminPanel;
