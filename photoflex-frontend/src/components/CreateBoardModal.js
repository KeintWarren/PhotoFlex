import React, { useState } from 'react';
import { X, Grid } from 'lucide-react';

export default function CreateBoardModal({ currentUser, apiFetch, setMessage, onClose, onBoardCreated }) {
  const [newBoard, setNewBoard] = useState({
    title: '',
    description: '',
    visibility: 'public',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const boardToSave = {
        title: newBoard.title,
        description: newBoard.description,
        visibility: newBoard.visibility,
        user: { userId: currentUser.userId },
        createdAt: new Date().toISOString(),
      };

      const createdBoard = await apiFetch('/boards', {
        method: 'POST',
        body: JSON.stringify(boardToSave),
      });

      setMessage({ type: 'success', text: `Board "${createdBoard.title}" created!` });
      onBoardCreated(createdBoard);
    } catch (e) {
      console.error('Failed to create board:', e);
      setMessage({ type: 'error', text: 'Failed to create board.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition p-2 rounded-full" /* Changed hover color to red */
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
          <Grid className="w-6 h-6 text-red-600" /> {/* Changed icon color to red */}
          Create New Board
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={newBoard.title}
              onChange={(e) => setNewBoard({ ...newBoard, title: e.target.value })}
              required
              placeholder="e.g. Travel Photography"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition" /* Changed focus:ring to red */
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              value={newBoard.description}
              onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
              rows="3"
              placeholder="Describe what your board is about"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition" /* Changed focus:ring to red */
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setNewBoard({ ...newBoard, visibility: 'public' })}
                className={`flex-1 flex flex-col items-center p-4 rounded-xl border-2 transition ${
                  newBoard.visibility === 'public'
                    ? 'border-red-500 bg-red-50 text-red-700' /* Kept green for public, but using red for consistency and changed background color */
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                <div className="font-semibold">Public</div>
                <div className="text-xs mt-1">Anyone can see</div>
              </button>

              <button
                type="button"
                onClick={() => setNewBoard({ ...newBoard, visibility: 'private' })}
                className={`flex-1 flex flex-col items-center p-4 rounded-xl border-2 transition ${
                  newBoard.visibility === 'private'
                    ? 'border-gold-500 bg-gold-50 text-gold-700' /* Changed red to gold for private (secondary accent) */
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                <div className="font-semibold">Private</div>
                <div className="text-xs mt-1">Only you can see</div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition" /* Changed pink/purple gradient to red */
          >
            <Grid className="w-5 h-5" />
            Create Board
          </button>
        </form>
      </div>
    </div>
  );
}