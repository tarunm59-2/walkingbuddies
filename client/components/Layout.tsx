import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, MapPin, Settings, Activity, AlertTriangle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: Activity },
  { name: "Geofences", href: "/geofences", icon: MapPin },
  { name: "Devices", href: "/devices", icon: Shield },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle, badge: 3 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 shadow-xl">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-security-500 to-security-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-security-600 to-security-700 bg-clip-text text-transparent">
                GeoGuard
              </span>
              <span className="text-xs text-slate-500">Security Platform</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-security-500 to-security-600 text-white shadow-lg shadow-security-500/25"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                    )}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium",
                      isActive 
                        ? "bg-white/20 text-white" 
                        : "bg-warning-500 text-white"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Status indicator */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 rounded-lg bg-success-50 px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-success-500"></div>
              <span className="text-sm font-medium text-success-700">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
