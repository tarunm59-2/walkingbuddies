import {
  AlertTriangle,
  Shield,
  MapPin,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CrimeZone {
  id: string;
  zipcode: string;
  area: string;
  crimeGrade: "A+" | "A" | "B" | "C" | "D" | "F";
  crimeRate: number;
  trend: "up" | "down" | "stable";
  position: { x: number; y: number };
  incidents: number;
}

const mockCrimeZones: CrimeZone[] = [
  {
    id: "1",
    zipcode: "10001",
    area: "Chelsea",
    crimeGrade: "B",
    crimeRate: 12.3,
    trend: "down",
    position: { x: 25, y: 30 },
    incidents: 23,
  },
  {
    id: "2",
    zipcode: "10002",
    area: "East Village",
    crimeGrade: "C",
    crimeRate: 18.7,
    trend: "up",
    position: { x: 60, y: 40 },
    incidents: 45,
  },
  {
    id: "3",
    zipcode: "10003",
    area: "Greenwich Village",
    crimeGrade: "A",
    crimeRate: 8.2,
    trend: "stable",
    position: { x: 35, y: 60 },
    incidents: 12,
  },
  {
    id: "4",
    zipcode: "10004",
    area: "Financial District",
    crimeGrade: "A+",
    crimeRate: 4.1,
    trend: "down",
    position: { x: 75, y: 70 },
    incidents: 6,
  },
];

const getGradeColor = (grade: CrimeZone["crimeGrade"]) => {
  switch (grade) {
    case "A+":
    case "A":
      return "bg-zone-safe border-zone-safe shadow-zone-safe/25";
    case "B":
      return "bg-zone-caution border-zone-caution shadow-zone-caution/25";
    case "C":
    case "D":
    case "F":
      return "bg-zone-danger border-zone-danger shadow-zone-danger/25";
    default:
      return "bg-slate-100 border-slate-300";
  }
};

const getTrendIcon = (trend: CrimeZone["trend"]) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-3 w-3 text-red-600" />;
    case "down":
      return <TrendingDown className="h-3 w-3 text-green-600" />;
    default:
      return <div className="h-3 w-3 rounded-full bg-slate-400"></div>;
  }
};

export default function CrimeZoneMap() {
  return (
    <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Crime Safety Map
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Real-time crime data by zipcode
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-safety-500 px-3 py-2 text-sm font-medium text-white hover:bg-safety-600 transition-colors">
            <MapPin className="h-4 w-4" />
            Find Safe Route
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Map Area */}
        <div className="relative h-80 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 overflow-hidden mb-6">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="h-full w-full">
              <defs>
                <pattern
                  id="crime-grid"
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
              <rect width="100%" height="100%" fill="url(#crime-grid)" />
            </svg>
          </div>

          {/* Crime zones */}
          {mockCrimeZones.map((zone) => (
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
                  getGradeColor(zone.crimeGrade),
                )}
              >
                {/* Grade indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-bold text-white text-sm">
                    {zone.crimeGrade}
                  </span>
                </div>

                {/* Trend indicator */}
                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                  {getTrendIcon(zone.trend)}
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                  <div className="font-medium">
                    {zone.area} ({zone.zipcode})
                  </div>
                  <div className="text-slate-300">
                    Grade {zone.crimeGrade} • {zone.crimeRate}/1000 crime rate
                  </div>
                  <div className="text-slate-300">
                    {zone.incidents} incidents this month
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Current location indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-4 w-4 rounded-full bg-safety-500 border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute inset-0 h-4 w-4 rounded-full bg-safety-500 animate-ping"></div>
          </div>
        </div>

        {/* Legend & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Legend */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">
              Safety Grades
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-zone-safe"></div>
                <span className="text-sm text-slate-600">A+/A - Very Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-zone-caution"></div>
                <span className="text-sm text-slate-600">
                  B - Caution Advised
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-zone-danger"></div>
                <span className="text-sm text-slate-600">
                  C/D/F - High Risk
                </span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">
              Area Summary
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Safest Area:</span>
                <span className="font-medium text-green-700">
                  Financial District (A+)
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Avoid Area:</span>
                <span className="font-medium text-red-700">
                  East Village (C)
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Trending Better:</span>
                <span className="font-medium text-green-700">2 areas ↓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
