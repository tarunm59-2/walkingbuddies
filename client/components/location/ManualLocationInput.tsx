import { useState } from "react";
import { MapPin, Search } from "lucide-react";

interface ManualLocationInputProps {
  onLocationSet: (lat: number, lng: number, address: string) => void;
}

const COMMON_LOCATIONS = [
  { name: "Times Square, NYC", lat: 40.758, lng: -73.9855 },
  { name: "Central Park, NYC", lat: 40.7829, lng: -73.9654 },
  { name: "Brooklyn Bridge, NYC", lat: 40.7061, lng: -73.9969 },
  { name: "East Village, NYC", lat: 40.7265, lng: -73.9815 },
  { name: "Financial District, NYC", lat: 40.7074, lng: -74.0113 },
  { name: "Chelsea, NYC", lat: 40.7465, lng: -73.9973 },
];

export default function ManualLocationInput({
  onLocationSet,
}: ManualLocationInputProps) {
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!address.trim()) return;

    setIsSearching(true);
    try {
      // In a real implementation, you'd use Google Geocoding API
      // For now, we'll simulate a search
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock geocoding result for Manhattan
      const lat = 40.7589 + (Math.random() - 0.5) * 0.01;
      const lng = -73.9851 + (Math.random() - 0.5) * 0.01;

      onLocationSet(lat, lng, address);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSelect = (location: (typeof COMMON_LOCATIONS)[0]) => {
    onLocationSet(location.lat, location.lng, location.name);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Set Your Location Manually
        </h3>
        <p className="text-sm text-slate-600">
          Enter your address or select a common location to start using SafeWalk
        </p>
      </div>

      {/* Address Search */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter your address or location..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-safety-500 focus:border-safety-500 outline-none"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <button
            onClick={handleSearch}
            disabled={!address.trim() || isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-safety-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-safety-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? "..." : "Search"}
          </button>
        </div>
      </div>

      {/* Quick Location Selection */}
      <div>
        <h4 className="text-sm font-medium text-slate-900 mb-3">
          Quick Select:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMMON_LOCATIONS.map((location) => (
            <button
              key={location.name}
              onClick={() => handleQuickSelect(location)}
              className="flex items-center gap-2 p-3 text-left border border-slate-200 rounded-lg hover:border-safety-300 hover:bg-safety-50 transition-colors"
            >
              <MapPin className="h-4 w-4 text-safety-600 flex-shrink-0" />
              <span className="text-sm text-slate-700">{location.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600">
          💡 <strong>Tip:</strong> For the best experience, enable location
          access in your browser settings. Manual location won't provide
          real-time tracking for safety features.
        </p>
      </div>
    </div>
  );
}
