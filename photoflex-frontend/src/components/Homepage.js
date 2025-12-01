import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import CreatePinModal from './CreatePinModal';
import PinDetailModal from './PinDetailModal';

export default function Homepage({ currentUser, apiFetch, setMessage }) {
  const [pins, setPins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreatePin, setShowCreatePin] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);

  useEffect(() => {
    fetchPins();

    const handleNavigate = () => setShowCreatePin(false);
    window.addEventListener('navigate-to-profile', handleNavigate);
    return () => window.removeEventListener('navigate-to-profile', handleNavigate);
  }, []);

  const fetchPins = async () => {
    try {
      const data = await apiFetch('/pins');
      setPins(data || []);
    } catch (e) {
      console.error('Failed to fetch pins:', e);
    }
  };

  const handlePinClick = async (pin) => {
    try {
      const pinDetails = await apiFetch(`/pins/${pin.pinId}`);
      const likeCount = await apiFetch(`/likes/pin/${pin.pinId}/count`);
      const isLiked = await apiFetch(`/likes/pin/${pin.pinId}/user/${currentUser.userId}`);

      setSelectedPin({ ...pinDetails, likeCount, isLiked });
    } catch (e) {
      console.error('Failed to fetch pin details:', e);
    }
  };

  const filteredPins = pins.filter(pin =>
    pin.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pin.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PinCard = ({ pin }) => (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group transform hover:scale-[1.02] transition-all duration-300"
      onClick={() => handlePinClick(pin)}
    >
      <div className="w-full h-64 overflow-hidden">
        <img
          src={pin.imageURL || 'https://placehold.co/600x400/3B82F6/ffffff?text=No+Image'}
          alt={pin.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/600x400/9CA3AF/ffffff?text=Error';
          }}
        />
      </div>
      <div className="p-4 h-28 flex flex-col justify-between">
        <h3 className="font-bold text-gray-800 text-lg truncate">{pin.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{pin.description}</p>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Discover Pins</h2>
          <p className="text-gray-600 mt-1">Explore creative ideas and inspiration</p>
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
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}
        >
          {filteredPins.map(pin => (
            <PinCard key={pin.pinId} pin={pin} />
          ))}
        </div>
      ) : (
        <div className="text-center p-16 bg-white rounded-2xl shadow-sm">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm ? `No results for "${searchTerm}"` : 'No pins available yet'}
          </p>
          <p className="text-gray-500">
            {searchTerm ? 'Try a different search term' : 'Create your first pin to get started!'}
          </p>
        </div>
      )}

      {/* Modals */}
      {showCreatePin && (
        <CreatePinModal
          currentUser={currentUser}
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
            setSelectedPin(updatedPin);
            setPins(pins.map(p => p.pinId === updatedPin.pinId ? updatedPin : p));
          }}
        />
      )}
    </div>
  );
}
