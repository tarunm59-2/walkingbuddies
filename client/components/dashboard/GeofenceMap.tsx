import { MapPin, Zap, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeofenceZone {
  id: string;
  name: string;
  status: "active" | "inactive";
  devices: number;
  alerts: number;
  position: { x: number; y: number };
}

const mockZones: GeofenceZone[] = [
  {
    id: "1",
    name: "Main Campus",
    status: "active",
    devices: 23,
    alerts: 0,
    position: { x: 30, y: 40 },
  },
  {
    id: "2",
    name: "Restricted Zone A",
    status: "active",
    devices: 2,
    alerts: 3,
    position: { x: 70, y: 25 },
  },
  {
    id: "3",
    name: "Parking Area",
    status: "active",
    devices: 15,
    alerts: 0,
    position: { x: 20, y: 70 },
  },
  {
    id: "4",
    name: "Maintenance Zone",
    status: "inactive",
    devices: 0,
    alerts: 0,
    position: { x: 80, y: 60 },
  },
];

export default function GeofenceMap() {
  return (
    <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Geofence Overview
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Monitor all active zones
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-security-500 px-3 py-2 text-sm font-medium text-white hover:bg-security-600 transition-colors">
            <MapPin className="h-4 w-4" />
            Create Zone
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Map Area */}
        <div className="relative h-80 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" className="h-full w-full">
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Geofence zones */}
          {mockZones.map((zone) => (
            <div
              key={zone.id}
              className="absolute group cursor-pointer"
              style={{
                left: `${zone.position.x}%`,
                top: `${zone.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Zone circle */}
              <div
                className={cn(
                  "relative h-16 w-16 rounded-full border-2 transition-all duration-200 group-hover:scale-110",
                  zone.status === "active"
                    ? zone.alerts > 0
                      ? "bg-red-100 border-red-400 shadow-lg shadow-red-400/25"
                      : "bg-security-100 border-security-400 shadow-lg shadow-security-400/25"
                    : "bg-slate-100 border-slate-300",
                )}
              >
                {/* Pulse animation for active zones with alerts */}
                {zone.status === "active" && zone.alerts > 0 && (
                  <div className="absolute inset-0 rounded-full bg-red-400 animate-pulse-ring"></div>
                )}

                {/* Zone icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {zone.alerts > 0 ? (
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  ) : zone.status === "active" ? (
                    <Shield className="h-6 w-6 text-security-600" />
                  ) : (
                    <Shield className="h-6 w-6 text-slate-400" />
                  )}
                </div>

                {/* Alert badge */}
                {zone.alerts > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {zone.alerts}
                    </span>
                  </div>
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                  <div className="font-medium">{zone.name}</div>
                  <div className="text-slate-300">
                    {zone.devices} devices • {zone.alerts} alerts
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-security-400"></div>
              <span className="text-sm text-slate-600">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <span className="text-sm text-slate-600">Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-slate-300"></div>
              <span className="text-sm text-slate-600">Inactive</span>
            </div>
          </div>

          <button className="text-sm text-security-600 hover:text-security-700 font-medium">
            View full map →
          </button>
        </div>
      </div>
    </div>
  );
}
