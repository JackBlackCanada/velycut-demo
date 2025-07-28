import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, MessageCircle, CheckCircle, X, Filter } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Bookings() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  
  // Sample booking data - in production, this would come from API
  const [bookings] = useState([
    {
      id: '1',
      clientName: 'Sarah Johnson',
      clientImage: null,
      service: 'Haircut & Style',
      date: '2025-01-28',
      time: '2:00 PM',
      duration: '60 minutes',
      price: 65,
      status: 'confirmed' as const,
      address: '123 Main St, Toronto, ON',
      phone: '+1 (555) 123-4567',
      notes: 'First time client, prefers shorter length'
    },
    {
      id: '2',
      clientName: 'Michael Chen',
      clientImage: null,
      service: 'Beard Trim',
      date: '2025-01-28',
      time: '4:30 PM',
      duration: '30 minutes',
      price: 35,
      status: 'pending' as const,
      address: '456 Oak Ave, Toronto, ON',
      phone: '+1 (555) 987-6543',
      notes: 'Regular client, usual trim'
    },
    {
      id: '3',
      clientName: 'Emma Wilson',
      clientImage: null,
      service: 'Hair Color & Cut',
      date: '2025-01-29',
      time: '10:00 AM',
      duration: '120 minutes',
      price: 120,
      status: 'confirmed' as const,
      address: '789 Pine St, Toronto, ON',
      phone: '+1 (555) 456-7890',
      notes: 'Wants to go lighter, has sensitive scalp'
    },
    {
      id: '4',
      clientName: 'David Brown',
      clientImage: null,
      service: 'Family Package',
      date: '2025-01-27',
      time: '1:00 PM',
      duration: '90 minutes',
      price: 95,
      status: 'completed' as const,
      address: '321 Elm St, Toronto, ON',
      phone: '+1 (555) 234-5678',
      notes: 'Dad + 2 kids, very patient family'
    },
    {
      id: '5',
      clientName: 'Lisa Martinez',
      clientImage: null,
      service: 'Haircut',
      date: '2025-01-26',
      time: '3:00 PM',
      duration: '45 minutes',
      price: 50,
      status: 'cancelled' as const,
      address: '654 Maple Ave, Toronto, ON',
      phone: '+1 (555) 345-6789',
      notes: 'Client cancelled due to illness'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleBookingAction = (bookingId: string, action: 'accept' | 'decline') => {
    toast({
      title: action === 'accept' ? "Booking Accepted" : "Booking Declined",
      description: `You have ${action}ed the booking request.`,
    });
  };

  const filteredBookings = bookings.filter(booking => 
    activeFilter === 'all' || booking.status === activeFilter
  );

  const getBookingCounts = () => {
    return {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
  };

  const counts = getBookingCounts();

  return (
    <div className="app-container mx-auto bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/stylist-dashboard')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-headline font-bold text-gray-900 dark:text-white">My Bookings</h1>
          <Button variant="ghost" size="sm" className="p-2">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* Filter Tabs */}
        <div className="flex overflow-x-auto space-x-2 py-4 mb-4">
          {[
            { key: 'all', label: 'All', count: counts.all },
            { key: 'pending', label: 'Pending', count: counts.pending },
            { key: 'confirmed', label: 'Confirmed', count: counts.confirmed },
            { key: 'completed', label: 'Completed', count: counts.completed },
            { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.key as any)}
              className={`flex-shrink-0 ${
                activeFilter === filter.key 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 border-gray-300'
              }`}
            >
              {filter.label}
              {filter.count > 0 && (
                <Badge variant="secondary" className="ml-2 bg-white/20">
                  {filter.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-headline font-semibold text-gray-900 dark:text-white mb-2">
                No {activeFilter !== 'all' ? activeFilter : ''} bookings
              </h3>
              <p className="text-body text-gray-600 dark:text-gray-300">
                {activeFilter === 'all' 
                  ? "You don't have any bookings yet." 
                  : `No ${activeFilter} bookings to show.`}
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="ios-card">
                <div className="ios-card-content">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={booking.clientImage || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {booking.clientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {booking.clientName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {booking.service}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      {booking.date} at {booking.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      {booking.duration} • ${booking.price}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      {booking.address}
                    </div>
                  </div>

                  {/* Notes */}
                  {booking.notes && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleBookingAction(booking.id, 'accept')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleBookingAction(booking.id, 'decline')}
                          variant="outline"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </>
                    )}
                    
                    {(booking.status === 'confirmed' || booking.status === 'completed') && (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1"
                          size="sm"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Client
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          size="sm"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <Button
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        size="sm"
                      >
                        Start Service
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats */}
        {filteredBookings.length > 0 && (
          <div className="ios-card mt-6">
            <div className="ios-card-content">
              <h3 className="text-headline font-bold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    ${filteredBookings.reduce((sum, booking) => sum + booking.price, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">
                    {filteredBookings.reduce((sum, booking) => {
                      const minutes = parseInt(booking.duration.split(' ')[0]);
                      return sum + minutes;
                    }, 0)} min
                  </div>
                  <div className="text-sm text-gray-600">Total Time</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}