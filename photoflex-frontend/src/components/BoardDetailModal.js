import React, { useEffect, useState } from "react";
import { X, Grid, Heart, MessageCircle, Image as ImgIcon } from "lucide-react";

export default function BoardDetailModal({
  board,
  currentUser,
  apiFetch,
  setMessage,
  onClose,
  onPinClick,
}) {
  const [pins, setPins] = useState([]);
  const [stats, setStats] = useState({
    totalPins: 0,
    totalLikes: 0,
    totalComments: 0,
  });

  useEffect(() => {
    fetchBoardPins();
  }, []);

  const fetchBoardPins = async () => {
    try {
      const data = await apiFetch(`/pins/board/${board.boardId}`);

      const totalLikes = data.reduce((sum, pin) => sum + (pin.likeCount || 0), 0);
      const totalComments = data.reduce((sum, pin) => sum + (pin.commentCount || 0), 0);

      setPins(data);
      setStats({
        totalPins: data.length,
        totalLikes,
        totalComments,
      });
    } catch (e) {
      console.error("Failed to load board pins:", e);
      setMessage({ type: "error", text: "Failed to load board pins." });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            {board.title}
          </h1>
          <p className="text-gray-600">{board.description}</p>

          {/* Creator */}
          <div className="flex items-center gap-3 mt-4">
            <img
              src={
                board.user?.profilePicture ||
                "https://placehold.co/40x40/A855F7/FFFFFF?text=U"
              }
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gold-400"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {board.user?.username || "Unknown User"}
              </p>
              <p className="text-xs text-gray-500">
                Created {new Date(board.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-1 text-gray-700">
              <ImgIcon className="w-5 h-5 text-gray-500" />
              <p className="font-semibold">{stats.totalPins} Pins</p>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <Heart className="w-5 h-5 text-red-500" />
              <p className="font-semibold">{stats.totalLikes} Likes</p>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <MessageCircle className="w-5 h-5 text-gray-500" />
              <p className="font-semibold">{stats.totalComments} Comments</p>
            </div>
          </div>
        </div>

        {/* CONTENT: Pins grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {pins.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <Grid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-semibold">This board has no pins yet.</p>
            </div>
          ) : (
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              }}
            >
              {pins.map((pin) => (
                <div
                  key={pin.pinId}
                  onClick={() => onPinClick(pin)}
                  className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden cursor-pointer transition"
                >
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={pin.imageURL}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">
                      {pin.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {pin.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
