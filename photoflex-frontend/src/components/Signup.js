import React, { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';

export default function Signup({ onSignup, onSwitch }) {
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    bio: 'Just another PhotoFlex user!',
    profilePicture: 'https://placehold.co/100x100/A855F7/ffffff?text=U',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Password strength calculation
  const getStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength(signupData.password);

  const strengthColors = {
    0: "bg-gray-300",
    1: "bg-red-500",
    2: "bg-yellow-500",
    3: "bg-blue-500",
    4: "bg-green-600",
  };

  const strengthLabels = {
    0: "",
    1: "Weak",
    2: "Fair",
    3: "Good",
    4: "Strong",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (signupData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    onSignup(signupData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">

        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="https://www.freeiconspng.com/thumbs/camera-icon/camera-icon-21.png"
            alt="PhotoFlex Logo"
            className="w-12 h-12 mx-auto mb-3"
          />
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">PhotoFlex</h1>
          <p className="text-gray-500">Join our creative community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
            Create Account
          </h2>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              required
              placeholder="Choose a username"
              value={signupData.username}
              onChange={(e) =>
                setSignupData({ ...signupData, username: e.target.value })
              }
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 transition"
              />

              {/* Show/Hide Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-500"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Password Strength Bar */}
            {signupData.password && (
              <div className="mt-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-2 ${strengthColors[strength]} transition-all`}
                    style={{ width: `${(strength / 4) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1 text-gray-600">
                  {strengthLabels[strength]}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPw ? "text" : "password"}
                required
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 transition"
              />

              {/* Show/Hide confirm password */}
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-4 top-4 text-gray-500"
              >
                {showConfirmPw ? <EyeOff /> : <Eye />}
              </button>

              {/* Green check if match */}
              {confirmPassword && signupData.password === confirmPassword && (
                <Check className="absolute right-12 top-4 text-green-600" />
              )}
            </div>

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="text-red-600 font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
