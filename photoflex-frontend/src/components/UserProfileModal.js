import React, { useState, useEffect } from 'react';
import { X, Grid, Mail, Calendar } from 'lucide-react';

export default function UserProfileModal({
  user,
  currentUser,
  apiFetch,
  setMessage,
  onClose,
  onPinClick,
  compactView = false,
}) {
  const [pins, setPins] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [user.userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userPins = await apiFetch(`/pins/user/${user.userId}`);
      setPins(userPins || []);

      const userBoards = await apiFetch(`/boards/user/${user.userId}`);
      const publicBoards = (userBoards || []).filter(b => b.visibility === "public");

      const boardsWithImages = await Promise.all(
        publicBoards.map(async (board) => {
          try {
            const boardPins = await apiFetch(`/pins/board/${board.boardId}`);
            return {
              ...board,
              coverImage: boardPins?.length ? boardPins[0].imageURL : null,
            };
          } catch {
            return board;
          }
        })
      );

      setBoards(boardsWithImages);
    } catch (e) {
      console.error("Failed to fetch user data:", e);
      setMessage({ type: "error", text: "Failed to load user profile." });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Unknown";
      if (Array.isArray(dateString)) {
        const [year, month, day] = dateString;
        return new Date(year, month - 1, day).toLocaleDateString();
      }
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  const isOwnProfile = currentUser.userId === user.userId;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div
        className={
          compactView
            ? "bg-white rounded-2xl w-full max-w-xl h-[80vh] overflow-y-auto shadow-2xl relative"
            : "bg-white rounded-2xl w-full max-w-4xl h-[90vh] overflow-y-auto shadow-2xl relative"
        }
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-gray-100 z-10 shadow"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Gold Header */}
        <div
          className={compactView ? "p-4 text-white" : "p-8 text-white"}
          style={{ backgroundColor: "#EFBF04" }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={user.profilePicture || "https://placehold.co/120x120/EFBF04/FFFFFF?text=U"}
              alt={user.username}
              className={
                compactView
                  ? "w-16 h-16 rounded-full object-cover ring-2 ring-white shadow"
                  : "w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-xl"
              }
            />

            <div className="flex-1 text-center md:text-left">
              <h1
                className={
                  compactView
                    ? "text-xl font-extrabold mb-1 text-black"
                    : "text-3xl font-extrabold mb-2 text-black"
                }
              >
                {user.username}
                {isOwnProfile && <span className="text-sm ml-2 opacity-75">(You)</span>}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-black">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(user.createdDate)}
                </div>
              </div>

              {user.bio && (
                <p className="mt-3 text-black italic opacity-80">{user.bio}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div
            className={
              compactView
                ? "flex justify-center gap-6 mt-4 text-black"
                : "flex justify-center md:justify-start gap-8 mt-6 text-black"
            }
          >
            <div className="text-center">
              <p className="text-xl font-bold">{pins.length}</p>
              <p className="text-sm">Pins</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{boards.length}</p>
              <p className="text-sm">Public Boards</p>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading...</p>
            </div>
          ) : (
            <>
              {/* PINS */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {isOwnProfile ? "Your Pins" : `${user.username}'s Pins`}
                </h2>

                {pins.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pins.map((pin) => (
                      <div
                        key={pin.pinId}
                        onClick={() => onPinClick(pin)}
                        className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden cursor-pointer transition group"
                      >
                        <div className="w-full h-40 overflow-hidden">
                          <img
                            src={pin.imageURL}
                            alt={pin.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <div className="p-2">
                          <h3 className="font-semibold text-gray-800 text-sm truncate">
                            {pin.title}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Grid className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {isOwnProfile ? "You have" : "This user has"} no pins yet
                    </p>
                  </div>
                )}
              </div>

              {/* PUBLIC BOARDS */}
              {boards.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Public Boards
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {boards.map((board) => (
                      <div
                        key={board.boardId}
                        className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition"
                      >
                        <div className="h-32 overflow-hidden">
                          <img
                            src={
                              board.coverImage ||
                              "https://placehold.co/400x200/EFBF04/ffffff?text=Board"
                            }
                            alt={board.title}
                            className="w-full h-full object-cover" // FIT COVER IMAGE
                          />
                        </div>

                        <div className="p-3">
                          <h3 className="font-bold text-gray-800 truncate">
                            {board.title}
                          </h3>
                          <p className="text-gray-600 text-sm truncate">
                            {board.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
