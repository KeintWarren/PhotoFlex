export default function PinCard({pin, handlePinClick, key}){

  return(
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group transform hover:scale-[1.02] transition-all duration-300"
      onClick={() => handlePinClick(pin)}
    >
      <div className="w-full h-64 overflow-hidden">
        <img
          src={
            pin.imageURL ||
            "https://placehold.co/600x400/3B82F6/ffffff?text=No+Image"
          }
          alt={pin.title || "Pin image"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 h-28 flex flex-col justify-between">
        <h3 className="font-bold text-gray-800 text-lg truncate">
          {pin.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {pin.description}
        </p>
      </div>
    </div>
   );
 }