import React, { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Send } from 'lucide-react';
import UserProfileModal from './UserProfileModal';

export default function PinDetailModal({
  pin,
  currentUser,
  apiFetch,
  setMessage,
  onClose,
  onPinUpdated,
}) {

  // ✅ ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(pin?.isLiked || false);
  const [likeCount, setLikeCount] = useState(pin?.likeCount || 0);

  const [allUsers, setAllUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [mentionStart, setMentionStart] = useState(-1);

  const [selectedUserProfile, setSelectedUserProfile] = useState(null);

  // ✅ useEffect with conditional logic INSIDE
  useEffect(() => {
    // Only fetch if pin is valid
    if (!pin || !pin.pinId) {
      return;
    }

    const fetchComments = async () => {
      try {
        const data = await apiFetch(`/comments/pin/${pin.pinId}`);
        setComments(data || []);
      } catch (e) {
        console.error('Failed to fetch comments:', e);
      }
    };

    const fetchUsers = async () => {
      try {
        const data = await apiFetch('/users');
        setAllUsers(data || []);
      } catch (e) {
        console.error('Failed to fetch users:', e);
      }
    };

    fetchComments();
    fetchUsers();
  }, [pin, apiFetch]);

  // ✅ SAFE EARLY RETURN (AFTER ALL HOOKS)
  if (!pin || !pin.pinId) {
    console.error("PinDetailModal rendered without a valid 'pin' prop.");
    return null;
  }

  // -----------------------------------------
  // LIKE / UNLIKE
  // -----------------------------------------
  const handleToggleLike = async () => {
    try {
      if (isLiked) {
        await apiFetch(`/likes/pin/${pin.pinId}/user/${currentUser.userId}`, { method: 'DELETE' });
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        const payload = {
          pin: { pinId: pin.pinId },
          user: { userId: currentUser.userId },
          createdDate: new Date().toISOString(),
        };
        await apiFetch('/likes', { method: 'POST', body: JSON.stringify(payload) });
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }

      if (onPinUpdated) onPinUpdated(pin);

    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to toggle like.' });
    }
  };

  // -----------------------------------------
  // COMMENT INPUT + MENTIONS
  // -----------------------------------------
  const handleCommentChange = e => {
    const value = e.target.value;
    setNewComment(value);

    const lastAtIndex = value.lastIndexOf('@');

    if (lastAtIndex !== -1 && (lastAtIndex === 0 || value[lastAtIndex - 1] === ' ')) {
      const searchTerm = value.slice(lastAtIndex + 1).toLowerCase();

      const filtered = allUsers.filter(
        user =>
          user.username.toLowerCase().startsWith(searchTerm) &&
          user.userId !== currentUser.userId
      );

      setFilteredUsers(filtered);
      setMentionStart(lastAtIndex);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectUser = user => {
    const before = newComment.slice(0, mentionStart);
    const after = newComment.slice(mentionStart).replace(/@\w*/, `@${user.username} `);
    setNewComment(before + after);
    setShowSuggestions(false);
  };

  // -----------------------------------------
  // SUBMIT COMMENT
  // -----------------------------------------
  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    try {
      const payload = {
        text: newComment,
        pin: { pinId: pin.pinId },
        user: { userId: currentUser.userId },
        createdDate: new Date().toISOString(),
      };

      const newCmt = await apiFetch('/comments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setComments([...comments, { ...newCmt, user: currentUser }]);
      setNewComment('');

      setMessage({ type: 'success', text: 'Comment added!' });

    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to add comment.' });
    }
  };

  // -----------------------------------------
  // MENTION RENDERER (Clickable usernames)
  // -----------------------------------------
  const renderCommentWithMentions = text => {
    const parts = text.split(/(@\w+)/g);

    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        const username = part.slice(1);
        const user = allUsers.find(u => u.username === username);

        return (
          <span
            key={i}
            className="text-red-600 font-semibold cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              if (user) setSelectedUserProfile(user);
            }}
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const handleUserClick = user => setSelectedUserProfile(user);

  // -----------------------------------------
  // RENDER UI
  // -----------------------------------------
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl relative">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-1 overflow-hidden">

            {/* IMAGE */}
            <div className="w-full lg:w-1/2 p-4 flex-shrink-0">
              <div className="h-full bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={pin.imageURL}
                  alt={pin.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="w-full lg:w-1/2 flex flex-col p-6 overflow-y-auto">

              <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                {pin.title}
              </h1>

              <p className="text-gray-600 mb-6">{pin.description}</p>

              {/* AUTHOR */}
              <div
                onClick={() => handleUserClick(pin.user)}
                className="flex items-center gap-3 mb-6 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
              >
                <img
                  src={pin.user?.profilePicture || 'https://placehold.co/48x48/AAA/fff?text=U'}
                  alt={`${pin.user?.username}'s profile`}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-yellow-400"
                />
                <div>
                  <p className="font-bold text-sm">{pin.user?.username}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(pin.createdDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                  <span className="ml-1 text-sm">{likeCount} Likes</span>
                </div>

                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5" />
                  <span className="ml-1 text-sm">{comments.length} Comments</span>
                </div>

                <button
                  onClick={handleToggleLike}
                  className={`ml-auto px-4 py-2 rounded-full font-semibold transition ${
                    isLiked
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Heart className="w-4 h-4 inline-block mr-1" />
                  {isLiked ? 'Liked' : 'Like'}
                </button>
              </div>

              {/* COMMENTS */}
              <div className="flex-1 overflow-y-auto pr-2">
                <h2 className="text-lg font-bold mb-3">Comments</h2>

                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-gray-500 text-sm">No comments yet.</p>
                  ) : (
                    comments.map(comment => (
                      <div key={comment.commentId} className="flex gap-3">
                        <img
                          src={comment.user?.profilePicture || 'https://placehold.co/40x40/AAA/fff?text=U'}
                          alt={`${comment.user?.username}'s profile`}
                          className="w-8 h-8 rounded-full cursor-pointer"
                          onClick={() => handleUserClick(comment.user)}
                        />
                        <div className="bg-gray-100 p-3 rounded-xl flex-1">
                          <p
                            className="font-bold text-sm cursor-pointer"
                            onClick={() => handleUserClick(comment.user)}
                          >
                            {comment.user.username}
                          </p>
                          <p>{renderCommentWithMentions(comment.text)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ADD COMMENT */}
              <div className="border-t p-4 bg-white relative">

                {/* MENTION DROPDOWN */}
                {showSuggestions && (
                  <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredUsers.map(user => (
                      <div
                        key={user.userId}
                        onClick={() => handleSelectUser(user)}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <img
                          src={user.profilePicture || 'https://placehold.co/32x32/AAA/fff?text=U'}
                          alt={`${user.username}'s profile`}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-sm">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    value={newComment}
                    onChange={handleCommentChange}
                    onKeyPress={e => e.key === 'Enter' && !showSuggestions && handleAddComment()}
                    className="flex-1 p-3 border rounded-xl"
                    placeholder="Add a comment... (@ to mention)"
                  />

                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className={`p-3 rounded-xl ${
                      newComment.trim()
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* USER PROFILE MODAL */}
          {selectedUserProfile && (
            <UserProfileModal
              user={selectedUserProfile}
              currentUser={currentUser}
              apiFetch={apiFetch}
              setMessage={setMessage}
              onClose={() => setSelectedUserProfile(null)}
              onPinClick={() => {}}
              compactView={true}
            />
          )}

        </div>
      </div>
    </>
  );
}