import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import {Modal,ModalContent,ModalHeader,ModalBody,ModalFooter} from '@heroui/modal';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {registerUser} from '../authSlice';
import { toast } from 'react-toastify';


// Schema Validation
const signUpSchema = z
  .object({
    firstName: z.string().min(3, "Name should contain at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password should be at least 6 characters"),
    reenterpassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.reenterpassword, {
    message: "Passwords do not match",
    path: ["reenterpassword"],
  });

function Signup() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isAuthenticated, loading, error} = useSelector((state)=>state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(()=>{
    if(isAuthenticated){
      navigate('/');
    }
  },[ isAuthenticated,navigate]);

  const onSubmit = (data) => {
     dispatch(registerUser(data))
    .unwrap()
    .then(() => toast.success("Signup Successful"))
    .catch(err => toast.error(err.message || "Signup failed"));
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onOpenModal = () => setIsModalOpen(true);
  const onCloseModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row items-center justify-center px-4 md:px-16 py-10 gap-10">

      {/* LEFT SIDE */}
      <div className="w-full md:w-[50%] flex flex-col items-center justify-center space-y-6 px-6 relative z-10">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/10 to-transparent blur-2xl z-0" />

        {/* Image */}
        <img
          src="/SignupImg.png"
          alt="Signup Illustration"
          className="w-4/5 max-w-md z-10"
        />

        {/* Text */}
        <h1 className="text-4xl font-extrabold text-white text-center z-10">
          Code. Learn. <span className="text-purple-400">Grow.</span>
        </h1>
        <p className="text-gray-400 text-center text-sm z-10 max-w-md">
          Dive into hands-on coding challenges and level up with real-time feedback.
        </p>
      </div>

      {/* RIGHT SIDE - FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-[40%] max-w-md p-0 space-y-6 z-10"
      >
        <h2 className="text-white text-4xl font-bold text-center mb-4">CODEX</h2>

        {/* First Name */}
        <div>
          <label className="block text-sm mb-1">First Name</label>
          <input
            {...register('firstName')}
            placeholder="Enter your first name"
            className="w-full bg-[#1a1a1a] text-white placeholder-gray-400 border border-gray-700 
              rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email Address</label>
          <input
            {...register('email')}
            placeholder="Enter your email"
            className="w-full bg-[#1a1a1a] text-white placeholder-gray-400 border border-gray-700 
              rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1">Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Set a password"
              className="w-full bg-[#1a1a1a] text-white placeholder-gray-400 border border-gray-700 
                rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
            />
            <div
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <div className="relative">
            <input
              {...register('reenterpassword')}
              type={showReenterPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              className="w-full bg-[#1a1a1a] text-white placeholder-gray-400 border border-gray-700 
                rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
            />
            <div
              onClick={() => setShowReenterPassword(prev => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              {showReenterPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>
          {errors.reenterpassword && (
            <p className="text-red-500 text-sm mt-1">{errors.reenterpassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          
          className="w-full bg-white text-black font-semibold py-3 rounded-md hover:bg-gray-200 transition-colors duration-200"
        >
          Sign up →
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline">
            Login
          </Link>
        </p>
      </form>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onOpenChange={onCloseModal}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Signup Successful!</ModalHeader>
              <ModalBody>
                <p>Welcome to CODEX 🎉</p>
                <p>Your account has been created successfully.</p>
              </ModalBody>
              <ModalFooter className="flex gap-3">
                <button
                  onClick={onCloseModal}
                  className="px-4 py-2 text-sm font-semibold text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition"
                >
                  Close
                </button>
                <Link to="/login">
                  <button
                    className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded hover:bg-purple-700 transition"
                  >
                    Go to Login
                  </button>
                </Link>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Signup;

