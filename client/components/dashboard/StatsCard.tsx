import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: ReactNode;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  className
}: StatsCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 p-4 lg:p-6 shadow-sm hover:shadow-md transition-all duration-200",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-medium text-slate-600 truncate">{title}</p>
          <p className="text-xl lg:text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {change && (
            <p className={cn(
              "text-xs lg:text-sm mt-1 lg:mt-2 flex items-center gap-1 truncate",
              changeType === "positive" && "text-success-600",
              changeType === "negative" && "text-warning-600",
              changeType === "neutral" && "text-slate-500"
            )}>
              {change}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-lg bg-gradient-to-br from-security-50 to-security-100 flex-shrink-0 ml-2">
          {icon}
        </div>
      </div>
    </div>
  );
}
