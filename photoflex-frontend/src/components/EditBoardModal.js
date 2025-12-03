import React, { useState } from "react";
import { X, Save, Image as ImageIcon, Globe, Lock } from "lucide-react";

export default function EditBoardModal({
  board,
  currentUser,
  apiFetch,
  setMessage,
  onClose,
  onBoardUpdated,
}) {
  const [title, setTitle] = useState(board.title || "");
  const [description, setDescription] = useState(board.description || "");
  const [coverImage, setCoverImage] = useState(board.coverImage || "");
  const [visibility, setVisibility] = useState(board.visibility || "public");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage({ type: "error", text: "Board title is required" });
      return;
    }

    setLoading(true);

    try {
      const updatedBoard = {
        ...board,
        title: title.trim(),
        description: description.trim(),
        coverImage: coverImage.trim(),
        visibility,
      };

      const result = await apiFetch(`/boards/${board.boardId}`, {
        method: "PUT",
        body: JSON.stringify(updatedBoard),
      });

      setMessage({ type: "success", text: "Board updated successfully!" });
      onBoardUpdated(result);
      onClose();
    } catch (error) {
      console.error("Failed to update board:", error);
      setMessage({ type: "error", text: "Failed to update board" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Edit Board</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cover Image Preview */}
          {coverImage && (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
              <img
                src={coverImage}
                alt="Board cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400/9CA3AF/ffffff?text=Invalid+URL";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-lg">{title || "Board Title"}</p>
              </div>
            </div>
          )}

          {/* Cover Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a direct image URL or leave blank to use first pin's image
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Board Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Travel Inspiration"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this board about?"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Visibility
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={`flex-1 p-4 rounded-lg border-2 transition ${
                  visibility === "public"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-green-300"
                }`}
              >
                <Globe className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="font-semibold text-gray-800">Public</p>
                <p className="text-xs text-gray-600">Everyone can see</p>
              </button>

              <button
                type="button"
                onClick={() => setVisibility("private")}
                className={`flex-1 p-4 rounded-lg border-2 transition ${
                  visibility === "private"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-red-300"
                }`}
              >
                <Lock className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <p className="font-semibold text-gray-800">Private</p>
                <p className="text-xs text-gray-600">Only you can see</p>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}