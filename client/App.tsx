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
              path="/safety-map"
              element={
                <PlaceholderPage
                  title="Safety Map"
                  description="View crime data by zipcode and see real-time safety zones. Avoid high-crime areas and find safe routes."
                />
              }
            />
            <Route
              path="/buddies"
              element={
                <PlaceholderPage
                  title="My Walking Buddies"
                  description="Manage your trusted walking partners, view their profiles, and see availability for safe walks."
                />
              }
            />
            <Route
              path="/messages"
              element={
                <PlaceholderPage
                  title="Messages"
                  description="Chat with your walking buddies, coordinate meetups, and share safety updates."
                />
              }
            />
            <Route
              path="/safe-places"
              element={
                <PlaceholderPage
                  title="Safe Meeting Places"
                  description="Discover vetted safe meeting spots like 24/7 stores, police stations, and well-lit public areas."
                />
              }
            />
            <Route
              path="/reviews"
              element={
                <PlaceholderPage
                  title="Reviews & Ratings"
                  description="Rate your walking experiences and review safety buddies to help build a trusted community."
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

const rootElement = document.getElementById("root")!;

// Check if root already exists to prevent double mounting in dev mode
if (!rootElement.hasAttribute('data-react-root')) {
  rootElement.setAttribute('data-react-root', 'true');
  const root = createRoot(rootElement);
  root.render(<App />);
}
