import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from "react-router";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../authSlice';
import { toast } from 'react-toastify';

// Schema Validation
const signUpSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password should be at least 6 characters"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signUpSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data))
    .unwrap()
    .then(() => toast.success("Login Successful"))
    .catch(err => toast.error(err.message || "Login failed"));
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="flex flex-col md:flex-row md:max-w-6xl w-full rounded-md overflow-hidden shadow-lg">
        {/* Left side - Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full md:w-1/2 bg-black p-8 space-y-6"
          style={{ borderRight: '1px solid #222' }}
        >
          <h2 className="text-white text-3xl font-bold text-center mb-6">Welcome Back</h2>

          {/* Email */}
          <div>
            <label className="block text-sm text-white mb-1">Email Address</label>
            <input
              {...register('email')}
              placeholder="Enter your email"
              className="w-full bg-[#1a1a1a] text-white placeholder-gray-400 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-white mb-1">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full bg-[#1a1a1a] text-white placeholder-gray-400 border border-gray-700 rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
              />
              <div
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </div>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Login →
          </button>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white hover:underline">
              Signup
            </Link>
          </p>
        </form>

        {/* Right side */}
        <div className="hidden md:flex flex-col justify-center items-center md:w-1/2 px-10 relative overflow-hidden bg-black">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-black opacity-50 -z-10" />
          <img src="/LoginImg.png" alt="Developer working" className="w-3/4 max-w-md z-10 drop-shadow-lg" />
          <h1 className="text-4xl font-bold text-white text-center mt-6 z-10">
            Welcome to <span className="text-purple-400">CODEX</span>
          </h1>
          <p className="text-gray-300 text-center mt-2 max-w-md z-10">
            Let’s get back to building. Access your account and continue your coding journey.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
