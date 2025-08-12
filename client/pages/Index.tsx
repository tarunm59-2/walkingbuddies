import {
  Shield,
  MapPin,
  Users,
  AlertTriangle,
  Activity,
  Zap,
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import GeofenceMap from "@/components/dashboard/GeofenceMap";
import DeviceStatus from "@/components/dashboard/DeviceStatus";

export default function Index() {
  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-security-700 to-security-900 bg-clip-text text-transparent">
          Security Dashboard
        </h1>
        <p className="text-slate-600 mt-2 text-sm lg:text-base">
          Monitor geofences and unauthorized device activity in real-time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatsCard
          title="Active Geofences"
          value={12}
          change="+2 this week"
          changeType="positive"
          icon={<MapPin className="h-5 w-5 lg:h-6 lg:w-6 text-security-600" />}
        />
        <StatsCard
          title="Monitored Devices"
          value={847}
          change="+23 today"
          changeType="positive"
          icon={<Shield className="h-5 w-5 lg:h-6 lg:w-6 text-security-600" />}
        />
        <StatsCard
          title="Security Alerts"
          value={3}
          change="2 critical"
          changeType="negative"
          icon={
            <AlertTriangle className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />
          }
          className="border-red-200 bg-red-50/50"
        />
        <StatsCard
          title="Active Users"
          value={156}
          change="12 online now"
          changeType="neutral"
          icon={<Users className="h-5 w-5 lg:h-6 lg:w-6 text-security-600" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Map */}
        <div className="lg:col-span-2 order-1 lg:order-1">
          <GeofenceMap />
        </div>

        {/* Right Column - Activity */}
        <div className="order-2 lg:order-2">
          <ActivityFeed />
        </div>
      </div>

      {/* Bottom Section - Device Status */}
      <div className="mt-6 lg:mt-8">
        <DeviceStatus />
      </div>

      {/* Quick Actions */}
      <div className="mt-6 lg:mt-8 grid grid-cols-2 lg:flex lg:flex-wrap gap-3 lg:gap-4">
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-security-500 px-3 lg:px-4 py-3 text-sm font-medium text-white hover:bg-security-600 transition-colors shadow-lg shadow-security-500/25 col-span-2 lg:col-span-1">
          <MapPin className="h-4 w-4" />
          <span className="lg:inline">Create Geofence</span>
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-300 px-3 lg:px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <Shield className="h-4 w-4" />
          <span className="hidden lg:inline">Add Device</span>
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-300 px-3 lg:px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <Activity className="h-4 w-4" />
          <span className="hidden lg:inline">View Reports</span>
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-warning-500 to-warning-600 px-3 lg:px-4 py-3 text-sm font-medium text-white hover:from-warning-600 hover:to-warning-700 transition-all shadow-lg shadow-warning-500/25 col-span-2 lg:col-span-1">
          <Zap className="h-4 w-4" />
          <span className="lg:inline">Emergency Mode</span>
        </button>
      </div>
    </div>
  );
}
