import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Home from "@/pages/home";
import ClientDashboard from "@/pages/client-dashboard";
import StylistDashboard from "@/pages/stylist-dashboard";
import SearchStylists from "@/pages/search-stylists";
import Checkout from "@/pages/checkout";
import ReferEarn from "@/pages/refer-earn";
import StylistOnboarding from "@/pages/stylist-onboarding";
import Earnings from "@/pages/earnings";
import BookService from "@/pages/book-service";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <Switch>
      {/* Always allow access to all pages for demo purposes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/home" component={Home} />
      <Route path="/client-dashboard" component={ClientDashboard} />
      <Route path="/stylist-dashboard" component={StylistDashboard} />
      <Route path="/search-stylists" component={SearchStylists} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/refer-earn" component={ReferEarn} />
      <Route path="/stylist-onboarding" component={StylistOnboarding} />
      <Route path="/earnings" component={Earnings} />
      <Route path="/book-service" component={BookService} />
      <Route component={NotFound} />
    </Switch>
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