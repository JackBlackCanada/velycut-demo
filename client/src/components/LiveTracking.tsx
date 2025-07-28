import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Navigation, Phone, MessageCircle, Car } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LiveTrackingProps {
  bookingId: string;
  userType: 'client' | 'stylist';
}

interface LocationUpdate {
  latitude: number;
  longitude: number;
  timestamp: string;
  eta: number;
  status: 'on_way' | 'arrived' | 'in_service' | 'completed';
}

interface BookingDetails {
  id: string;
  clientName: string;
  stylistName: string;
  clientAvatar?: string;
  stylistAvatar?: string;
  serviceAddress: string;
  scheduledTime: string;
  services: string[];
  totalAmount: number;
  status: string;
  estimatedDuration: number;
}

export default function LiveTracking({ bookingId, userType }: LiveTrackingProps) {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<LocationUpdate | null>(null);

  // Fetch booking details
  const { data: booking, isLoading: bookingLoading } = useQuery({
    queryKey: ['/api/booking', bookingId],
  });

  // Fetch live location updates
  const { data: locationUpdates } = useQuery({
    queryKey: ['/api/tracking', bookingId],
    refetchInterval: 10000, // Update every 10 seconds
    enabled: userType === 'client', // Only clients track stylists
  });

  // Update location mutation (for stylists)
  const updateLocationMutation = useMutation({
    mutationFn: async (locationData: { latitude: number; longitude: number; status: string }) => {
      return apiRequest('POST', `/api/booking/${bookingId}/location`, locationData);
    },
    onSuccess: () => {
      toast({ title: "Location updated successfully" });
    }
  });

  // Start location tracking for stylists
  useEffect(() => {
    if (userType === 'stylist' && 'geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
            eta: calculateETA(latitude, longitude),
            status: 'on_way'
          });
          
          // Auto-update location every 30 seconds
          updateLocationMutation.mutate({
            latitude,
            longitude,
            status: 'on_way'
          });
        },
        (error) => {
          console.error('Location tracking error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [userType, bookingId]);

  const calculateETA = (lat: number, lng: number): number => {
    // Mock ETA calculation - in production, use Google Maps API
    return Math.floor(Math.random() * 20) + 5; // 5-25 minutes
  };

  const handleStatusUpdate = (status: string) => {
    if (currentLocation) {
      updateLocationMutation.mutate({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        status
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_way': return 'bg-blue-100 text-blue-800';
      case 'arrived': return 'bg-purple-100 text-purple-800';
      case 'in_service': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on_way': return 'On the way';
      case 'arrived': return 'Arrived';
      case 'in_service': return 'In service';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  if (bookingLoading) {
    return (
      <div className="app-container">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  const bookingData = booking as BookingDetails;
  const latestLocation = locationUpdates as LocationUpdate;

  return (
    <div className="app-container">
      <div className="app-content space-y-6">
        {/* Booking Overview */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live Tracking</span>
              <Badge className={getStatusColor(latestLocation?.status || 'on_way')}>
                {getStatusText(latestLocation?.status || 'on_way')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={userType === 'client' ? bookingData?.stylistAvatar : bookingData?.clientAvatar} />
                <AvatarFallback>
                  {userType === 'client' ? 'S' : 'C'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {userType === 'client' ? bookingData?.stylistName : bookingData?.clientName}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {bookingData?.services?.join(', ')}
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {bookingData?.scheduledTime && new Date(bookingData.scheduledTime).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Location Status */}
        <Card className="ios-card">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              {userType === 'client' && latestLocation && (
                <>
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Car className="w-10 h-10 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      ETA: {latestLocation.eta} minutes
                    </h3>
                    <p className="text-gray-600">
                      Your stylist is on the way to your location
                    </p>
                  </div>
                </>
              )}

              {userType === 'stylist' && (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Navigation className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Tracking Active
                    </h3>
                    <p className="text-gray-600">
                      Your location is being shared with the client
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Service Address */}
        <Card className="ios-card">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Service Address</h4>
                <p className="text-gray-600">{bookingData?.serviceAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Update Actions (for stylists) */}
        {userType === 'stylist' && (
          <Card className="ios-card">
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleStatusUpdate('arrived')}
                disabled={updateLocationMutation.isPending}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Mark as Arrived
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleStatusUpdate('in_service')}
                disabled={updateLocationMutation.isPending}
              >
                <Clock className="w-4 h-4 mr-2" />
                Start Service
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleStatusUpdate('completed')}
                disabled={updateLocationMutation.isPending}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Complete Service
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Communication Actions */}
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button variant="outline" className="flex-1">
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
        </div>

        {/* Emergency Options */}
        <Card className="ios-card border-red-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Need help or have an emergency?
              </p>
              <Button variant="destructive" size="sm">
                Emergency Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}