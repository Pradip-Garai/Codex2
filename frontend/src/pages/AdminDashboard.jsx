import React from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  { label: "Dashboard Home", path: "/admin/dashboard" },
  { label: "Create Problems", path: "/admin/create-problem" },
  { label: "Update Problems", path: "/admin/update-problem" },
  { label: "Delete Problems", path: "/admin/delete-problem" },
  { label: "Add Resourse", path: "/admin/add-resourse" },
  { label: "Show Users", path: "/admin/settings" },
  { label: "Logout", path: "/logout" }
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800 p-8 flex flex-col shadow-2xl relative overflow-hidden z-20">
        <div className="absolute -top-24 left-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="text-5xl font-extrabold mb-14 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-lg z-10">
          CODEX
        </div>
        <nav className="flex flex-col gap-3 mt-2 z-10">
          {menuItems.map(item => (
            <Link
              key={item.label}
              to={item.path}
              className="
                group flex items-center gap-4 py-3 px-5
                rounded-2xl
                bg-gradient-to-r from-gray-900/75 to-gray-800/85
                hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-400/10
                border border-gray-800/30
                shadow-sm
                transition-all duration-200
                font-semibold text-base relative
                focus:outline-none focus:ring-2 focus:ring-cyan-500/30
                hover:shadow-cyan-400/15
                hover:border-cyan-400/20
                cursor-pointer
              "
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
              <span className="text-gray-300 group-hover:text-cyan-400 transition-all duration-200">{item.label}</span>
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/0 to-blue-500/0 group-hover:from-cyan-400/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none"></span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-8 border-t border-gray-800/40 text-center text-xs text-gray-500 z-10">
          Admin Panel v1.0
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-black via-gray-950 to-black relative overflow-hidden">
        <div className="fixed top-1/5 right-1/5 w-96 h-96 bg-cyan-500/10 rounded-full blur-[72px]"></div>
        <div className="fixed bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-[52px]"></div>
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-12 py-7 border-b border-gray-800 bg-black/80 backdrop-blur-xl sticky top-0 z-20">
          <h1 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 drop-shadow-lg">
            Welcome, Admin
          </h1>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-400">Online</span>
          </div>
        </header>
        {/* Dashboard Cards */}
        <section className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {/* Create Problems Card */}
          <div className="bg-gradient-to-br from-cyan-950 via-black to-gray-950 border border-cyan-400/30 rounded-2xl p-9 shadow-2xl hover:shadow-cyan-400/30 hover:border-cyan-400/80 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute -right-7 -top-7 w-32 h-32 bg-cyan-400/10 rounded-full group-hover:scale-110 transition-transform duration-700 blur-lg"></div>
            <div className="relative">
              <div className="text-4xl mb-4">🆕</div>
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 drop-shadow-cyan-400/30">
                Create Problems
              </h2>
              <p className="text-gray-400 mb-5 text-lg">Add new exercises and challenges to your platform.</p>
              <Link
                to="/admin/create-problem"
                className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-cyan-400/40 font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                Create
              </Link>
            </div>
          </div>
          {/* Update Problems Card */}
          <div className="bg-gradient-to-br from-green-950 via-black to-gray-950 border border-green-400/30 rounded-2xl p-9 shadow-2xl hover:shadow-green-400/30 hover:border-green-400/80 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute -right-7 -top-7 w-32 h-32 bg-green-400/10 rounded-full group-hover:scale-110 transition-transform duration-700 blur-lg"></div>
            <div className="relative">
              <div className="text-4xl mb-4">🔄</div>
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 drop-shadow-green-400/30">
                Update Problems
              </h2>
              <p className="text-gray-400 mb-5 text-lg">Modify existing problem details and solutions.</p>
              <Link
                to="/admin/update-problem"
                className="inline-block bg-gradient-to-r from-green-500 to-emerald-700 hover:from-green-600 hover:to-emerald-800 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-green-400/40 font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                Update
              </Link>
            </div>
          </div>
          {/* Delete Problems Card */}
          <div className="bg-gradient-to-br from-red-950 via-black to-gray-950 border border-red-400/30 rounded-2xl p-9 shadow-2xl hover:shadow-red-400/30 hover:border-red-400/80 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute -right-7 -top-7 w-32 h-32 bg-red-400/10 rounded-full group-hover:scale-110 transition-transform duration-700 blur-lg"></div>
            <div className="relative">
              <div className="text-4xl mb-4">🗑️</div>
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300 drop-shadow-red-400/30">
                Delete Problems
              </h2>
              <p className="text-gray-400 mb-5 text-lg">Remove obsolete or incorrect problems from the list.</p>
              <Link
                to="/admin/delete-problem"
                className="inline-block bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-600 hover:to-rose-800 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-red-400/40 font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                Delete
              </Link>
            </div>
          </div>
          {/* Show Users Card */}
          <div className="bg-gradient-to-br from-yellow-950 via-black to-gray-950 border border-yellow-400/30 rounded-2xl p-9 shadow-2xl hover:shadow-yellow-400/30 hover:border-yellow-400/80 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute -right-7 -top-7 w-32 h-32 bg-yellow-400/10 rounded-full group-hover:scale-110 transition-transform duration-700 blur-lg"></div>
            <div className="relative">
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400 drop-shadow-yellow-400/30">
                Show Users
              </h2>
              <p className="text-gray-400 mb-5 text-lg">View and manage all registered users.</p>
              <Link
                to="/admin/users"
                className="inline-block bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-yellow-400/40 font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                Show
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
