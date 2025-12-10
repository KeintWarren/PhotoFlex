import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, User, Settings, X } from 'lucide-react';

export default function Sidebar({ currentUser, isOpen, setIsOpen, navigate }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://www.freeiconspng.com/thumbs/camera-icon/camera-icon-21.png"
              alt="PhotoFlex Logo"
              className="w-8 h-8"
            />
            <h2 className="text-xl font-bold text-gray-800">PhotoFlex</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.profilePicture || 'https://placehold.co/48x48/AAA/fff?text=U'}
              alt={currentUser?.username}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-red-500"
            />
            <div>
              <p className="font-bold text-gray-800">{currentUser?.username}</p>
              <p className="text-sm text-gray-500">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl
                      font-semibold transition-all duration-200
                      ${
                        isActive
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © 2024 PhotoFlex. All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
}