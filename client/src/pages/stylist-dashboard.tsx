import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function StylistDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/bookings/user"],
    enabled: isAuthenticated && user?.userType === 'stylist',
  });

  const availabilityMutation = useMutation({
    mutationFn: async (isAvailable: boolean) => {
      return await apiRequest("PATCH", "/api/stylists/availability", { isAvailable });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Availability Updated",
        description: "Your availability has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update availability. Please try again.",
        variant: "destructive",
      });
    },
  });

  const bookingStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      return await apiRequest("PATCH", `/api/bookings/${bookingId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/user"] });
      toast({
        title: "Booking Updated",
        description: "Booking status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    },
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

    if (user && user.userType !== 'stylist') {
      navigate('/client-dashboard');
    }
  }, [user, isLoading, isAuthenticated, navigate, toast]);

  const handleAvailabilityToggle = (isAvailable: boolean) => {
    availabilityMutation.mutate(isAvailable);
  };

  const handleBookingAction = (bookingId: string, status: string) => {
    bookingStatusMutation.mutate({ bookingId, status });
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

  const todayBookings = bookings?.filter((booking: any) => {
    const today = new Date();
    const bookingDate = new Date(booking.scheduledAt);
    return bookingDate.toDateString() === today.toDateString();
  }) || [];

  const completedBookings = bookings?.filter((booking: any) => booking.status === 'completed') || [];
  const totalEarnings = completedBookings.reduce((sum: number, booking: any) => sum + parseFloat(booking.totalAmount), 0);

  if (isLoading || bookingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.firstName}'s Dashboard
              </h2>
              <p className="text-sm text-gray-600">Professional Stylist</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${totalEarnings.toFixed(2)} total
                </p>
                <p className="text-xs text-gray-600">
                  {completedBookings.length} completed
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
              >
                Sign Out
              </Button>
              <Avatar>
                <AvatarImage src={user?.profileImageUrl || ''} />
                <AvatarFallback>{user?.firstName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-secondary to-pink-500 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">${totalEarnings.toFixed(0)}</p>
              <p className="text-pink-100 text-sm">Total Earned</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{user?.rating || "0.0"}</p>
              <p className="text-pink-100 text-sm">Rating</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{completedBookings.length}</p>
              <p className="text-pink-100 text-sm">Completed</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{user?.totalReviews || 0}</p>
              <p className="text-pink-100 text-sm">Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Today's Schedule</h3>
                  <span className="text-sm text-gray-600">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {todayBookings.length > 0 ? (
                    todayBookings.map((booking: any) => (
                      <div key={booking.id} className={`flex items-center p-4 rounded-xl border-l-4 ${
                        booking.status === 'in_progress' ? 'border-accent bg-green-50' :
                        booking.status === 'confirmed' ? 'border-primary bg-blue-50' :
                        'border-gray-300 bg-gray-50'
                      }`}>
                        <Avatar className="w-16 h-16 mr-4">
                          <AvatarImage src={booking.client?.profileImageUrl || ''} />
                          <AvatarFallback>
                            {booking.client?.firstName?.[0]}{booking.client?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">
                              {booking.client?.firstName} {booking.client?.lastName}
                            </h4>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p className="text-gray-600 text-sm">{booking.service?.name}</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(booking.scheduledAt).toLocaleTimeString()} • {booking.duration}min
                          </p>
                          <p className="text-gray-500 text-sm">{booking.clientAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">${booking.totalAmount}</p>
                          {booking.status === 'pending' && (
                            <div className="flex gap-2 mt-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleBookingAction(booking.id, 'confirmed')}
                              >
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleBookingAction(booking.id, 'cancelled')}
                              >
                                Decline
                              </Button>
                            </div>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button 
                              size="sm"
                              onClick={() => handleBookingAction(booking.id, 'in_progress')}
                            >
                              Start
                            </Button>
                          )}
                          {booking.status === 'in_progress' && (
                            <Button 
                              size="sm"
                              onClick={() => handleBookingAction(booking.id, 'completed')}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <i className="fas fa-calendar-day text-4xl text-gray-300 mb-4"></i>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">No appointments today</h4>
                      <p className="text-gray-600">Your schedule is clear for today</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability Toggle */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Available for bookings</span>
                  <Switch 
                    checked={user?.isAvailable ?? true}
                    onCheckedChange={handleAvailabilityToggle}
                    disabled={availabilityMutation.isPending}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {user?.isAvailable 
                    ? "Currently accepting new bookings" 
                    : "Not accepting new bookings"
                  }
                </p>
              </CardContent>
            </Card>

            {/* Booking Requests */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Pending Requests</h3>
                  <Badge variant="secondary">
                    {bookings?.filter((b: any) => b.status === 'pending').length || 0}
                  </Badge>
                </div>
                
                {bookings?.filter((b: any) => b.status === 'pending').length > 0 ? (
                  <div className="space-y-3">
                    {bookings.filter((b: any) => b.status === 'pending').slice(0, 3).map((booking: any) => (
                      <div key={booking.id} className="p-3 border border-gray-200 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {booking.client?.firstName} {booking.client?.lastName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{booking.service?.name}</p>
                        <p className="text-sm font-semibold text-secondary">${booking.totalAmount}</p>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-accent text-white text-xs"
                            onClick={() => handleBookingAction(booking.id, 'confirmed')}
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 text-xs"
                            onClick={() => handleBookingAction(booking.id, 'cancelled')}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No pending requests</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 text-sm">
                        {[1,2,3,4,5].map(star => (
                          <i key={star} className="fas fa-star"></i>
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm ml-2">Recent Client</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      "Professional service and great results. Highly recommended!"
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full">
                    View all reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
