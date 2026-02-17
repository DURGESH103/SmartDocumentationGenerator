import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-xl transition-all">
              <span className="text-white font-bold text-lg sm:text-xl">S</span>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
              SmartDoc
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/projects" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Projects
            </Link>
            <Link to="/upload" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Upload
            </Link>
            <Link to="/summarize" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Summarize
            </Link>
            
            <Link to="/upload">
              <button className="btn-primary text-sm">
                <span className="flex items-center space-x-2">
                  <span>New Project</span>
                  <span>+</span>
                </span>
              </button>
            </Link>

            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold hover:shadow-lg transition-all"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>
                  
                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-48 card py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login">
                  <button className="btn-primary text-sm">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            <Link
              to="/dashboard"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >
              Projects
            </Link>
            <Link
              to="/upload"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >
              Upload Project
            </Link>
            <Link
              to="/summarize"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >
              Summarize Document
            </Link>
            <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
              Profile
            </button>
            <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
              Settings
            </button>
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
