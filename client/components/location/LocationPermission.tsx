import { useState } from "react";
import { MapPin, Shield, AlertTriangle, RefreshCw, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import ManualLocationInput from "./ManualLocationInput";

interface LocationPermissionProps {
  status: "granted" | "denied" | "prompt";
  isTracking: boolean;
  onRequestPermission: () => void;
  onUseDemoMode: () => void;
  onManualLocation?: (lat: number, lng: number, address: string) => void;
}

export default function LocationPermission({ 
  status, 
  isTracking, 
  onRequestPermission, 
  onUseDemoMode 
}: LocationPermissionProps) {
  if (status === "granted" && isTracking) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm">
        <MapPin className="h-4 w-4 text-green-600" />
        <span className="text-green-700">Location tracking active</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm p-6">
      <div className="text-center">
        <div className={cn(
          "inline-flex items-center justify-center w-12 h-12 rounded-full mb-4",
          status === "denied" 
            ? "bg-warning-100 text-warning-600"
            : "bg-safety-100 text-safety-600"
        )}>
          {status === "denied" ? (
            <AlertTriangle className="h-6 w-6" />
          ) : (
            <MapPin className="h-6 w-6" />
          )}
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {status === "denied" 
            ? "Location Access Needed" 
            : "Enable Location Tracking"
          }
        </h3>

        <p className="text-slate-600 mb-6 max-w-md">
          {status === "denied" 
            ? "Location access was denied. SafeWalk needs your location to detect when you enter high-crime areas and automatically find walking buddies."
            : "Allow location access to enable real-time safety features including crime zone detection and automatic buddy matching."
          }
        </p>

        <div className="space-y-3">
          <button
            onClick={onRequestPermission}
            className="inline-flex items-center gap-2 rounded-lg bg-safety-500 px-4 py-3 text-sm font-medium text-white hover:bg-safety-600 transition-colors w-full justify-center"
          >
            <RefreshCw className="h-4 w-4" />
            {status === "denied" ? "Try Again" : "Enable Location"}
          </button>

          <button
            onClick={onUseDemoMode}
            className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full justify-center"
          >
            <Shield className="h-4 w-4" />
            Continue in Demo Mode
          </button>
        </div>

        {status === "denied" && (
          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-medium text-slate-900 mb-2">
              How to enable location:
            </h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div>1. Click the location icon in your browser's address bar</div>
              <div>2. Select "Allow" for location access</div>
              <div>3. Refresh the page if needed</div>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 justify-center">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>Privacy Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
