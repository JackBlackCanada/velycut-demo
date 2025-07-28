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
import About from "@/pages/about";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import Contact from "@/pages/contact";
import Bookings from "@/pages/bookings";
import Competition from "@/pages/competition";
import ScheduleManagement from "@/pages/schedule-management";
import InAppMessaging from "@/components/InAppMessaging";
import LiveTracking from "@/components/LiveTracking";
import EnhancedBooking from "@/components/EnhancedBooking";
import VirtualConsultation from "@/components/VirtualConsultation";
import AIStyleRecommendations from "@/components/AIStyleRecommendations";
import SmartBookingWizard from "@/components/SmartBookingWizard";
import BookingStatusTracker from "@/components/BookingStatusTracker";
import AIStyleRecommendationsPage from "@/pages/ai-style-recommendations";
import SmartBookingPage from "@/pages/smart-booking-page";
import DemoModeToggle from "@/components/DemoModeToggle";

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
      <Route path="/about" component={About} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/contact" component={Contact} />
      <Route path="/bookings" component={Bookings} />
      <Route path="/competition" component={Competition} />
      <Route path="/schedule-management" component={ScheduleManagement} />
      <Route path="/messages" component={() => <InAppMessaging userType="client" userId="demo_client" />} />
      <Route path="/messages/:bookingId" component={({ params }) => <InAppMessaging userType="client" userId="demo_client" bookingId={params.bookingId} />} />
      <Route path="/tracking/:bookingId" component={({ params }) => <LiveTracking bookingId={params.bookingId} userType="client" />} />
      <Route path="/book-enhanced/:stylistId" component={({ params }) => <EnhancedBooking stylistId={params.stylistId} onBookingComplete={(id) => console.log('Booking created:', id)} />} />
      <Route path="/virtual-consultation/:stylistId" component={({ params }) => <VirtualConsultation stylistId={params.stylistId} onConsultationComplete={(results) => console.log('Consultation complete:', results)} />} />
      <Route path="/ai-recommendations" component={AIStyleRecommendationsPage} />
      <Route path="/smart-booking/:stylistId" component={SmartBookingPage} />
      <Route path="/booking-status/:bookingId" component={({ params }) => <BookingStatusTracker bookingId={params.bookingId} />} />
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
        <DemoModeToggle />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;