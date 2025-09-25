import React, { useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { logoutUser } from '../../authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom'; // Import NavLink

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user,loading } = useSelector((state) => state.auth);
  
  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => toast.success("Logout Successful"))
  }

  return (
    <nav className="bg-black text-white md:h-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center space-x-2">
              <img
                src="/CODEX2.png"
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-2xl font-semibold text-white hidden sm:inline">
                CODEX
              </span>
            </NavLink>
          </div>

          {/* Center: Nav Menu (Hidden on mobile) */}
          <div className="hidden md:flex space-x-8">
            <NavLink 
              to="/practice-problems" 
              className={({ isActive }) => 
                `hover:text-blue-500 transition ${isActive ? "text-blue-500" : "text-white"}`
              }
            >
              Practice
            </NavLink>
            <NavLink 
              to="/learn" 
              className={({ isActive }) => 
                `hover:text-blue-500 transition ${isActive ? "text-blue-500" : "text-white"}`
              }
            >
              Learn
            </NavLink>
            <NavLink 
              to="/contest" 
              className={({ isActive }) => 
                `hover:text-blue-500 transition ${isActive ? "text-blue-500" : "text-white"}`
              }
            >
              Contest
            </NavLink>
            <NavLink 
              to="/interview" 
              className={({ isActive }) => 
                `hover:text-blue-500 transition ${isActive ? "text-blue-500" : "text-white"}`
              }
            >
              Interview
            </NavLink>
            <NavLink 
              to="/assessment" 
              className={({ isActive }) => 
                `hover:text-blue-500 transition ${isActive ? "text-blue-500" : "text-white"}`
              }
            >
              Assessment
            </NavLink>
            <NavLink 
              to="/pricing" 
              className={({ isActive }) => 
                `hover:text-blue-500 transition ${isActive ? "text-blue-500" : "text-white"}`
              }
            >
              Pricing
            </NavLink>
          </div>

          {/* Right: Avatar + Hamburger in Mobile */}
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <Menu as="div" className="relative inline-block text-left md:mr-[0.5rem]">
              <div>
                <Menu.Button className="flex items-center focus:outline-none">
                  <span className="px-4 py-2 rounded-md bg-black text-gray-200 text-sm font-semibold">
                    {user?.firstName || "User"}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </Menu.Button>
              </div>


              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-neutral-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">

                  {/* ✅ Admin option only if authenticated and admin */}
                {isAuthenticated && user?.role === "admin" && (
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        to="/admin-dashboard"
                        className={`block px-4 py-2 text-sm ${
                          active ? "bg-neutral-800 text-white" : "text-gray-300"
                        }`}
                      >
                        Admin Panel
                      </NavLink>
                    )}
                  </Menu.Item>
               )}

                  {/* Profile */}
                 <Menu.Item>
                   {({ active }) => (
                     <NavLink
                       to="/profile"
                       className={`block px-4 py-2 text-sm ${
                         active ? "bg-neutral-800 text-white" : "text-gray-300"
                       }`}
                     >
                       Profile
                     </NavLink>
                   )}
                 </Menu.Item>

                

               {/* Logout */}
             <Menu.Item>
               {({ active }) => (
              <button
                onClick={handleLogout}
                className={`w-full text-left block px-4 py-2 text-sm ${
                  active ? "bg-neutral-800 text-white" : "text-gray-300"
                }`}
              >
                Logout
              </button>
            )}
            </Menu.Item>
         </div>
         </Menu.Items>

              </Transition>
            </Menu>

            {/* Hamburger Icon */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden bg-black px-4 py-3 space-y-2">
          <NavLink 
            to="/practice-problems" 
            className={({ isActive }) => 
              `block hover:text-white ${isActive ? "text-blue-500" : "text-gray-300"}`
            }
            onClick={() => setIsOpen(false)}
          >
            Practice
          </NavLink>
          <NavLink 
            to="/learn" 
            className={({ isActive }) => 
              `block hover:text-white ${isActive ? "text-blue-500" : "text-gray-300"}`
            }
            onClick={() => setIsOpen(false)}
          >
            Learn
          </NavLink>
          <NavLink 
            to="/contest" 
            className={({ isActive }) => 
              `block hover:text-white ${isActive ? "text-blue-500" : "text-gray-300"}`
            }
            onClick={() => setIsOpen(false)}
          >
            Contest
          </NavLink>
          <NavLink 
            to="/interview" 
            className={({ isActive }) => 
              `block hover:text-white ${isActive ? "text-blue-500" : "text-gray-300"}`
            }
            onClick={() => setIsOpen(false)}
          >
            Interview
          </NavLink>
          <NavLink 
            to="/assessment" 
            className={({ isActive }) => 
              `block hover:text-white ${isActive ? "text-blue-500" : "text-gray-300"}`
            }
            onClick={() => setIsOpen(false)}
          >
            Assessment
          </NavLink>
          <NavLink 
            to="/pricing" 
            className={({ isActive }) => 
              `block hover:text-white ${isActive ? "text-blue-500" : "text-gray-300"}`
            }
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </NavLink>
        </div>
      )}
    </nav>
  );
}