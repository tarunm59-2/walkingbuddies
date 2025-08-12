import {
  Heart,
  MapPin,
  Users,
  AlertTriangle,
  Activity,
  Zap,
  Shield,
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import BuddyCard from "@/components/buddies/BuddyCard";
import GoogleMapsGeofence from "@/components/maps/GoogleMapsGeofence";
import BuddyMatcher from "@/components/buddies/BuddyMatcher";
import { useGeofencing } from "@/hooks/useGeofencing";

const mockBuddies = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "",
    rating: 4.9,
    reviewCount: 127,
    distance: "0.3 mi",
    lastSeen: "2 min ago",
    isOnline: true,
    preferredAreas: ["Financial District", "Chelsea", "Greenwich Village"],
    walkCount: 89,
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    avatar: "",
    rating: 4.7,
    reviewCount: 93,
    distance: "0.5 mi",
    lastSeen: "5 min ago",
    isOnline: true,
    preferredAreas: ["East Village", "SoHo"],
    walkCount: 67,
  },
  {
    id: "3",
    name: "Emma Johnson",
    avatar: "",
    rating: 4.8,
    reviewCount: 156,
    distance: "0.7 mi",
    lastSeen: "10 min ago",
    isOnline: false,
    preferredAreas: ["Brooklyn Heights", "DUMBO", "Park Slope"],
    walkCount: 134,
  },
];

export default function Index() {
  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-safety-700 to-safety-900 bg-clip-text text-transparent">
          Find Walking Buddies
        </h1>
        <p className="text-slate-600 mt-2 text-sm lg:text-base">
          Stay safe in high-crime areas by walking with trusted companions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatsCard
          title="Available Buddies"
          value={23}
          change="+5 online now"
          changeType="positive"
          icon={<Users className="h-5 w-5 lg:h-6 lg:w-6 text-safety-600" />}
        />
        <StatsCard
          title="Safe Walks This Week"
          value={142}
          change="+18% from last week"
          changeType="positive"
          icon={<Heart className="h-5 w-5 lg:h-6 lg:w-6 text-safety-600" />}
        />
        <StatsCard
          title="High-Risk Areas"
          value={3}
          change="2 require buddies"
          changeType="negative"
          icon={
            <AlertTriangle className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />
          }
          className="border-red-200 bg-red-50/50"
        />
        <StatsCard
          title="Your Safety Score"
          value="4.9★"
          change="98% positive reviews"
          changeType="positive"
          icon={<Shield className="h-5 w-5 lg:h-6 lg:w-6 text-safety-600" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Crime Map */}
        <div className="lg:col-span-2 order-1 lg:order-1">
          <CrimeZoneMap />
        </div>

        {/* Right Column - Buddy Matcher */}
        <div className="order-2 lg:order-2">
          <BuddyMatcher />
        </div>
      </div>

      {/* Available Buddies Section */}
      <div className="mt-6 lg:mt-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Available Walking Buddies
          </h2>
          <p className="text-slate-600 text-sm">
            Connect with trusted companions near you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {mockBuddies.map((buddy) => (
            <BuddyCard key={buddy.id} {...buddy} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 lg:mt-8 grid grid-cols-2 lg:flex lg:flex-wrap gap-3 lg:gap-4">
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-safety-500 px-3 lg:px-4 py-3 text-sm font-medium text-white hover:bg-safety-600 transition-colors shadow-lg shadow-safety-500/25 col-span-2 lg:col-span-1">
          <Users className="h-4 w-4" />
          <span className="lg:inline">Request Walking Buddy</span>
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-300 px-3 lg:px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <MapPin className="h-4 w-4" />
          <span className="hidden lg:inline">Find Safe Route</span>
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-300 px-3 lg:px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <Activity className="h-4 w-4" />
          <span className="hidden lg:inline">View Walk History</span>
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3 lg:px-4 py-3 text-sm font-medium text-white hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/25 col-span-2 lg:col-span-1">
          <Zap className="h-4 w-4" />
          <span className="lg:inline">Emergency Buddy Request</span>
        </button>
      </div>
    </div>
  );
}
