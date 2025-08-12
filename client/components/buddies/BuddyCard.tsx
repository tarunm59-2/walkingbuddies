import { Star, MapPin, Clock, MessageCircle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuddyCardProps {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  distance: string;
  lastSeen: string;
  isOnline: boolean;
  preferredAreas: string[];
  walkCount: number;
}

export default function BuddyCard({
  name,
  avatar,
  rating,
  reviewCount,
  distance,
  lastSeen,
  isOnline,
  preferredAreas,
  walkCount,
}: BuddyCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-safety-100 to-safety-200 flex items-center justify-center">
            <span className="text-lg font-semibold text-safety-700">
              {name.charAt(0)}
            </span>
          </div>
          {/* Online indicator */}
          <div
            className={cn(
              "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white",
              isOnline ? "bg-buddy-online" : "bg-buddy-offline",
            )}
          ></div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 truncate">{name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-warning-500 fill-current" />
              <span className="text-sm font-medium text-slate-700">
                {rating}
              </span>
              <span className="text-sm text-slate-500">({reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{lastSeen}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {preferredAreas.slice(0, 2).map((area, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-safety-50 px-2 py-1 text-xs font-medium text-safety-700"
              >
                {area}
              </span>
            ))}
            {preferredAreas.length > 2 && (
              <span className="text-xs text-slate-500">
                +{preferredAreas.length - 2} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {walkCount} walks completed
            </span>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1 rounded-lg bg-safety-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-safety-600 transition-colors">
                <MessageCircle className="h-3 w-3" />
                Chat
              </button>
              <button className="inline-flex items-center gap-1 rounded-lg bg-safety-100 px-3 py-1.5 text-sm font-medium text-safety-700 hover:bg-safety-200 transition-colors">
                <Heart className="h-3 w-3" />
                Walk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
