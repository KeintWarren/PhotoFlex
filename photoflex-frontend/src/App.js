import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Plus, X, Grid, User, LogOut, Search, Save } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');
  const [pins, setPins] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Login/Signup states
  const [authMode, setAuthMode] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    bio: '',
    profilePicture: ''
  });

  // Create Pin states
  const [showCreatePin, setShowCreatePin] = useState(false);
  const [newPin, setNewPin] = useState({
    title: '',
    description: '',
    imageURL: '',
    boardId: ''
  });

  // Create Board states
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoard, setNewBoard] = useState({
    title: '',
    description: '',
    visibility: 'public'
  });

  useEffect(() => {
    if (currentUser) {
      fetchPins();
      fetchBoards();
    }
  }, [currentUser]);

  const fetchPins = async () => {
    try {
      const response = await fetch(`${API_URL}/pins`);
      const data = await response.json();
      setPins(data);
    } catch (error) {
      console.error('Error fetching pins:', error);
    }
  };

  const fetchBoards = async () => {
    try {
      const response = await fetch(`${API_URL}/boards`);
      const data = await response.json();
      setBoards(data);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const fetchComments = async (pinId) => {
    try {
      const response = await fetch(`${API_URL}/comments/pin/${pinId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/users`);
      const users = await response.json();
      const user = users.find(u => u.email === loginData.email && u.password === loginData.password);

      if (user) {
        setCurrentUser(user);
        setView('home');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...signupData,
          createdDate: new Date().toISOString()
        })
      });
      const user = await response.json();
      setCurrentUser(user);
      setView('home');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleCreatePin = async (e) => {
    e.preventDefault();
    try {
      const pinData = {
        title: newPin.title,
        description: newPin.description,
        imageURL: newPin.imageURL,
        user: { userId: currentUser.userId },
        board: newPin.boardId ? { boardId: parseInt(newPin.boardId) } : null,
        createdDate: new Date().toISOString()
      };

      await fetch(`${API_URL}/pins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pinData)
      });

      setShowCreatePin(false);
      setNewPin({ title: '', description: '', imageURL: '', boardId: '' });
      fetchPins();
    } catch (error) {
      console.error('Error creating pin:', error);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBoard,
          user: { userId: currentUser.userId },
          createdAt: new Date().toISOString()
        })
      });

      setShowCreateBoard(false);
      setNewBoard({ title: '', description: '', visibility: 'public' });
      fetchBoards();
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleLike = async (pinId) => {
    try {
      const response = await fetch(`${API_URL}/likes/pin/${pinId}/user/${currentUser.userId}`);
      const isLiked = await response.json();

      if (isLiked) {
        await fetch(`${API_URL}/likes/pin/${pinId}/user/${currentUser.userId}`, {
          method: 'DELETE'
        });
      } else {
        await fetch(`${API_URL}/likes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pin: { pinId },
            user: { userId: currentUser.userId },
            createdDate: new Date().toISOString()
          })
        });
      }
      fetchPins();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (pinId) => {
    if (!newComment.trim()) return;

    try {
      await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newComment,
          pin: { pinId },
          user: { userId: currentUser.userId },
          createdDate: new Date().toISOString()
        })
      });

      setNewComment('');
      fetchComments(pinId);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const openPinDetails = (pin) => {
    setSelectedPin(pin);
    fetchComments(pin.pinId);
  };

  const filteredPins = pins.filter(pin =>
    pin.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pin.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Login/Signup View
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            PhotoFlex
          </h1>
          <p className="text-gray-600 text-center mb-8">Discover and share amazing ideas</p>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                authMode === 'signup'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Log In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="url"
                placeholder="Profile Picture URL (optional)"
                value={signupData.profilePicture}
                onChange={(e) => setSignupData({ ...signupData, profilePicture: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <textarea
                placeholder="Bio (optional)"
                value={signupData.bio}
                onChange={(e) => setSignupData({ ...signupData, bio: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="3"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Main App View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              PhotoFlex
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setView('home')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  view === 'home' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setView('boards')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  view === 'boards' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="inline w-4 h-4 mr-2" />
                Boards
              </button>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search pins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreatePin(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Pin
            </button>
            <button
              onClick={() => setView('profile')}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold hover:shadow-lg transition"
            >
              {currentUser.username[0].toUpperCase()}
            </button>
            <button
              onClick={() => {
                setCurrentUser(null);
                setView('login');
              }}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'home' && (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
            {filteredPins.map((pin) => (
              <div
                key={pin.pinId}
                className="break-inside-avoid mb-4 group cursor-pointer"
                onClick={() => openPinDetails(pin)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300">
                  <img
                    src={pin.imageURL || 'https://via.placeholder.com/300x400?text=No+Image'}
                    alt={pin.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg mb-1">{pin.title}</h3>
                      {pin.description && (
                        <p className="text-white/90 text-sm line-clamp-2">{pin.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(pin.pinId);
                      }}
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
                    >
                      <Heart className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'boards' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Your Boards</h2>
              <button
                onClick={() => setShowCreateBoard(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Board
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {boards.filter(b => b.user?.userId === currentUser.userId).map((board) => (
                <div key={board.boardId} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Grid className="w-8 h-8 text-purple-500" />
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      board.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {board.visibility}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{board.title}</h3>
                  <p className="text-gray-600 text-sm">{board.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                  {currentUser.username[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{currentUser.username}</h2>
                  <p className="text-gray-600">{currentUser.email}</p>
                  {currentUser.bio && <p className="text-gray-700 mt-2">{currentUser.bio}</p>}
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Pins</h3>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
              {pins.filter(p => p.user?.userId === currentUser.userId).map((pin) => (
                <div
                  key={pin.pinId}
                  className="break-inside-avoid mb-4 group cursor-pointer"
                  onClick={() => openPinDetails(pin)}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all">
                    <img
                      src={pin.imageURL || 'https://via.placeholder.com/300x400'}
                      alt={pin.title}
                      className="w-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x400';
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Create Pin Modal */}
      {showCreatePin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Create Pin</h3>
              <button
                onClick={() => setShowCreatePin(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreatePin} className="space-y-4">
              <input
                type="text"
                placeholder="Pin Title"
                value={newPin.title}
                onChange={(e) => setNewPin({ ...newPin, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <textarea
                placeholder="Description"
                value={newPin.description}
                onChange={(e) => setNewPin({ ...newPin, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                rows="3"
              />
              <input
                type="url"
                placeholder="Image URL"
                value={newPin.imageURL}
                onChange={(e) => setNewPin({ ...newPin, imageURL: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <select
                value={newPin.boardId}
                onChange={(e) => setNewPin({ ...newPin, boardId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Board (Optional)</option>
                {boards.filter(b => b.user?.userId === currentUser.userId).map((board) => (
                  <option key={board.boardId} value={board.boardId}>
                    {board.title}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Create Pin
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Board Modal */}
      {showCreateBoard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Create Board</h3>
              <button
                onClick={() => setShowCreateBoard(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateBoard} className="space-y-4">
              <input
                type="text"
                placeholder="Board Title"
                value={newBoard.title}
                onChange={(e) => setNewBoard({ ...newBoard, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <textarea
                placeholder="Description"
                value={newBoard.description}
                onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                rows="3"
              />
              <select
                value={newBoard.visibility}
                onChange={(e) => setNewBoard({ ...newBoard, visibility: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Create Board
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pin Details Modal */}
      {selectedPin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gray-100 rounded-l-2xl flex items-center justify-center p-4">
                <img
                  src={selectedPin.imageURL || 'https://via.placeholder.com/500'}
                  alt={selectedPin.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500';
                  }}
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedPin.title}</h2>
                    <p className="text-gray-600">{selectedPin.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPin(null)}
                    className="text-gray-500 hover:text-gray-700 ml-4"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => handleLike(selectedPin.pinId)}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    Like
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    Save
                  </button>
                </div>

                <div className="border-t pt-6 flex-1 overflow-y-auto">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Comments ({comments.length})
                  </h3>

                  <div className="space-y-4 mb-4">
                    {comments.map((comment) => (
                      <div key={comment.commentId} className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {comment.user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-3">
                          <p className="font-semibold text-gray-800 text-sm">
                            {comment.user?.username || 'Unknown User'}
                          </p>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(selectedPin.pinId);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(selectedPin.pinId)}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}