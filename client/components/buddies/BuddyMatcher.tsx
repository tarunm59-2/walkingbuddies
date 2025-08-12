import { Users, MapPin, Clock, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchRequest {
  id: string;
  fromLocation: string;
  toLocation: string;
  timeRequested: string;
  urgency: "low" | "medium" | "high";
  riskLevel: "safe" | "caution" | "danger";
  availableBuddies: number;
}

const mockRequests: MatchRequest[] = [
  {
    id: "1",
    fromLocation: "East Village Station",
    toLocation: "Home (Brooklyn Heights)",
    timeRequested: "Now",
    urgency: "high",
    riskLevel: "danger",
    availableBuddies: 3,
  },
  {
    id: "2",
    fromLocation: "Coffee Shop (Chelsea)",
    toLocation: "Grand Central",
    timeRequested: "15 min",
    urgency: "medium",
    riskLevel: "caution",
    availableBuddies: 7,
  },
];

const getUrgencyColor = (urgency: MatchRequest["urgency"]) => {
  switch (urgency) {
    case "high":
      return "bg-red-50 border-red-200 text-red-700";
    case "medium":
      return "bg-warning-50 border-warning-200 text-warning-700";
    case "low":
      return "bg-green-50 border-green-200 text-green-700";
  }
};

const getRiskColor = (risk: MatchRequest["riskLevel"]) => {
  switch (risk) {
    case "danger":
      return "text-red-600 bg-red-100";
    case "caution":
      return "text-warning-600 bg-warning-100";
    case "safe":
      return "text-green-600 bg-green-100";
  }
};

export default function BuddyMatcher() {
  return (
    <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Buddy Matching
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Find walking partners for unsafe areas
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-safety-500 px-3 py-2 text-sm font-medium text-white hover:bg-safety-600 transition-colors">
            <Users className="h-4 w-4" />
            Request Buddy
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Active requests */}
        <div className="space-y-4 mb-6">
          {mockRequests.map((request) => (
            <div
              key={request.id}
              className={cn(
                "rounded-lg border p-4 transition-all duration-200",
                getUrgencyColor(request.urgency),
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Walking Request</span>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                      getRiskColor(request.riskLevel),
                    )}
                  >
                    {request.riskLevel} area
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{request.timeRequested}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">From:</span>
                  <span>{request.fromLocation}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">To:</span>
                  <span>{request.toLocation}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    <span className="font-medium">
                      {request.availableBuddies}
                    </span>{" "}
                    buddies available
                  </span>
                </div>

                <div className="flex gap-2">
                  {request.urgency === "high" && (
                    <button className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors">
                      <Zap className="h-4 w-4" />
                      Emergency Match
                    </button>
                  )}
                  <button className="inline-flex items-center gap-1 rounded-lg bg-safety-500 px-3 py-2 text-sm font-medium text-white hover:bg-safety-600 transition-colors">
                    <Users className="h-4 w-4" />
                    Find Buddy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick start */}
        <div className="border-t border-slate-200 pt-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-4">
            Quick Match
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <MapPin className="h-4 w-4" />
              Current Location
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Clock className="h-4 w-4" />
              Walk Home
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-red-100 border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors">
              <Zap className="h-4 w-4" />
              Emergency
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
