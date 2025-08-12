import { AlertTriangle, Shield, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "alert" | "entry" | "exit" | "fence_created";
  device: string;
  location: string;
  timestamp: string;
  severity: "high" | "medium" | "low";
}

const mockActivity: ActivityItem[] = [
  {
    id: "1",
    type: "alert",
    device: "iPhone 14 Pro",
    location: "Restricted Zone A",
    timestamp: "2 minutes ago",
    severity: "high",
  },
  {
    id: "2",
    type: "entry",
    device: "Samsung Galaxy S23",
    location: "Main Campus",
    timestamp: "5 minutes ago",
    severity: "low",
  },
  {
    id: "3",
    type: "fence_created",
    device: "Admin User",
    location: "New Perimeter Zone",
    timestamp: "10 minutes ago",
    severity: "medium",
  },
  {
    id: "4",
    type: "exit",
    device: "iPad Air",
    location: "Secure Area B",
    timestamp: "15 minutes ago",
    severity: "low",
  },
];

const getActivityIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "alert":
      return <AlertTriangle className="h-4 w-4" />;
    case "entry":
      return <MapPin className="h-4 w-4" />;
    case "exit":
      return <MapPin className="h-4 w-4" />;
    case "fence_created":
      return <Shield className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getActivityColor = (severity: ActivityItem["severity"]) => {
  switch (severity) {
    case "high":
      return "text-red-600 bg-red-50 border-red-200";
    case "medium":
      return "text-warning-600 bg-warning-50 border-warning-200";
    case "low":
      return "text-success-600 bg-success-50 border-success-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

const getActivityText = (item: ActivityItem) => {
  switch (item.type) {
    case "alert":
      return `Unauthorized device ${item.device} detected in ${item.location}`;
    case "entry":
      return `${item.device} entered ${item.location}`;
    case "exit":
      return `${item.device} exited ${item.location}`;
    case "fence_created":
      return `New geofence "${item.location}" created`;
    default:
      return `Activity from ${item.device}`;
  }
};

export default function ActivityFeed() {
  return (
    <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Live Activity</h3>
        <p className="text-sm text-slate-600 mt-1">Real-time security events</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {mockActivity.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border",
                  getActivityColor(item.severity),
                )}
              >
                {getActivityIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 font-medium">
                  {getActivityText(item)}
                </p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.timestamp}
                </p>
              </div>

              {item.severity === "high" && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    Critical
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="w-full mt-4 text-sm text-security-600 hover:text-security-700 font-medium">
          View all activity →
        </button>
      </div>
    </div>
  );
}
