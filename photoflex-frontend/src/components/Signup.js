import React, { useState } from 'react';
// import { Heart } from 'lucide-react'; // Remove Heart icon

export default function Signup({ onSignup, onSwitch }) {
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    bio: 'Just another PhotoFlex user!',
    profilePicture: 'https://placehold.co/100x100/A855F7/ffffff?text=U',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(signupData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4"> {/* Removed bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 */}
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          {/* New Logo Implementation */}
          <img
            src="https://www.freeiconspng.com/thumbs/camera-icon/camera-icon-21.png"
            alt="PhotoFlex Logo"
            className="w-12 h-12 mx-auto mb-3"
          />
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">PhotoFlex</h1>
          <p className="text-gray-500">Join our creative community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Create Account</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              required
              value={signupData.username}
              onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition" // Changed focus:ring-pink-500 to focus:ring-red-500
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition" // Changed focus:ring-pink-500 to focus:ring-red-500
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              required
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition" // Changed focus:ring-pink-500 to focus:ring-red-500
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition duration-300" // Changed pink/purple gradient to red
          >
            Create Account
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitch}
              className="text-red-600 font-semibold hover:underline" // Changed text-pink-600 to text-red-600
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}