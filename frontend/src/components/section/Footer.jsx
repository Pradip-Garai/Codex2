import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
          {/* Logo and About */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className=" h-10 w-10 rounded-lg flex items-center justify-center mr-3">
                <img src='/CODEX2.png' />
              </div>
              <span className="text-xl font-bold text-white">CODEX</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              CodeMasterAI is on a mission to empower developers through real-world coding challenges, career-growth resources, and a vibrant community of creators.
            </p>
            <div className="flex space-x-4">
              {/* LinkedIn Icon */}
              <a href="#" className="bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.6-1.1 2-2.2 4.1-2.2 4.4 0 5.2 2.9 5.2 6.7V24h-4v-7.8c0-1.9-.03-4.3-2.6-4.3-2.6 0-3 2-3 4.1V24h-4V8z" />
                </svg>
              </a>

              {/* X (Twitter) Icon */}
              <a href="#" className="bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.162 1.845h-3.79L13.3 9.684 6.795 1.845H1.85l7.99 9.585L1.25 22.155h3.79l5.88-7.272 6.798 7.272h4.946l-8.23-9.867 8.728-10.443z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-gray-400 font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition">Challenges</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Learning Paths</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Competitions</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Leaderboard</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-gray-400 font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition">Docs</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Community Forum</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Help Center</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-gray-400 font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Press</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Partnerships</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p className="mb-4 md:mb-0">© 2025 CODEX. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition">Cookie Policy</a>
            <a href="#" className="hover:text-blue-400 transition">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
