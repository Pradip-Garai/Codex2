import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Footer from '../components/section/Footer';
import Navbar from '../components/section/Navbar';

function DSAProblems() {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all',
    search: '',
  });

  // Animation states
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state - 10 problems per page
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 10;

  // Extract unique tags from problems
  const allTags = problems && Array.isArray(problems) 
    ? [...new Set(problems.flatMap(problem => 
        problem.tags ? problem.tags.split(',').map(tag => tag.trim()) : []
      ))]
    : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setIsLoading(true);

        // Fetch problems
        const problemsResponse = await axiosClient.get('/problem/getAllProblems');

        // Handle response format
        let problemsData = [];
        if (problemsResponse.data && Array.isArray(problemsResponse.data.message)) {
          problemsData = problemsResponse.data.message;
        } else if (Array.isArray(problemsResponse.data)) {
          problemsData = problemsResponse.data;
        } else {
          setError('Unexpected response format from server');
        }

        setProblems(problemsData);

        // Fetch solved problems if user is logged in
        if (user) {
          try {
            const solvedResponse = await axiosClient.get('/problem/problemSolvedByUser');
            let solvedData = [];
            if (solvedResponse.data && solvedResponse.data.problemSolved) {
              solvedData = solvedResponse.data.problemSolved;
            } else if (solvedResponse.data && Array.isArray(solvedResponse.data.message)) {
              solvedData = solvedResponse.data.message;
            } else if (Array.isArray(solvedResponse.data)) {
              solvedData = solvedResponse.data;
            } else if (solvedResponse.data && Array.isArray(solvedResponse.data.solvedProblems)) {
              solvedData = solvedResponse.data.solvedProblems;
            } else if (solvedResponse.data && Array.isArray(solvedResponse.data.data)) {
              solvedData = solvedResponse.data.data;
            }
            const solvedProblemIds = solvedData.map(sp => {
              if (sp._id) return sp._id;
              if (sp.id) return sp.id;
              return null;
            }).filter(id => id !== null);
            setSolvedProblems(solvedProblemIds);
          } catch (solvedError) { /* ignore non-critical */ }
        }
      } catch (error) {
        setError('Failed to fetch problems: ' + error.message);
      } finally {
        setLoading(false);
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    fetchData();
  }, [user]);

  // Filter problems with safety checks
  const filteredProblems =
    problems && Array.isArray(problems)
      ? problems.filter((problem) => {
          if (!problem) return false;

          const difficultyMatch =
            filters.difficulty === 'all' ||
            (problem.difficulty &&
              problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase());

          const tagMatch =
            filters.tag === 'all' ||
            (problem.tags &&
              problem.tags
                .toLowerCase()
                .split(',')
                .map((t) => t.trim())
                .includes(filters.tag.toLowerCase()));

          let statusMatch = true;
          if (filters.status === 'solved') {
            statusMatch = solvedProblems.includes(problem._id);
          } else if (filters.status === 'unsolved') {
            statusMatch = !solvedProblems.includes(problem._id);
          }
          
          const searchMatch = 
            filters.search === '' ||
            (problem.title && problem.title.toLowerCase().includes(filters.search.toLowerCase())) ||
            (problem.tags && problem.tags.toLowerCase().includes(filters.search.toLowerCase()));

          return difficultyMatch && tagMatch && statusMatch && searchMatch;
        })
      : [];

  // Pagination logic
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-gray-900/90 backdrop-blur-lg border border-red-800/50 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-red-900/10">
            <div className="flex items-start">
              <div className="bg-red-900/30 p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-red-400 text-lg">Connection Error</h3>
                <p className="text-red-300/90 mt-1">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 rounded-xl text-white font-medium transition-all shadow-lg shadow-red-900/30 hover:shadow-red-900/40"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-900/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-60 -left-40 w-80 h-80 bg-gray-900/10 rounded-full blur-3xl animate-pulse-medium"></div>
          <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-gray-800/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        {isLoading && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center transition-opacity duration-500">
            <div className="text-center">
              <div className="loader mb-6">
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
              </div>
               <h1 className="text-6xl font-extrabold tracking-widest text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.7)] animate-pulse">
               CODE<span className="text-blue-500">X</span>
               </h1>
              <p className="text-gray-400 text-lg font-light">Loading challenges...</p>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
          {/* Header with fade-in animation */}
          <div className="mb-10 text-center transform transition-all duration-700 opacity-0 animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent pb-2">
              Algorithm Challenges
            </h1>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              Master data structures and algorithms through curated challenges designed to enhance your problem-solving skills
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-5 mb-8 border border-gray-800 shadow-xl transform transition-all duration-500 hover:shadow-2xl hover:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search problems by title or tags..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent text-white placeholder-gray-500 transition"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <div className="flex space-x-2 bg-black p-1 rounded-lg">
                  {['all', 'solved', 'unsolved'].map((status) => (
                    <button
                      key={status}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${filters.status === status 
                        ? 'bg-gray-700 text-white shadow' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                      onClick={() => setFilters({ ...filters, status })}
                    >
                      {status === 'all' ? 'All' : status === 'solved' ? 'Solved' : 'Unsolved'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
                <div className="flex space-x-2 bg-black p-1 rounded-lg">
                  {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                    <button
                      key={difficulty}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${filters.difficulty === difficulty 
                        ? `${difficulty === 'easy' ? 'bg-green-800/70' : difficulty === 'medium' ? 'bg-yellow-800/70' : difficulty === 'hard' ? 'bg-red-800/70' : 'bg-gray-700'} text-white shadow` 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                      onClick={() => setFilters({ ...filters, difficulty })}
                    >
                      {difficulty === 'all' ? 'All' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tags</label>
                <select
                  className="w-full bg-black border border-gray-700 text-white rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
                  value={filters.tag}
                  onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                >
                  <option value="all">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag.toLowerCase()}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Reset Filters Button */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="px-5 py-2 rounded-lg bg-black hover:bg-gray-700 text-gray-200 font-semibold border border-gray-700 shadow transition"
                onClick={() => setFilters({ difficulty: 'all', tag: 'all', status: 'all', search: '' })}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Stats with staggered animation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/60 backdrop-blur-sm p-4 rounded-xl border border-gray-800 flex flex-col items-center transform transition-all duration-500 hover:scale-105 hover:border-gray-700 stats-card">
              <span className="text-2xl font-bold text-white">{problems.length}</span>
              <span className="text-gray-400 text-sm mt-1">Total Problems</span>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm p-4 rounded-xl border border-gray-800 flex flex-col items-center transform transition-all duration-500 hover:scale-105 hover:border-gray-700 stats-card">
              <span className="text-2xl font-bold text-white">{filteredProblems.length}</span>
              <span className="text-gray-400 text-sm mt-1">Filtered</span>
            </div>
            {user && (
              <div className="bg-gray-900/60 backdrop-blur-sm p-4 rounded-xl border border-gray-800 flex flex-col items-center transform transition-all duration-500 hover:scale-105 hover:border-gray-700 stats-card">
                <span className="text-2xl font-bold text-green-400">{solvedProblems.length}</span>
                <span className="text-gray-400 text-sm mt-1">Solved</span>
              </div>
            )}
            <div className="bg-gray-900/60 backdrop-blur-sm p-4 rounded-xl border border-gray-800 flex flex-col items-center transform transition-all duration-500 hover:scale-105 hover:border-gray-700 stats-card">
              <span className="text-2xl font-bold text-blue-400">{allTags.length}</span>
              <span className="text-gray-400 text-sm mt-1">Unique Tags</span>
            </div>
          </div>
          {/* Problems List - 10 per page */}
          <div className="grid grid-cols-1 gap-5 mb-8">
            {currentProblems.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/70 rounded-2xl mb-5">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg text-gray-400">No problems match your current filters</p>
                <p className="text-sm mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
                <button 
                  onClick={() => setFilters({ difficulty: 'all', tag: 'all', status: 'all', search: '' })}
                  className="mt-5 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              currentProblems.map((problem, index) => (
                <div
                  key={problem._id}
                  className="group bg-gradient-to-br from-gray-900/80 to-black backdrop-blur-md border border-gray-800 rounded-2xl p-6 transition-all hover:border-gray-700 hover:shadow-2xl hover:shadow-gray-900/20 relative overflow-hidden transform hover:-translate-y-1 problem-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Subtle accent glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-800/10 to-gray-700/10 opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <NavLink
                            to={`/problem/${problem._id}`}
                            className="text-xl font-semibold text-white hover:text-gray-300 transition-colors"
                          >
                            {problem.title || 'Untitled Problem'}
                          </NavLink>
                          {solvedProblems.includes(problem._id) && (
                            <span className="text-green-400 text-xs font-semibold bg-green-900/30 px-2.5 py-1 rounded-full flex items-center shadow-lg shadow-green-900/10">
                              <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Solved
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase ${
                              problem.difficulty?.toLowerCase() === 'easy'
                                ? 'bg-green-900/40 text-green-300 shadow-lg shadow-green-900/10'
                                : problem.difficulty?.toLowerCase() === 'medium'
                                ? 'bg-yellow-900/40 text-yellow-300 shadow-lg shadow-yellow-900/10'
                                : problem.difficulty?.toLowerCase() === 'hard'
                                ? 'bg-red-900/40 text-red-300 shadow-lg shadow-red-900/10'
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {problem.difficulty || 'Unknown'}
                          </div>
                          {problem.tags &&
                            problem.tags
                              .split(',')
                              .map((tag) => (
                                <div
                                  key={tag}
                                  className="text-xs font-medium px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full shadow-lg shadow-gray-900/10"
                                >
                                  {tag.trim()}
                                </div>
                              ))}
                        </div>
                      </div>
                      <NavLink
                        to={`/problem/${problem._id}`}
                        className="px-5 py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-xl text-white font-medium transition-all shadow-lg shadow-gray-900/30 hover:shadow-gray-900/40 flex items-center justify-center group/btn"
                      >
                        <span>Solve</span>
                        <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {filteredProblems.length > problemsPerPage && (
            <div className="flex justify-center mt-8">
              <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 shadow-xl">
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-xl border ${
                      currentPage === 1
                        ? 'bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-800/70 border-gray-700 text-white hover:bg-gray-700/50 hover:border-gray-600 transition'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        currentPage === number
                          ? 'bg-gray-700 text-white shadow-lg shadow-gray-900/30'
                          : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  {/* Next Button */}
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-xl border ${
                      currentPage === totalPages
                        ? 'bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-800/70 border-gray-700 text-white hover:bg-gray-700/50 hover:border-gray-600 transition'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSlow {
          0% { opacity: 0.3; }
          50% { opacity: 0.5; }
          100% { opacity: 0.3; }
        }
        @keyframes pulseMedium {
          0% { opacity: 0.4; }
          50% { opacity: 0.6; }
          100% { opacity: 0.4; }
        }
        .animate-fade-in { animation: fadeIn 1s ease forwards; }
        .animate-pulse-slow { animation: pulseSlow 8s infinite; }
        .animate-pulse-medium { animation: pulseMedium 6s infinite; }
        .problem-card { opacity: 0; animation: fadeIn 0.5s ease forwards; }
        .stats-card { opacity: 0; animation: fadeIn 0.5s ease forwards; }
        .stats-card:nth-child(1) { animation-delay: 0.1s; }
        .stats-card:nth-child(2) { animation-delay: 0.2s; }
        .stats-card:nth-child(3) { animation-delay: 0.3s; }
        .stats-card:nth-child(4) { animation-delay: 0.4s; }
        .loader { display: inline-block; position: relative; width: 80px; height: 80px; }
        .loader-square { position: absolute; border: 4px solid #4b5563; opacity: 1; border-radius: 50%; animation: loader 1s cubic-bezier(0, 0.2, 0.8, 1) infinite; }
        .loader-square:nth-child(2) { animation-delay: -0.5s; }
        @keyframes loader {
          0% { top: 36px; left: 36px; width: 0; height: 0; opacity: 0; }
          4.9% { top: 36px; left: 36px; width: 0; height: 0; opacity: 0; }
          5% { top: 36px; left: 36px; width: 0; height: 0; opacity: 1; }
          100% { top: 0px; left: 0px; width: 72px; height: 72px; opacity: 0; }
        }
      `}</style>
    </>
  );
}

export default DSAProblems;
