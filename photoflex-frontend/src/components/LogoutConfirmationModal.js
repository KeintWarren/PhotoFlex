import React from 'react';
import { LogOut, X, Camera } from 'lucide-react';

export default function LogoutConfirmationModal({ currentUser, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header with Logo */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Camera className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-extrabold text-white">PhotoFlex</h1>
          </div>
          <p className="text-red-100 text-sm">Logout Confirmation</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Profile */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={currentUser.profilePicture || "https://placehold.co/100x100/A855F7/FFFFFF?text=U"}
              alt={currentUser.username}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-yellow-400 shadow-lg mb-3"
            />
            <h2 className="text-xl font-bold text-gray-800">{currentUser.username}</h2>
            <p className="text-gray-600 text-sm">{currentUser.email}</p>
          </div>

          {/* Message */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
            <p className="text-gray-700 font-medium">
              Are you sure you want to log out?
            </p>
            <p className="text-gray-500 text-sm mt-1">
              You'll need to sign in again to access your account.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition"
            >
              <X className="w-5 h-5" />
              Go Back
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:shadow-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}