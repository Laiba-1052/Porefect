import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Droplet, User, Home, Calendar, FlaskRound as Flask, BookOpen, List, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function MainLayout({ children }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Routines', path: '/routines', icon: <Droplet size={20} /> },
    { name: 'Products', path: '/products', icon: <Flask size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <Calendar size={20} /> },
    { name: 'Reviews', path: '/reviews', icon: <BookOpen size={20} /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-lavender-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white shadow-md">
        <div className="flex items-center justify-center h-16 border-b">
          <Link to="/" className="flex items-center">
            <Droplet className="h-8 w-8 text-lavender-500" />
            <span className="ml-2 text-xl font-display font-bold text-lavender-700">Porefect</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-lavender-100 text-lavender-700'
                  : 'text-gray-600 hover:bg-lavender-50 hover:text-lavender-600'
              }`}
            >
              <span className={isActive(item.path) ? 'text-lavender-600' : 'text-gray-400'}>
                {item.icon}
              </span>
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        {currentUser && (
          <div className="p-4 border-t">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-lavender-200 flex items-center justify-center">
                <User size={20} className="text-lavender-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white w-full fixed z-10 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center">
            <Droplet className="h-8 w-8 text-lavender-500" />
            <span className="ml-2 text-xl font-display font-bold text-lavender-700">Porefect</span>
          </Link>
          
          <button 
            onClick={toggleMobileMenu}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-white shadow-lg rounded-b-lg py-2 px-3 space-y-1 animate-slide-down">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive(item.path)
                    ? 'bg-lavender-100 text-lavender-700'
                    : 'text-gray-600 hover:bg-lavender-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={isActive(item.path) ? 'text-lavender-600' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span className="ml-3 text-sm font-medium">{item.name}</span>
              </Link>
            ))}
            
            {currentUser && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <LogOut size={18} className="text-gray-400" />
                <span className="ml-3 font-medium">Sign Out</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 bg-lavender-50">
        <main className="py-6 px-4 md:px-8 md:pt-0 mt-16 md:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;