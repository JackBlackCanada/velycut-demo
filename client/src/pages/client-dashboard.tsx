import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Star, Clock, Plus, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import logoPath from "@assets/logo_1753651837767.png";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["/api/bookings"],
  });

  const upcomingBookings = bookings?.filter((b: any) => 
    ['pending', 'confirmed'].includes(b.status)
  ) || [];

  const recentBookings = bookings?.filter((b: any) => 
    ['completed'].includes(b.status)
  ).slice(0, 3) || [];

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
      {/* Header */}
      <div className="app-header">
        <div className="flex items-center justify-between">
          <img src={logoPath} alt="VELY" className="logo" />
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profileImageUrl} />
              <AvatarFallback>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="app-content">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-title-large mb-2">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-body">
            Ready for your next haircut?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="ios-card mb-6">
          <div className="ios-card-content">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-headline mb-1">Book a Haircut</h3>
                <p className="text-caption">Find stylists near you</p>
              </div>
              <Button 
                onClick={() => navigate('/search-stylists')}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            </div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <div className="mb-6">
            <h2 className="text-headline mb-4">Upcoming Appointments</h2>
            <div className="space-y-3">
              {upcomingBookings.map((booking: any) => (
                <div key={booking.id} className="ios-card">
                  <div className="ios-card-content">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={booking.stylist?.profileImageUrl} />
                        <AvatarFallback>
                          {booking.stylist?.firstName?.[0]}{booking.stylist?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-headline">
                            {booking.stylist?.firstName} {booking.stylist?.lastName}
                          </h3>
                          <Badge 
                            className={`${
                              booking.status === 'confirmed' 
                                ? 'status-confirmed' 
                                : 'status-pending'
                            } text-xs px-2 py-1 rounded-full`}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-caption">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(booking.scheduledAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(booking.scheduledAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-2 text-caption">
                          <MapPin className="w-3 h-3 mr-1" />
                          {booking.clientAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <div className="mb-6">
            <h2 className="text-headline mb-4">Recent Haircuts</h2>
            <div className="space-y-3">
              {recentBookings.map((booking: any) => (
                <div key={booking.id} className="ios-card">
                  <div className="ios-card-content">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={booking.stylist?.profileImageUrl} />
                        <AvatarFallback>
                          {booking.stylist?.firstName?.[0]}{booking.stylist?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-headline">
                            {booking.stylist?.firstName} {booking.stylist?.lastName}
                          </h3>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < (booking.review?.rating || 0)
                                    ? 'rating-star'
                                    : 'rating-star-empty'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-caption">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(booking.scheduledAt).toLocaleDateString()}
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
        {upcomingBookings.length === 0 && recentBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-headline mb-2">No bookings yet</h3>
            <p className="text-body mb-6">
              Book your first haircut to get started
            </p>
            <Button 
              onClick={() => navigate('/search-stylists')}
              className="btn-primary"
            >
              Find Stylists
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="tab-bar">
        <div className="flex justify-around">
          <div className="tab-item active">
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </div>
          <div 
            className="tab-item inactive cursor-pointer"
            onClick={() => navigate('/search-stylists')}
          >
            <Plus className="w-5 h-5 mb-1" />
            <span className="text-xs">Book</span>
          </div>
          <div className="tab-item inactive">
            <Clock className="w-5 h-5 mb-1" />
            <span className="text-xs">History</span>
          </div>
          <div className="tab-item inactive">
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}