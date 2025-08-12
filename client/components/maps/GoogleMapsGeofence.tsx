import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { AlertTriangle, Shield, Navigation, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface CrimeZoneData {
  zipcode: string;
  area: string;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  crimeRate: number;
  lat: number;
  lng: number;
  radius: number; // in meters
}

interface GeofenceAlert {
  id: string;
  zone: CrimeZoneData;
  timestamp: Date;
  type: "entry" | "exit";
}

// Mock crime data with NYC coordinates (in production, this would come from crimegrade.org API)
const CRIME_ZONES: CrimeZoneData[] = [
  {
    zipcode: "10002",
    area: "East Village",
    grade: "C",
    crimeRate: 18.7,
    lat: 40.7209,
    lng: -73.9896,
    radius: 500
  },
  {
    zipcode: "10003",
    area: "Greenwich Village", 
    grade: "A",
    crimeRate: 8.2,
    lat: 40.7316,
    lng: -73.9938,
    radius: 400
  },
  {
    zipcode: "10001",
    area: "Chelsea",
    grade: "B", 
    crimeRate: 12.3,
    lat: 40.7450,
    lng: -73.9973,
    radius: 600
  },
  {
    zipcode: "10004",
    area: "Financial District",
    grade: "A+",
    crimeRate: 4.1,
    lat: 40.7041,
    lng: -74.0125,
    radius: 300
  }
];

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE";
const IS_DEMO_MODE = !GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "demo_mode" || GOOGLE_MAPS_API_KEY === "YOUR_API_KEY_HERE";

const getZoneColor = (grade: CrimeZoneData["grade"]) => {
  switch (grade) {
    case "A+":
    case "A":
      return "#22c55e"; // Green - safe
    case "B":
      return "#eab308"; // Yellow - caution
    case "C":
    case "D":
    case "F":
      return "#ef4444"; // Red - danger
    default:
      return "#6b7280"; // Gray
  }
};

export default function GoogleMapsGeofence() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [alerts, setAlerts] = useState<GeofenceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const geofencesRef = useRef<google.maps.Circle[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (IS_DEMO_MODE) {
        setIsLoading(false);
        // In demo mode, simulate some location data
        await requestLocationPermission();
        return;
      }

      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["geometry", "places"]
        });

        await loader.load();

        if (!mapRef.current) return;

        // Center map on Manhattan
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 40.7589, lng: -73.9851 },
          zoom: 13,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        setMap(mapInstance);
        await requestLocationPermission();
        createGeofences(mapInstance);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Request location permission and start tracking
  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      setLocationPermission("granted");
      updateUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

      // Start watching location
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          updateUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (error) => console.error("Location error:", error),
        {
          enableHighAccuracy: true,
          maximumAge: 30000, // 30 seconds
          timeout: 10000
        }
      );

    } catch (error) {
      console.error("Permission denied or error:", error);
      setLocationPermission("denied");
      // Fallback to Manhattan center for demo
      updateUserLocation({ lat: 40.7589, lng: -73.9851 });
    }
  };

  // Update user location and check geofences
  const updateUserLocation = (location: { lat: number; lng: number }) => {
    setUserLocation(location);
    
    if (!map) return;

    // Update or create user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition(location);
    } else {
      userMarkerRef.current = new google.maps.Marker({
        position: location,
        map: map,
        title: "Your Location",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff"
        }
      });
    }

    // Check geofence entries/exits
    checkGeofenceAlerts(location);
  };

  // Create crime zone geofences on the map
  const createGeofences = (mapInstance: google.maps.Map) => {
    CRIME_ZONES.forEach((zone) => {
      const circle = new google.maps.Circle({
        strokeColor: getZoneColor(zone.grade),
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: getZoneColor(zone.grade),
        fillOpacity: 0.2,
        map: mapInstance,
        center: { lat: zone.lat, lng: zone.lng },
        radius: zone.radius
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${zone.area} (${zone.zipcode})</h3>
            <p class="text-sm">Crime Grade: <span class="font-medium">${zone.grade}</span></p>
            <p class="text-sm">Crime Rate: ${zone.crimeRate}/1000</p>
            <p class="text-sm text-gray-600">Radius: ${zone.radius}m</p>
          </div>
        `
      });

      circle.addListener("click", () => {
        infoWindow.setPosition({ lat: zone.lat, lng: zone.lng });
        infoWindow.open(mapInstance);
      });

      geofencesRef.current.push(circle);
    });
  };

  // Check if user entered/exited any geofences
  const checkGeofenceAlerts = (userPos: { lat: number; lng: number }) => {
    CRIME_ZONES.forEach((zone) => {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(userPos.lat, userPos.lng),
        new google.maps.LatLng(zone.lat, zone.lng)
      );

      const isInside = distance <= zone.radius;
      const wasInside = alerts.some(alert => 
        alert.zone.zipcode === zone.zipcode && 
        alert.type === "entry" && 
        !alerts.some(exitAlert => 
          exitAlert.zone.zipcode === zone.zipcode && 
          exitAlert.type === "exit" && 
          exitAlert.timestamp > alert.timestamp
        )
      );

      // Entering a high-crime zone
      if (isInside && !wasInside && (zone.grade === "C" || zone.grade === "D" || zone.grade === "F")) {
        const newAlert: GeofenceAlert = {
          id: `${zone.zipcode}-entry-${Date.now()}`,
          zone,
          timestamp: new Date(),
          type: "entry"
        };
        
        setAlerts(prev => [...prev, newAlert]);
        
        // Show browser notification if permission granted
        if (Notification.permission === "granted") {
          new Notification(`⚠️ Entered High-Crime Area`, {
            body: `You've entered ${zone.area} (Grade ${zone.grade}). Consider finding a walking buddy!`,
            icon: "/favicon.ico"
          });
        }
      }

      // Exiting a zone
      if (!isInside && wasInside) {
        const exitAlert: GeofenceAlert = {
          id: `${zone.zipcode}-exit-${Date.now()}`,
          zone,
          timestamp: new Date(),
          type: "exit"
        };
        
        setAlerts(prev => [...prev, exitAlert]);
      }
    });
  };

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
        <div className="p-6 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-safety-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading Google Maps...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Real-Time Crime Map</h3>
            <p className="text-sm text-slate-600 mt-1">Live geofencing with zipcode crime data</p>
          </div>
          <div className="flex items-center gap-2">
            {locationPermission === "granted" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                <Navigation className="h-3 w-3" />
                Tracking
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning-100 px-2 py-1 text-xs font-medium text-warning-700">
                <AlertTriangle className="h-3 w-3" />
                No Location
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Map Container */}
        {IS_DEMO_MODE ? (
          <div className="h-96 w-full rounded-lg border border-slate-200 mb-4 bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Demo Mode</h3>
              <p className="text-slate-600 mb-4 max-w-md">
                To see real Google Maps with live geofencing, add your Google Maps API key to the environment variables.
              </p>
              <div className="bg-white/70 border border-slate-200 rounded-lg p-4 text-left text-sm">
                <div className="font-mono text-slate-800">
                  VITE_GOOGLE_MAPS_API_KEY=your_key_here
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Get your API key at{" "}
                <a
                  href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                  target="_blank"
                  className="text-safety-600 hover:underline"
                  rel="noopener noreferrer"
                >
                  Google Cloud Console
                </a>
              </p>
            </div>

            {/* Demo zones visualization */}
            <div className="absolute inset-0 pointer-events-none">
              {CRIME_ZONES.map((zone, index) => (
                <div
                  key={zone.zipcode}
                  className="absolute"
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + index * 10}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  <div
                    className="h-12 w-12 rounded-full border-2 opacity-60"
                    style={{
                      backgroundColor: getZoneColor(zone.grade) + "40",
                      borderColor: getZoneColor(zone.grade)
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {zone.grade}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={mapRef} className="h-96 w-full rounded-lg border border-slate-200 mb-4"></div>
        )}
        
        {/* Recent Alerts */}
        {alerts.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Recent Geofence Alerts</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {alerts.slice(-3).reverse().map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-center gap-2 rounded-lg p-2 text-sm border",
                    alert.type === "entry" && alert.zone.grade === "C" 
                      ? "bg-red-50 border-red-200 text-red-700"
                      : alert.type === "entry"
                      ? "bg-warning-50 border-warning-200 text-warning-700"
                      : "bg-green-50 border-green-200 text-green-700"
                  )}
                >
                  {alert.type === "entry" ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Shield className="h-4 w-4" />
                  )}
                  <span>
                    {alert.type === "entry" ? "Entered" : "Exited"} {alert.zone.area} 
                    ({alert.zone.grade}) at {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Crime Zones</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span>A+/A - Very Safe</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span>B - Caution Advised</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span>C/D/F - High Risk (Auto-match)</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Features</h4>
            <div className="space-y-1 text-sm text-slate-600">
              <div>✓ Real-time location tracking</div>
              <div>✓ Automatic geofence detection</div>
              <div>✓ Crime data by zipcode</div>
              <div>✓ Instant buddy matching alerts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
