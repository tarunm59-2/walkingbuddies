import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import PlaceholderPage from "./components/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/geofences"
              element={
                <PlaceholderPage
                  title="Geofence Management"
                  description="Create and manage geographic boundaries for device monitoring. Set up virtual perimeters and configure alert rules."
                />
              }
            />
            <Route
              path="/devices"
              element={
                <PlaceholderPage
                  title="Device Management"
                  description="Monitor and control authorized and unauthorized devices within your geofences. View device status and location history."
                />
              }
            />
            <Route
              path="/alerts"
              element={
                <PlaceholderPage
                  title="Security Alerts"
                  description="View and manage security alerts for unauthorized device entries and geofence violations."
                />
              }
            />
            <Route
              path="/users"
              element={
                <PlaceholderPage
                  title="User Management"
                  description="Manage user accounts, permissions, and access levels for your security platform."
                />
              }
            />
            <Route
              path="/settings"
              element={
                <PlaceholderPage
                  title="System Settings"
                  description="Configure system preferences, notifications, and security parameters."
                />
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
