import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  Circle, 
  Navigation,
  AlertTriangle,
  Camera,
  Heart,
  Timer
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface BookingStatusTrackerProps {
  bookingId: string;
}

interface BookingStatus {
  id: string;
  status: 'confirmed' | 'on_way' | 'arrived' | 'in_service' | 'completed' | 'cancelled';
  stylist: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    phone: string;
    rating: number;
  };
  scheduledAt: string;
  estimatedArrival?: string;
  actualArrival?: string;
  serviceStarted?: string;
  serviceCompleted?: string;
  location: {
    current?: { lat: number; lng: number };
    destination: { lat: number; lng: number; address: string };
  };
  services: Array<{
    name: string;
    estimatedDuration: string;
    price: number;
  }>;
  timeline: Array<{
    status: string;
    timestamp: string;
    message: string;
  }>;
}

export default function BookingStatusTracker({ bookingId }: BookingStatusTrackerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for real-time feel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const { data: booking } = useQuery({
    queryKey: ['/api/bookings', bookingId, 'status'],
    queryFn: async () => {
      // Mock real-time booking status
      const mockBooking: BookingStatus = {
        id: bookingId,
        status: 'on_way',
        stylist: {
          id: 'stylist-1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          profileImageUrl: '/api/placeholder/100/100',
          phone: '+1 (416) 555-0123',
          rating: 4.9
        },
        scheduledAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
        estimatedArrival: new Date(Date.now() + 25 * 60 * 1000).toISOString(), // 25 minutes
        location: {
          current: { lat: 43.6532, lng: -79.3832 }, // Mock Toronto location
          destination: { lat: 43.6426, lng: -79.3871, address: "123 Main St, Toronto, ON" }
        },
        services: [
          { name: "Precision Cut & Style", estimatedDuration: "90 min", price: 85 },
          { name: "Deep Conditioning", estimatedDuration: "30 min", price: 35 }
        ],
        timeline: [
          {
            status: "confirmed",
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            message: "Booking confirmed with Sarah"
          },
          {
            status: "prepared",
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            message: "Sarah is preparing for your appointment"
          },
          {
            status: "on_way",
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            message: "Sarah is on her way to you"
          }
        ]
      };

      return mockBooking;
    },
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  if (!booking) {
    return (
      <div className="app-container">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  const getStatusProgress = (status: string) => {
    const statusOrder = ['confirmed', 'on_way', 'arrived', 'in_service', 'completed'];
    return statusOrder.indexOf(status);
  };

  const getEstimatedTimeRemaining = () => {
    if (booking.estimatedArrival) {
      const eta = new Date(booking.estimatedArrival);
      const now = new Date();
      const diffMs = eta.getTime() - now.getTime();
      const diffMins = Math.max(0, Math.floor(diffMs / (1000 * 60)));
      return diffMins;
    }
    return null;
  };

  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
  };

  const statusSteps = [
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { id: 'on_way', label: 'On the way', icon: Navigation },
    { id: 'arrived', label: 'Arrived', icon: MapPin },
    { id: 'in_service', label: 'Service in progress', icon: Circle },
    { id: 'completed', label: 'Completed', icon: CheckCircle }
  ];

  const currentProgress = getStatusProgress(booking.status);
  const timeRemaining = getEstimatedTimeRemaining();

  return (
    <div className="app-container">
      <div className="app-content space-y-6">
        {/* Status Header */}
        <Card className="ios-card">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="relative">
                <Avatar className="w-20 h-20 mx-auto">
                  <AvatarImage src={booking.stylist.profileImageUrl} />
                  <AvatarFallback className="text-lg">
                    {booking.stylist.firstName[0]}{booking.stylist.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                  {booking.status === 'on_way' ? 'En Route' : 
                   booking.status === 'arrived' ? 'Arrived' :
                   booking.status === 'in_service' ? 'In Service' : 'Confirmed'}
                </Badge>
              </div>
              
              <div>
                <h2 className="text-xl font-bold">
                  {booking.stylist.firstName} {booking.stylist.lastName}
                </h2>
                <div className="flex items-center justify-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{booking.stylist.rating}</span>
                </div>
              </div>

              {booking.status === 'on_way' && timeRemaining !== null && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Timer className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">
                        Estimated arrival: {formatTimeRemaining(timeRemaining)}
                      </p>
                      <p className="text-sm text-blue-700">
                        {new Date(booking.estimatedArrival!).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Tracker */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle>Service Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentProgress;
                const isCurrent = index === currentProgress;
                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : isCurrent 
                        ? 'bg-blue-100 text-blue-600 animate-pulse' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <p className={`font-medium ${
                        isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </p>
                      {index < statusSteps.length - 1 && (
                        <div className={`w-full h-0.5 mt-2 ${
                          isCompleted ? 'bg-green-200' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>

                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle>Today's Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {booking.services.map((service, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-600">
                      Estimated: {service.estimatedDuration}
                    </p>
                  </div>
                  <span className="font-semibold text-purple-600">
                    ${service.price}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2"
            onClick={() => window.open(`tel:${booking.stylist.phone}`)}
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message</span>
          </Button>
        </div>

        {/* Live Updates */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle>Live Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {booking.timeline.reverse().map((update, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{update.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(update.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="ios-card border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <p className="font-medium">Need Help?</p>
                <p className="text-sm">Call VELY Support: (416) 555-VELY</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}