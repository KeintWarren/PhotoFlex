import React from 'react';
import { LogOut, Menu } from 'lucide-react';

export default function Navbar({ currentUser, onLogout, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-30 bg-white shadow-md p-4 flex items-center justify-between">
      {/* Menu Toggle for Mobile */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src="https://www.freeiconspng.com/thumbs/camera-icon/camera-icon-21.png"
          alt="PhotoFlex Logo"
          className="w-8 h-8"
        />
        <span className="text-2xl font-extrabold text-gray-800 hidden sm:block">PhotoFlex</span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img
             src={currentUser.profilePicture}
             alt={currentUser.username}
             className="w-10 h-10 rounded-full object-cover ring-2 ring-gold-400"
           />
          <div className="hidden md:block">
            <p className="font-semibold text-gray-800 text-sm">{currentUser.username}</p>
            <p className="text-xs text-gray-500">
              {currentUser.email}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="p-2 rounded-full text-gray-600 hover:text-red-600 transition"
          title="Log Out"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}