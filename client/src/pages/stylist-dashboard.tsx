import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar, MapPin, Star, Clock, DollarSign, Settings, TrendingUp, Home, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import AnimatedNavMenu from "@/components/AnimatedNavMenu";
// Using simple text logo for now

export default function StylistDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["/api/stylist/bookings"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stylist/stats"],
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: async (available: boolean) => {
      await apiRequest("PATCH", "/api/stylist/availability", { available });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stylist/stats"] });
      toast({ title: "Availability updated" });
    },
  });

  const handleBookingAction = useMutation({
    mutationFn: async ({ bookingId, action }: { bookingId: string; action: 'accept' | 'reject' }) => {
      await apiRequest("PATCH", `/api/bookings/${bookingId}`, { 
        status: action === 'accept' ? 'confirmed' : 'cancelled' 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stylist/bookings"] });
      toast({ title: "Booking updated" });
    },
  });

  const pendingBookings = bookings?.filter((b: any) => b.status === 'pending') || [];
  const upcomingBookings = bookings?.filter((b: any) => b.status === 'confirmed') || [];

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header - Matches Dashboard Mockup */}
      <div className="app-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="mr-3"
            >
              <Home className="w-5 h-5" />
            </Button>
            <h1 className="text-title">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-caption">Availability</span>
              <Switch
                checked={stats?.isAvailable || false}
                onCheckedChange={(checked) => toggleAvailabilityMutation.mutate(checked)}
                className="data-[state=checked]:bg-purple-600"
              />
              <span className="text-caption">
                {stats?.isAvailable ? 'On' : 'Off'}
              </span>
            </div>
            <AnimatedNavMenu userType="stylist" />
          </div>
        </div>
      </div>

      <div className="app-content">
        {/* Stats Cards - Matches Dashboard Mockup */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div 
            className="metric-card cursor-pointer active:scale-95 transition-transform"
            onClick={() => navigate('/earnings')}
          >
            <div className="metric-value">${stats?.totalEarnings || 0}</div>
            <div className="metric-label">Earnings</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{stats?.weeklyBookings || 0}</div>
            <div className="metric-label">This Week</div>
            <div className="text-xs text-gray-500 mt-1">appointments</div>
          </div>
        </div>

        {/* Schedule Management */}
        <div className="ios-card mb-6">
          <div className="ios-card-content">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Manage Schedule</h3>
                  <p className="text-sm text-gray-600">Set your weekly hours and time off</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/schedule-management')}
                size="sm"
                className="btn-primary"
              >
                <Clock className="w-4 h-4 mr-1" />
                Schedule
              </Button>
            </div>
          </div>
        </div>

        {/* Payout Setup Alert */}
        <div className="ios-card mb-6 border-yellow-200 bg-yellow-50">
          <div className="ios-card-content">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-800">Set up payouts</h3>
                  <p className="text-sm text-yellow-700">Complete your account to receive earnings directly</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/stylist-onboarding')}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Setup
              </Button>
            </div>
          </div>
        </div>

        {/* Pending Bookings */}
        {pendingBookings.length > 0 && (
          <div className="mb-6">
            <h2 className="text-headline mb-4">Upcoming Appointments</h2>
            <div className="space-y-3">
              {pendingBookings.map((booking: any) => (
                <div key={booking.id} className="ios-card">
                  <div className="ios-card-content">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={booking.client?.profileImageUrl} />
                        <AvatarFallback>
                          {booking.client?.firstName?.[0]}{booking.client?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-headline">
                            {booking.client?.firstName || 'Mia'}
                          </h3>
                          <Button
                            size="sm"
                            onClick={() => handleBookingAction.mutate({ 
                              bookingId: booking.id, 
                              action: 'accept' 
                            })}
                            className="btn-secondary text-xs px-3 py-1"
                          >
                            Accept
                          </Button>
                        </div>
                        
                        <div className="flex items-center text-caption">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(booking.scheduledAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} AM
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Today's Schedule */}
        {upcomingBookings.length > 0 && (
          <div className="mb-6">
            <h2 className="text-headline mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              {upcomingBookings.map((booking: any) => (
                <div key={booking.id} className="ios-card">
                  <div className="ios-card-content">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={booking.client?.profileImageUrl} />
                        <AvatarFallback>
                          {booking.client?.firstName?.[0]}{booking.client?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-headline">
                            {booking.client?.firstName} {booking.client?.lastName}
                          </h3>
                          <Badge className="status-confirmed text-xs px-2 py-1 rounded-full">
                            Confirmed
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-caption">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(booking.scheduledAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {booking.clientAddress}
                            </div>
                          </div>
                          <span className="font-semibold text-gray-900">
                            ${booking.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {pendingBookings.length === 0 && upcomingBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-headline mb-2">No appointments today</h3>
            <p className="text-body mb-6">
              Turn on availability to start receiving bookings
            </p>
            <Button 
              onClick={() => toggleAvailabilityMutation.mutate(true)}
              className="btn-primary"
              disabled={stats?.isAvailable}
            >
              {stats?.isAvailable ? 'Already Available' : 'Go Online'}
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="tab-bar">
        <div className="flex justify-around">
          <div className="tab-item active">
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Appointments</span>
          </div>
          <Link href="/schedule-management" className="tab-item inactive">
            <Clock className="w-5 h-5 mb-1" />
            <span className="text-xs">Schedule</span>
          </Link>
          <div className="tab-item inactive">
            <DollarSign className="w-5 h-5 mb-1" />
            <span className="text-xs">Earnings</span>
          </div>
        </div>
      </div>
    </div>
  );
}