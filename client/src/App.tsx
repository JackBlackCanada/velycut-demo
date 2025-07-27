import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import ClientDashboard from "@/pages/client-dashboard";
import StylistDashboard from "@/pages/stylist-dashboard";
import SearchStylists from "@/pages/search-stylists";
import Checkout from "@/pages/checkout";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Prioritize showing landing page for unauthenticated users
  if (!isAuthenticated && !isLoading) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Show authenticated app when user is logged in
  if (isAuthenticated && user) {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/client-dashboard" component={ClientDashboard} />
        <Route path="/stylist-dashboard" component={StylistDashboard} />
        <Route path="/search-stylists" component={SearchStylists} />
        <Route path="/checkout" component={Checkout} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Only show loading spinner briefly during auth check
  return (
    <div className="app-container">
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;