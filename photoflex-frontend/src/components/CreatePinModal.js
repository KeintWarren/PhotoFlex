import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

export default function CreatePinModal({ currentUser, boards, apiFetch, setMessage, onClose, onPinCreated }) {
  const [newPin, setNewPin] = useState({
    title: '',
    description: '',
    imageURL: 'https://placehold.co/600x400/3B82F6/ffffff?text=Image+URL',
    boardId: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPin.boardId) {
      setMessage({ type: 'error', text: 'Please select a board!' });
      return;
    }

    try {
      // Create pin with proper nested objects
      const pinToSave = {
        title: newPin.title,
        description: newPin.description,
        imageURL: newPin.imageURL,
        user: { userId: currentUser.userId },
        board: { boardId: parseInt(newPin.boardId) },
        createdDate: new Date().toISOString(),
      };

      const createdPin = await apiFetch('/pins', {
        method: 'POST',
        body: JSON.stringify(pinToSave),
      });

      setMessage({ type: 'success', text: `Pin "${createdPin.title}" created!` });
      onPinCreated(createdPin);
    } catch (e) {
      console.error('Failed to create pin:', e);
      setMessage({ type: 'error', text: 'Failed to create pin.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition p-2 rounded-full" /* Changed hover color to red */
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Create New Pin</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={newPin.title}
              onChange={(e) => setNewPin({ ...newPin, title: e.target.value })}
              required
              placeholder="Give your pin a title"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition" /* Changed focus:ring-purple-500 to focus:ring-red-500 */
            />
          </div>

          {/* Board Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Board</label>
            <select
              value={newPin.boardId}
              onChange={(e) => setNewPin({ ...newPin, boardId: e.target.value })}
              className={`w-full p-4 border rounded-xl transition appearance-none ${
                newPin.boardId ? 'border-gray-300' : 'border-red-400 bg-red-50'
              }`}
            >
              <option value="">Choose a Board...</option>
              {boards.map((board) => (
                <option key={board.boardId} value={board.boardId}>
                  {board.title}
                </option>
              ))}
            </select>
            {boards.length === 0 && (
              <p className="text-sm text-red-500 mt-2">You must create a board first!</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              value={newPin.description}
              onChange={(e) => setNewPin({ ...newPin, description: e.target.value })}
              rows="3"
              placeholder="Tell us about your pin"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition" /* Changed focus:ring-purple-500 to focus:ring-red-500 */
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 text-red-600" /> {/* Changed icon color to red */}
              Image URL
            </label>
            <input
              type="url"
              value={newPin.imageURL}
              onChange={(e) => setNewPin({ ...newPin, imageURL: e.target.value })}
              required
              placeholder="https://example.com/image.jpg"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition" /* Changed focus:ring-purple-500 to focus:ring-red-500 */
            />

            {/* Image Preview */}
            <div className="mt-4 h-64 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-gray-200">
              <img
                src={newPin.imageURL}
                alt="Preview"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x400/9CA3AF/ffffff?text=Invalid+URL';
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!newPin.boardId || boards.length === 0}
            className={`w-full flex items-center justify-center gap-2 text-white p-4 rounded-xl font-bold text-lg shadow-lg transition ${
              !newPin.boardId || boards.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:shadow-xl transform hover:scale-[1.01]' /* Changed pink/purple gradient to red */
            }`}
          >
            Create Pin
          </button>
        </form>
      </div>
    </div>
  );
}