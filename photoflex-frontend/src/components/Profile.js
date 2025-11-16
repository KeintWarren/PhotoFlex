import React, { useState, useEffect } from 'react';
import { Plus, Grid, Lock, Globe } from 'lucide-react';
import CreateBoardModal from './CreateBoardModal';

export default function Profile({ currentUser, apiFetch, setMessage }) {
  const [boards, setBoards] = useState([]);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [pins, setPins] = useState([]);

  useEffect(() => {
    fetchBoards();
    fetchUserPins();
  }, []);

  const fetchBoards = async () => {
    try {
      const data = await apiFetch(`/boards/user/${currentUser.userId}`);
      setBoards(data || []);
    } catch (e) {
      console.error('Failed to fetch boards:', e);
    }
  };

  const fetchUserPins = async () => {
    try {
      const data = await apiFetch(`/pins/user/${currentUser.userId}`);
      setPins(data || []);
    } catch (e) {
      console.error('Failed to fetch user pins:', e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={currentUser.profilePicture}
            alt={currentUser.username}
            className="w-32 h-32 rounded-full object-cover ring-4 ring-gold-400 shadow-xl" // Changed ring-purple-400 to ring-gold-400
          />

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
              {currentUser.username}
            </h1>
            <p className="text-gray-600 text-lg mb-3">{currentUser.email}</p>
            <p className="text-gray-500 italic max-w-2xl">{currentUser.bio}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{pins.length}</p> {/* Changed text-purple-600 to text-red-600 */}
                <p className="text-gray-600 text-sm">Pins</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-600">{boards.length}</p> {/* Changed text-pink-600 to text-gold-600 (Assuming gold is secondary accent) */}
                <p className="text-gray-600 text-sm">Boards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Boards Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Boards</h2>
        <button
          onClick={() => setShowCreateBoard(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition" // Changed pink/purple gradient to red
        >
          <Plus className="w-5 h-5" />
          New Board
        </button>
      </div>

      {boards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map(board => (
            <div
              key={board.boardId}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              {/* Board Cover - Could show first pin's image */}
              <div className="h-40 bg-gradient-to-br from-red-600 via-gold-500 to-gray-400 relative overflow-hidden"> {/* Changed purple/pink/blue gradient to red/gold/gray */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all"></div>
                <Grid className="w-16 h-16 text-white/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Board Info */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800 flex-1 line-clamp-1">
                    {board.title}
                  </h3>
                  {board.visibility === 'public' ? (
                    <Globe className="w-5 h-5 text-green-500" title="Public" />
                  ) : (
                    <Lock className="w-5 h-5 text-red-500" title="Private" />
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {board.description || 'No description'}
                </p>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    board.visibility === 'public'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700' // Changed red-100/700 to match private color
                  }`}>
                    {board.visibility}
                  </span>
                  <span>
                    {new Date(board.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-16 bg-white rounded-2xl shadow-sm">
          <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-600 mb-2">No boards yet</p>
          <p className="text-gray-500 mb-6">Create your first board to organize your pins!</p>
          <button
            onClick={() => setShowCreateBoard(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition" // Changed pink/purple gradient to red
          >
            <Plus className="w-5 h-5" />
            Create Board
          </button>
        </div>
      )}

      {/* Create Board Modal */}
      {showCreateBoard && (
        <CreateBoardModal
          currentUser={currentUser}
          apiFetch={apiFetch}
          setMessage={setMessage}
          onClose={() => setShowCreateBoard(false)}
          onBoardCreated={(newBoard) => {
            setBoards([newBoard, ...boards]);
            setShowCreateBoard(false);
          }}
        />
      )}
    </div>
  );
}