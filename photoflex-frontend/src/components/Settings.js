import React, { useState } from 'react';
import { Save, User, Mail, Lock, Image, FileText } from 'lucide-react';

export default function Settings({ currentUser, setCurrentUser, apiFetch, setMessage }) {
  const [formData, setFormData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || '',
    password: '',
    bio: currentUser.bio || '',
    profilePicture: currentUser.profilePicture || 'https://placehold.co/100x100/A855F7/ffffff?text=U',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Build update data
      const updateData = {
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        profilePicture: formData.profilePicture,
        createdDate: currentUser.createdDate, // Preserve creation date
      };

      // Only include password if user wants to change it
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }
      // Don't include password field at all if not changing it

      console.log('Updating user with data:', updateData);

      const updatedUser = await apiFetch(`/users/${currentUser.userId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      console.log('Update successful:', updatedUser);

      // Update both local state and session storage
      setCurrentUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setFormData({ ...formData, password: '' }); // Clear password field
    } catch (e) {
      console.error('Failed to update profile:', e);
      setMessage({ type: 'error', text: `Failed to update profile: ${e.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-4">Account Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className={labelClass}>
              <User className="w-4 h-4"/> Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className={inputClass}
              placeholder="Your preferred username"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              <Mail className="w-4 h-4"/> Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className={inputClass}
              placeholder="Your email address"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={labelClass}>
              <Lock className="w-4 h-4"/> Change Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={inputClass}
              placeholder="Leave blank to keep current password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a new password only if you want to change it
            </p>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className={labelClass}>
              <FileText className="w-4 h-4"/> Bio
            </label>
            <textarea
              id="bio"
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className={inputClass + " resize-none"}
              placeholder="Tell us a little about yourself"
            />
          </div>

          {/* Profile Picture URL */}
          <div>
            <label htmlFor="profilePicture" className={labelClass}>
              <Image className="w-4 h-4"/> Profile Picture URL
            </label>
            <input
              type="url"
              id="profilePicture"
              value={formData.profilePicture}
              onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
              required
              className={inputClass}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use a direct link to an image (e.g., from Imgur, imgbb, or placehold.co)
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition duration-300 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-700'
              }`}
            >
              <Save className="w-5 h-5" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">
            <strong>Account Created:</strong>{' '}
            {new Date(currentUser.createdDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>User ID:</strong> {currentUser.userId}
          </p>
        </div>
      </div>
    </div>
  );
}