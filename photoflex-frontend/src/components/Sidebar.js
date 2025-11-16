import React from 'react';
import { Home, User, Settings, X } from 'lucide-react';

export default function Sidebar({ view, setView, currentUser, isOpen, setIsOpen }) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavigation = (viewId) => {
    setView(viewId);
    setIsOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="p-4 flex items-center gap-3 border-b">
            <img
              src="https://www.freeiconspng.com/thumbs/camera-icon/camera-icon-21.png"
              alt="PhotoFlex Logo"
              className="w-8 h-8"
            />
            <span className="text-2xl font-extrabold text-gray-800">PhotoFlex</span>
          </div>

          {/* Current User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.profilePicture}
                alt={currentUser.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gold-400"
              />
              <div>
                <p className="font-bold text-gray-800">{currentUser.username}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = view === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <p className="text-xs text-gray-500 text-center">
              PhotoFlex © 2024
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}