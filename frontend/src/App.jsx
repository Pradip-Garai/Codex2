import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Contest from './pages/Contest'
import Interview from './pages/Interview'
import Pricing from './pages/Pricing'
import Assessment from './pages/Assesment'
import DSAProblems from './pages/DSAProblems'
import { useDispatch, useSelector } from 'react-redux'; 
import { checkAuth } from './authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminPanel from './pages/AdminPanel';
import ProblemPage from './pages/ProblemPage';
import AdminDashboard from './pages/AdminDashboard';
import AddResource from './components/section/AddResource'

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user,loading } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Dispatch checkAuth and mark when it's completed
    dispatch(checkAuth()).finally(() => {
      setAuthChecked(true);
    });
  }, [dispatch]);

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 animate-pulse"></div>
        <div className="relative flex flex-col items-center space-y-6">
          <h1 className="text-6xl font-extrabold tracking-widest text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.7)] animate-pulse">
            CODE<span className="text-blue-500">X</span>
          </h1>
          <div className="relative mt-6">
            <div className="w-28 h-28 rounded-full border-4 border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-400 text-sm uppercase tracking-[0.3em] animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} 
        />
        <Route 
          path="/learn" 
          element={isAuthenticated ? <Learn /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/contest" 
          element={isAuthenticated ? <Contest /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/interview" 
          element={isAuthenticated ? <Interview /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/pricing" 
          element={isAuthenticated ? <Pricing /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/assessment" 
          element={isAuthenticated ? <Assessment /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/practice-problems" 
          element={isAuthenticated ? <DSAProblems /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/admin-dashboard" 
          element={isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/"/>}
        />
        <Route 
          path="/admin/create-problem" 
          element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/"/>}
        />
        <Route 
          path="/problem/:problemId" 
          element={<ProblemPage />}  
        />
        <Route 
          path = "/admin/add-resourse"
          element ={<AddResource />}
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          borderRadius: "12px",
          background: "#0000",
          color: "#fff",
          fontWeight: "500",
          fontSize: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
        }}
        progressStyle={{
          background: "#4f46e5"
        }}
      />
    </>
  );
}

export default App;