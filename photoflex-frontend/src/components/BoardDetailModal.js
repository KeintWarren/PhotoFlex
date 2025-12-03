import React, { useEffect, useState } from "react";
import { X, Grid, Heart, MessageCircle, Image as ImgIcon, Edit } from "lucide-react";
import EditBoardModal from "./EditBoardModal";

export default function BoardDetailModal({
  board,
  currentUser,
  apiFetch,
  setMessage,
  onClose,
  onPinClick,
  onBoardUpdated,
}) {
  const [pins, setPins] = useState([]);
  const [stats, setStats] = useState({
    totalPins: 0,
    totalLikes: 0,
    totalComments: 0,
  });
  const [showEditBoard, setShowEditBoard] = useState(false);
  const [currentBoard, setCurrentBoard] = useState(board);

  useEffect(() => {
    fetchBoardPins();
  }, [currentBoard]);

  const fetchBoardPins = async () => {
    try {
      const data = await apiFetch(`/pins/board/${currentBoard.boardId}`);

      console.log("📌 Fetched pins from board:", data);

      // Check each pin's counts
      data.forEach(pin => {
        console.log(`Pin "${pin.title}": Likes=${pin.likeCount}, Comments=${pin.commentCount}`);
      });

      const totalLikes = data.reduce((sum, pin) => {
        const likes = pin.likeCount || 0;
        console.log(`Adding ${likes} likes from pin "${pin.title}"`);
        return sum + likes;
      }, 0);

      const totalComments = data.reduce((sum, pin) => {
        const comments = pin.commentCount || 0;
        console.log(`Adding ${comments} comments from pin "${pin.title}"`);
        return sum + comments;
      }, 0);

      console.log("📊 Total Stats:", {
        totalPins: data.length,
        totalLikes,
        totalComments
      });

      setPins(data);
      setStats({
        totalPins: data.length,
        totalLikes,
        totalComments,
      });

      if (onBoardUpdated) onBoardUpdated(data);
    } catch (e) {
      console.error("Failed to load board pins:", e);
      setMessage({ type: "error", text: "Failed to load board pins." });
    }
  };

  const handleBoardUpdated = (updatedBoard) => {
    setCurrentBoard(updatedBoard);
    if (onBoardUpdated) onBoardUpdated(updatedBoard);
    setShowEditBoard(false);
  };

  const isOwner = currentUser?.userId === currentBoard.user?.userId;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col">

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-gray-100 z-10"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          {/* Cover Image */}
          {currentBoard.coverImage && (
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={currentBoard.coverImage}
                alt={currentBoard.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          )}

          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                  {currentBoard.title}
                </h1>
                <p className="text-gray-600">{currentBoard.description}</p>
              </div>

              {isOwner && (
                <button
                  onClick={() => setShowEditBoard(true)}
                  className="ml-4 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition text-gray-700 font-semibold"
                >
                  <Edit className="w-4 h-4" />
                  Edit Board
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <img
                src={
                  currentBoard.user?.profilePicture ||
                  "https://placehold.co/40x40/A855F7/FFFFFF?text=U"
                }
                className="w-10 h-10 rounded-full object-cover ring-2 ring-yellow-400"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {currentBoard.user?.username || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">
                  Created {new Date(currentBoard.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

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
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          ❤️ {pin.likeCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          💬 {pin.commentCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditBoard && (
        <EditBoardModal
          board={currentBoard}
          currentUser={currentUser}
          apiFetch={apiFetch}
          setMessage={setMessage}
          onClose={() => setShowEditBoard(false)}
          onBoardUpdated={handleBoardUpdated}
        />
      )}
    </>
  );
}