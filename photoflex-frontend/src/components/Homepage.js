import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import CreatePinModal from "./CreatePinModal";
import PinDetailModal from "./PinDetailModal";
import BoardDetailModal from "./BoardDetailModal";
import PinCard from "./PinCard";

export default function Homepage({ currentUser, apiFetch, setMessage }) {
  const [pins, setPins] = useState([]);
  const [boards, setBoards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showCreatePin, setShowCreatePin] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);

  // Fetch pins & boards after currentUser is ready
  useEffect(() => {
    if (!currentUser?.userId) return;

    const fetchPins = async () => {
      try {
        const data = await apiFetch("/pins");
        setPins(data || []);
      } catch (e) {
        console.error("Failed to fetch pins:", e);
      }
    };

    const fetchBoards = async () => {
      try {
        console.log("Fetching boards for user:", currentUser.userId);
        const data = await apiFetch(`/boards/user/${currentUser.userId}`);
        console.log("Boards fetched:", data);
        setBoards(data || []);
      } catch (e) {
        console.error("Failed to fetch boards:", e);
      }
    };

    fetchPins();
    fetchBoards();
  }, [currentUser, apiFetch]);

  const handlePinClick = async (pin) => {
    // CRITICAL FIX: Add check for valid pin object
    if (!pin || !pin.pinId) {
        console.error("Attempted to click on an invalid pin object.", pin);
        return;
    }

    try {
      const pinDetails = await apiFetch(`/pins/${pin.pinId}`);
      const likeCount = await apiFetch(`/likes/pin/${pin.pinId}/count`);
      const isLiked = await apiFetch(
        `/likes/pin/${pin.pinId}/user/${currentUser.userId}`
      );

      setSelectedPin({ ...pinDetails, likeCount, isLiked });
    } catch (e) {
      console.error("Failed to fetch pin details:", e);
    }
  };

  const filteredPins = pins.filter(
    (pin) =>
      pin && // <-- Added a check here for robustness, although PinCard uses `pin.pinId` for key
      (pin.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pin.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Discover Pins</h2>
          <p className="text-gray-600 mt-1">
            Explore creative ideas and inspiration
          </p>
        </div>

        <button
          onClick={() => setShowCreatePin(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition"
        >
          <Plus className="w-5 h-5" />
          Create Pin
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search pins by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 border border-gray-300 rounded-2xl bg-white focus:ring-2 focus:ring-red-400 focus:border-transparent transition shadow-sm"
        />
        <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Pins Grid */}
      {filteredPins.length > 0 ? (
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}
        >
          {/* Added filter to pins array for maximum safety */}
          {filteredPins.filter(pin => pin && pin.pinId).map((pin) => (
            <PinCard key={pin.pinId} pin={pin} handlePinClick={handlePinClick}/>
          ))}
        </div>
      ) : (
        <div className="text-center p-16 bg-white rounded-2xl shadow-sm">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm ? `No results for "${searchTerm}"` : "No pins available yet"}
          </p>
          <p className="text-gray-500">
            {searchTerm
              ? "Try a different search term"
              : "Create your first pin to get started!"}
          </p>
        </div>
      )}

      {/* Modals */}
      {showCreatePin && (
        <CreatePinModal
          currentUser={currentUser}
          boards={boards}
          apiFetch={apiFetch}
          setMessage={setMessage}
          onClose={() => setShowCreatePin(false)}
          onPinCreated={(newPin) => {
            setPins([newPin, ...pins]);
            setShowCreatePin(false);
          }}
        />
      )}

      {selectedPin && (
        <PinDetailModal
          pin={selectedPin}
          currentUser={currentUser}
          apiFetch={apiFetch}
          setMessage={setMessage}
          onClose={() => setSelectedPin(null)}
          onPinUpdated={(updatedPin) => {
            // Check if updatedPin is valid before using it
            const pinToUpdate = updatedPin || selectedPin;
            if (pinToUpdate && pinToUpdate.pinId) {
                setSelectedPin(pinToUpdate);
                setPins((prev) =>
                    prev.map((p) => (p.pinId === pinToUpdate.pinId ? pinToUpdate : p))
                );
            }
          }}
        />
      )}

      {selectedBoard && (
        <BoardDetailModal
          board={selectedBoard}
          currentUser={currentUser}
          apiFetch={apiFetch}
          setMessage={setMessage}
          onClose={() => setSelectedBoard(null)}
          onPinClick={handlePinClick}
        />
      )}
    </div>
  );
}