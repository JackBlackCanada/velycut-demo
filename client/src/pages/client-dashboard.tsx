import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, DollarSign, MapPin, Clock, Star } from "lucide-react";
import BookingModal from "@/components/booking-modal";
import ReviewModal from "@/components/review-modal";
import { DashboardSkeleton, BookingCardSkeleton } from "@/components/loading-skeleton";

export default function ClientDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/bookings/user"],
    enabled: isAuthenticated && (user as any)?.userType === 'client',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (user && (user as any).userType !== 'client') {
      navigate('/stylist-dashboard');
    }
  }, [user, isLoading, isAuthenticated, navigate, toast]);

  const handleReviewBooking = (booking: any) => {
    setSelectedBookingForReview(booking);
    setShowReviewModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "Pending" },
      confirmed: { variant: "default", label: "Confirmed" },
      in_progress: { variant: "default", label: "In Progress" },
      completed: { variant: "outline", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  if (isLoading || bookingsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back, {(user as any)?.firstName || 'there'}!
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
              >
                Sign Out
              </Button>
              <Avatar>
                <AvatarImage src={(user as any)?.profileImageUrl || ''} />
                <AvatarFallback>{(user as any)?.firstName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="flex-1 bg-white text-primary hover:bg-gray-50"
              onClick={() => setShowBookingModal(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Book Now
            </Button>
            <Button 
              size="lg"
              variant="secondary"
              className="flex-1 bg-white bg-opacity-20 text-white hover:bg-opacity-30"
              onClick={() => navigate('/search')}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Find Stylists
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Bookings</h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                
                <div className="space-y-4">
                  {Array.isArray(bookings) && bookings.length > 0 ? (
                    bookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <Avatar className="w-16 h-16 mr-4">
                          <AvatarImage src={booking.stylist?.profileImageUrl || ''} />
                          <AvatarFallback>
                            {booking.stylist?.firstName?.[0]}{booking.stylist?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">
                              {booking.stylist?.firstName} {booking.stylist?.lastName}
                            </h4>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p className="text-gray-600 text-sm">{booking.service?.name}</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(booking.scheduledAt).toLocaleDateString()} • {new Date(booking.scheduledAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${booking.totalAmount}</p>
                          {booking.status === 'completed' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleReviewBooking(booking)}
                            >
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <i className="fas fa-calendar-alt text-4xl text-gray-300 mb-4"></i>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h4>
                      <p className="text-gray-600 mb-4">Start by booking your first hair service</p>
                      <Button onClick={() => setShowBookingModal(true)}>
                        Book Now
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bookings</span>
                    <span className="font-semibold">{Array.isArray(bookings) ? bookings.length : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-semibold">
                      {Array.isArray(bookings) ? 
                        bookings.filter((b: any) => 
                          new Date(b.scheduledAt).getMonth() === new Date().getMonth()
                        ).length : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-accent">
                      {Array.isArray(bookings) ? bookings.filter((b: any) => b.status === 'completed').length : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookingModal 
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />

      <ReviewModal 
        open={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedBookingForReview(null);
        }}
        booking={selectedBookingForReview}
      />
    </div>
  );
}
