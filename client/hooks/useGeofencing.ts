import { useState, useEffect, useRef, useCallback } from "react";
import {
  crimeDataService,
  type GeofenceZone,
} from "@/services/crimeDataService";
import { errorLogger } from "@/services/errorLogger";

export interface GeofenceAlert {
  id: string;
  type: "entry" | "exit" | "buddy_request";
  zone: GeofenceZone;
  timestamp: Date;
  severity: "low" | "medium" | "high";
  message: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: Date;
}

export interface GeofencingState {
  userLocation: UserLocation | null;
  isTracking: boolean;
  permissionStatus: "granted" | "denied" | "prompt";
  zones: GeofenceZone[];
  alerts: GeofenceAlert[];
  activeZones: GeofenceZone[];
  buddyRequests: number;
}

export function useGeofencing() {
  const [state, setState] = useState<GeofencingState>({
    userLocation: null,
    isTracking: false,
    permissionStatus: "prompt",
    zones: [],
    alerts: [],
    activeZones: [],
    buddyRequests: 0,
  });

  const watchIdRef = useRef<number | null>(null);
  const lastAlertTimeRef = useRef<Map<string, number>>(new Map());
  const ALERT_COOLDOWN = 60000; // 1 minute cooldown between alerts for same zone

  // NYC zipcodes to monitor (can be expanded)
  const MONITORED_ZIPCODES = [
    "10001",
    "10002",
    "10003",
    "10004",
    "10009",
    "10010",
    "10011",
    "10012",
    "10013",
    "10014",
  ];

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback(
    (lat1: number, lng1: number, lat2: number, lng2: number): number => {
      const R = 6371000; // Earth's radius in meters
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lng2 - lng1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // Distance in meters
    },
    [],
  );

  // Check if user is inside a geofence zone
  const isInsideZone = useCallback(
    (userLat: number, userLng: number, zone: GeofenceZone): boolean => {
      const distance = calculateDistance(userLat, userLng, zone.lat, zone.lng);
      return distance <= zone.radius;
    },
    [calculateDistance],
  );

  // Create alert for zone entry/exit
  const createAlert = useCallback(
    (type: GeofenceAlert["type"], zone: GeofenceZone): GeofenceAlert => {
      const severity: GeofenceAlert["severity"] =
        zone.grade === "C" || zone.grade === "D" || zone.grade === "F"
          ? "high"
          : zone.grade === "B"
            ? "medium"
            : "low";

      let message = "";
      switch (type) {
        case "entry":
          if (severity === "high") {
            message = `⚠️ You've entered ${zone.area}, a high-crime area (Grade ${zone.grade}). Consider finding a walking buddy!`;
          } else if (severity === "medium") {
            message = `⚡ Entered ${zone.area} (Grade ${zone.grade}). Stay alert and consider walking with others.`;
          } else {
            message = `✅ Entered ${zone.area} (Grade ${zone.grade}). This is a relatively safe area.`;
          }
          break;
        case "exit":
          message = `🚶 Left ${zone.area}. Stay safe!`;
          break;
        case "buddy_request":
          message = `👥 Buddy request sent for ${zone.area}. Matching with nearby users...`;
          break;
      }

      return {
        id: `${zone.zipcode}-${type}-${Date.now()}`,
        type,
        zone,
        timestamp: new Date(),
        severity,
        message,
      };
    },
    [],
  );

  // Show browser notification
  const showNotification = useCallback((alert: GeofenceAlert) => {
    if (Notification.permission === "granted") {
      const notification = new Notification(
        alert.severity === "high" ? "High-Crime Area Alert" : "Location Alert",
        {
          body: alert.message,
          icon: "/favicon.ico",
          tag: alert.zone.zipcode, // Prevent duplicate notifications
          requireInteraction: alert.severity === "high",
        },
      );

      // Auto-close notification after 5 seconds for non-critical alerts
      if (alert.severity !== "high") {
        setTimeout(() => notification.close(), 5000);
      }
    }
  }, []);

  // Auto-request buddy for high-crime areas
  const autoRequestBuddy = useCallback(
    (zone: GeofenceZone) => {
      if (zone.grade === "C" || zone.grade === "D" || zone.grade === "F") {
        setState((prev) => {
          const buddyAlert = createAlert("buddy_request", zone);
          return {
            ...prev,
            buddyRequests: prev.buddyRequests + 1,
            alerts: [...prev.alerts, buddyAlert],
          };
        });

        // Simulate buddy matching API call
        setTimeout(() => {
          console.log(`🤝 Auto-matching buddy for ${zone.area}...`);
          // In production: call buddy matching API
        }, 2000);
      }
    },
    [createAlert],
  );

  // Process location update and check geofences
  const processLocationUpdate = useCallback(
    (location: UserLocation) => {
      setState((prev) => {
        const newActiveZones: GeofenceZone[] = [];
        const newAlerts: GeofenceAlert[] = [];
        const now = Date.now();

        // Check each zone for entry/exit
        prev.zones.forEach((zone) => {
          const isInside = isInsideZone(location.lat, location.lng, zone);
          const wasInside = prev.activeZones.some(
            (az) => az.zipcode === zone.zipcode,
          );
          const lastAlert = lastAlertTimeRef.current.get(zone.zipcode) || 0;

          if (isInside) {
            newActiveZones.push(zone);

            // Zone entry
            if (!wasInside && now - lastAlert > ALERT_COOLDOWN) {
              const alert = createAlert("entry", zone);
              newAlerts.push(alert);
              showNotification(alert);
              lastAlertTimeRef.current.set(zone.zipcode, now);

              // Auto-request buddy for dangerous areas
              autoRequestBuddy(zone);
            }
          } else if (wasInside && now - lastAlert > ALERT_COOLDOWN) {
            // Zone exit
            const alert = createAlert("exit", zone);
            newAlerts.push(alert);
            lastAlertTimeRef.current.set(zone.zipcode, now);
          }
        });

        return {
          ...prev,
          userLocation: location,
          activeZones: newActiveZones,
          alerts: [...prev.alerts, ...newAlerts].slice(-20), // Keep last 20 alerts
        };
      });
    },
    [isInsideZone, createAlert, showNotification, autoRequestBuddy],
  );

  // Start location tracking
  const startTracking = useCallback(async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported in this browser");
      setState((prev) => ({
        ...prev,
        permissionStatus: "denied",
        isTracking: false,
      }));
      return false;
    }

    try {
      // Request permission with better error handling
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            (error) => {
              errorLogger.logGeolocationError(error, "startTracking");
              const errorMessage = errorLogger.getErrorSuggestion(error);
              console.error("Geolocation error:", errorMessage, error);
              reject(new Error(errorMessage));
            },
            {
              enableHighAccuracy: true,
              timeout: 15000, // Increased timeout
              maximumAge: 60000, // Allow 1 minute old location
            },
          );
        },
      );

      setState((prev) => ({
        ...prev,
        permissionStatus: "granted",
        isTracking: true,
      }));

      // Initial location update
      const initialLocation: UserLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(),
      };

      processLocationUpdate(initialLocation);

      // Start watching location with better error handling
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const location: UserLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: new Date(),
          };
          processLocationUpdate(location);
        },
        (error) => {
          errorLogger.logGeolocationError(error, "watchPosition");
          const errorMessage = errorLogger.getErrorSuggestion(error);

          if (error.code === error.PERMISSION_DENIED) {
            setState((prev) => ({
              ...prev,
              permissionStatus: "denied",
              isTracking: false,
            }));
          }

          console.error(errorMessage, error);
        },
        {
          enableHighAccuracy: false, // Less strict for continuous tracking
          maximumAge: 60000, // 1 minute
          timeout: 15000, // 15 seconds
        },
      );

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to start location tracking";
      console.error(errorMessage, error);

      setState((prev) => ({
        ...prev,
        permissionStatus: "denied",
        isTracking: false,
      }));

      // Use demo location for testing when permission is denied
      useDemoLocation();
      return false;
    }
  }, [processLocationUpdate]);

  // Use demo location for testing when real location is unavailable
  const useDemoLocation = useCallback(() => {
    const demoLocation: UserLocation = {
      lat: 40.7589, // Manhattan center
      lng: -73.9851,
      accuracy: 10,
      timestamp: new Date(),
    };

    processLocationUpdate(demoLocation);

    // Simulate movement for demo purposes
    let moveCount = 0;
    const demoInterval = setInterval(() => {
      moveCount++;
      if (moveCount > 5) {
        clearInterval(demoInterval);
        return;
      }

      const randomOffset = 0.001; // Small movement
      const newLocation: UserLocation = {
        lat: demoLocation.lat + (Math.random() - 0.5) * randomOffset,
        lng: demoLocation.lng + (Math.random() - 0.5) * randomOffset,
        accuracy: 10,
        timestamp: new Date(),
      };

      processLocationUpdate(newLocation);
    }, 5000); // Move every 5 seconds
  }, [processLocationUpdate]);

  // Stop location tracking
  const stopTracking = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState((prev) => ({ ...prev, isTracking: false }));
  }, []);

  // Request buddy manually
  const requestBuddy = useCallback(
    (zoneZipcode?: string) => {
      const zone = zoneZipcode
        ? state.zones.find((z) => z.zipcode === zoneZipcode)
        : state.activeZones.find(
            (z) => z.grade === "C" || z.grade === "D" || z.grade === "F",
          );

      if (zone) {
        setState((prev) => {
          const buddyAlert = createAlert("buddy_request", zone);
          return {
            ...prev,
            buddyRequests: prev.buddyRequests + 1,
            alerts: [...prev.alerts, buddyAlert],
          };
        });

        // In production: call buddy matching API
        console.log(`🤝 Manual buddy request for ${zone.area}...`);
      }
    },
    [state.zones, state.activeZones, createAlert],
  );

  // Clear old alerts
  const clearAlert = useCallback((alertId: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((alert) => alert.id !== alertId),
    }));
  }, []);

  // Initialize geofence zones
  useEffect(() => {
    const loadZones = async () => {
      try {
        const zones =
          await crimeDataService.createGeofenceZones(MONITORED_ZIPCODES);
        setState((prev) => ({ ...prev, zones }));
      } catch (error) {
        console.error("Failed to load geofence zones:", error);
      }
    };

    loadZones();
  }, []);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startTracking,
    stopTracking,
    requestBuddy,
    clearAlert,
    isInDangerZone: state.activeZones.some(
      (zone) => zone.grade === "C" || zone.grade === "D" || zone.grade === "F",
    ),
  };
}
