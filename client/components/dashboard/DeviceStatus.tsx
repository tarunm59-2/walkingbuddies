import { Smartphone, Tablet, Laptop, Shield, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Device {
  id: string;
  name: string;
  type: "mobile" | "tablet" | "laptop";
  status: "authorized" | "unauthorized" | "pending";
  location: string;
  lastSeen: string;
  battery?: number;
}

const mockDevices: Device[] = [
  {
    id: "1",
    name: "iPhone 14 Pro",
    type: "mobile",
    status: "unauthorized",
    location: "Restricted Zone A",
    lastSeen: "Now",
    battery: 78
  },
  {
    id: "2",
    name: "Samsung Galaxy S23",
    type: "mobile", 
    status: "authorized",
    location: "Main Campus",
    lastSeen: "2 min ago",
    battery: 92
  },
  {
    id: "3",
    name: "iPad Air",
    type: "tablet",
    status: "authorized",
    location: "Conference Room",
    lastSeen: "5 min ago",
    battery: 45
  },
  {
    id: "4",
    name: "MacBook Pro",
    type: "laptop",
    status: "pending",
    location: "Entrance",
    lastSeen: "1 min ago"
  }
];

const getDeviceIcon = (type: Device["type"]) => {
  switch (type) {
    case "mobile":
      return <Smartphone className="h-4 w-4" />;
    case "tablet":
      return <Tablet className="h-4 w-4" />;
    case "laptop":
      return <Laptop className="h-4 w-4" />;
    default:
      return <Smartphone className="h-4 w-4" />;
  }
};

const getStatusIcon = (status: Device["status"]) => {
  switch (status) {
    case "authorized":
      return <Shield className="h-4 w-4 text-success-600" />;
    case "unauthorized":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-warning-600" />;
    default:
      return <Shield className="h-4 w-4 text-slate-400" />;
  }
};

const getStatusColor = (status: Device["status"]) => {
  switch (status) {
    case "authorized":
      return "text-success-700 bg-success-50";
    case "unauthorized": 
      return "text-red-700 bg-red-50";
    case "pending":
      return "text-warning-700 bg-warning-50";
    default:
      return "text-slate-700 bg-slate-50";
  }
};

export default function DeviceStatus() {
  return (
    <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Device Status</h3>
            <p className="text-sm text-slate-600 mt-1">Recent device activity</p>
          </div>
          <button className="text-sm text-security-600 hover:text-security-700 font-medium">
            View all →
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {mockDevices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  {getDeviceIcon(device.type)}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{device.name}</p>
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                      getStatusColor(device.status)
                    )}>
                      {getStatusIcon(device.status)}
                      {device.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-slate-500">{device.location}</p>
                    <p className="text-sm text-slate-400">• {device.lastSeen}</p>
                    {device.battery && (
                      <p className="text-sm text-slate-400">• {device.battery}% battery</p>
                    )}
                  </div>
                </div>
              </div>
              
              {device.status === "unauthorized" && (
                <button className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors">
                  <AlertTriangle className="h-4 w-4" />
                  Block
                </button>
              )}
              
              {device.status === "pending" && (
                <div className="flex gap-2">
                  <button className="rounded-lg bg-success-100 px-3 py-2 text-sm font-medium text-success-700 hover:bg-success-200 transition-colors">
                    Approve
                  </button>
                  <button className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors">
                    Deny
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
