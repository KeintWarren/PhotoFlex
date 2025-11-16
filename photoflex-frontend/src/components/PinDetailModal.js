import React, { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Send } from 'lucide-react';

export default function PinDetailModal({ pin, currentUser, apiFetch, setMessage, onClose, onPinUpdated }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(pin.isLiked || false);
  const [likeCount, setLikeCount] = useState(pin.likeCount || 0);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const data = await apiFetch(`/comments/pin/${pin.pinId}`);
      setComments(data || []);
    } catch (e) {
      console.error('Failed to fetch comments:', e);
    }
  };

  const handleToggleLike = async () => {
    try {
      if (isLiked) {
        await apiFetch(`/likes/pin/${pin.pinId}/user/${currentUser.userId}`, {
          method: 'DELETE',
        });
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        const likeToSave = {
          pin: { pinId: pin.pinId },
          user: { userId: currentUser.userId },
          createdDate: new Date().toISOString(),
        };
        await apiFetch('/likes', {
          method: 'POST',
          body: JSON.stringify(likeToSave),
        });
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
      onPinUpdated(); // Notify parent to refresh like state
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to toggle like status.' });
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    try {
      const commentToSave = {
        text: newComment,
        pin: { pinId: pin.pinId },
        user: { userId: currentUser.userId },
        createdDate: new Date().toISOString(),
      };

      const newCmt = await apiFetch('/comments', {
        method: 'POST',
        body: JSON.stringify(commentToSave),
      });

      setComments([...comments, { ...newCmt, user: currentUser }]);
      setNewComment('');
      setMessage({ type: 'success', text: 'Comment added!' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to add comment.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100 text-gray-700 z-10 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-1 overflow-hidden">
          {/* Pin Image / Details Section */}
          <div className="w-full lg:w-1/2 p-4 flex-shrink-0">
            <div className="h-full bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src={pin.imageURL}
                alt={pin.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* Pin Content / Comments Section */}
          <div className="w-full lg:w-1/2 flex flex-col p-6 overflow-y-auto">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{pin.title}</h1>
            <p className="text-gray-600 mb-6">{pin.description}</p>

            {/* Author Info */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src={pin.user?.profilePicture || 'https://placehold.co/48x48/A855F7/ffffff?text=U'}
                alt={pin.user?.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gold-400"
              />
              <div>
                <p className="font-bold text-gray-800 text-sm">{pin.user?.username || 'Unknown User'}</p>
                <p className="text-xs text-gray-500">{new Date(pin.createdDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Actions: Save/Like */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                <span className="ml-1 text-sm">{likeCount} Likes</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <span className="ml-1 text-sm">{comments.length} Comments</span>
              </div>

              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1 ml-auto px-4 py-2 rounded-full font-semibold transition ${
                  isLiked
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Heart className="w-4 h-4 fill-current" />
                {isLiked ? 'Liked' : 'Like'}
              </button>

              {/* Assuming a pin already has a board association for simplicity */}
              <button
                // onClick={() => { /* logic to save to another board if needed */ }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:shadow-lg transition"
              >
                Save
              </button>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto pr-2">
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Comments</h2>
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.commentId} className="flex gap-3">
                      <img
                        src={comment.user?.profilePicture || 'https://placehold.co/40x40/A855F7/ffffff?text=U'}
                        alt={comment.user?.username}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="bg-gray-100 p-3 rounded-xl flex-1">
                        <p className="font-bold text-gray-800 text-sm mb-1">
                          {comment.user?.username || 'Unknown'}
                        </p>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Comment */}
        <div className="border-t p-4 bg-white">
          <div className="flex gap-2">
            <input
              id="comment-input"
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />
            <button
              onClick={handleAddComment}
              disabled={newComment.trim() === ''}
              className={`p-3 rounded-xl transition ${
                newComment.trim() === ''
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}