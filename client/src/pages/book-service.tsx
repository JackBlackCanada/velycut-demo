import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, MapPin, Star, Clock, User, Phone, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MapView from "@/components/MapView";
import FloatingNavButton from "@/components/FloatingNavButton";

interface Stylist {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  estimatedTime: string;
  profileImage: string;
  specialties: string[];
  price: number;
  isAvailable: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export default function BookService() {
  const [, navigate] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [step, setStep] = useState<'date' | 'stylists' | 'confirm'>('date');
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied, using default location");
          // Default to San Francisco coordinates
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
        }
      );
    } else {
      // Default location if geolocation not supported
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
    }
  }, []);

  // Mock stylists data with realistic locations
  const { data: availableStylists } = useQuery({
    queryKey: ["/api/stylists/available", selectedDate, selectedTime],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockStylists: Stylist[] = [
        {
          id: "1",
          name: "Sarah Johnson",
          rating: 4.9,
          reviewCount: 127,
          distance: "0.8 mi",
          estimatedTime: "12 mins",
          profileImage: "",
          specialties: ["Basic Cut", "Wash & Style"],
          price: 28,
          isAvailable: true,
          location: {
            lat: userLocation ? userLocation.lat + 0.01 : 37.7849,
            lng: userLocation ? userLocation.lng + 0.005 : -122.4144,
            address: "Downtown Salon"
          }
        },
        {
          id: "2", 
          name: "Michael Chen",
          rating: 4.8,
          reviewCount: 89,
          distance: "1.2 mi",
          estimatedTime: "18 mins",
          profileImage: "",
          specialties: ["Men's Cuts", "Beard Trim"],
          price: 32,
          isAvailable: true,
          location: {
            lat: userLocation ? userLocation.lat - 0.008 : 37.7669,
            lng: userLocation ? userLocation.lng - 0.012 : -122.4314,
            address: "Mission District"
          }
        },
        {
          id: "3",
          name: "Emily Rodriguez", 
          rating: 4.7,
          reviewCount: 156,
          distance: "2.1 mi",
          estimatedTime: "25 mins",
          profileImage: "",
          specialties: ["Layered Cut", "Styling"],
          price: 35,
          isAvailable: true,
          location: {
            lat: userLocation ? userLocation.lat + 0.015 : 37.7899,
            lng: userLocation ? userLocation.lng + 0.018 : -122.4014,
            address: "Castro Street"
          }
        },
        {
          id: "4",
          name: "David Park",
          rating: 4.6,
          reviewCount: 94,
          distance: "1.8 mi",
          estimatedTime: "22 mins",
          profileImage: "",
          specialties: ["Precision Cut", "Fade"],
          price: 38,
          isAvailable: true,
          location: {
            lat: userLocation ? userLocation.lat - 0.012 : 37.7629,
            lng: userLocation ? userLocation.lng + 0.008 : -122.4114,
            address: "SOMA District"
          }
        },
        {
          id: "5",
          name: "Jessica Kim",
          rating: 4.9,
          reviewCount: 203,
          distance: "0.6 mi",
          estimatedTime: "10 mins",
          profileImage: "",
          specialties: ["Premium Cut", "Blowout"],
          price: 42,
          isAvailable: true,
          location: {
            lat: userLocation ? userLocation.lat + 0.005 : 37.7799,
            lng: userLocation ? userLocation.lng - 0.003 : -122.4224,
            address: "Union Square"
          }
        },
        {
          id: "6",
          name: "Alex Thompson",
          rating: 4.8,
          reviewCount: 167,
          distance: "2.4 mi", 
          estimatedTime: "28 mins",
          profileImage: "",
          specialties: ["Luxury Cut", "Deep Conditioning"],
          price: 45,
          isAvailable: true,
          location: {
            lat: userLocation ? userLocation.lat + 0.018 : 37.7929,
            lng: userLocation ? userLocation.lng + 0.015 : -122.4044,
            address: "Nob Hill"
          }
        }
      ];

      return mockStylists;
    },
    enabled: step === 'stylists' && !!selectedDate && !!selectedTime
  });

  // Generate time slots for selected date
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const startHour = isToday ? Math.max(9, now.getHours() + 1) : 9;
    
    for (let hour = startHour; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeSlot);
      }
    }
    return slots;
  };

  // Generate next 7 days
  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleBookNow = () => {
    // Navigate to checkout with booking details
    navigate('/checkout', { 
      state: { 
        stylist: selectedStylist,
        date: selectedDate,
        time: selectedTime,
        service: "Haircut & Style",
        price: selectedStylist?.price || 28
      }
    });
  };

  if (step === 'date') {
    return (
      <div className="app-container">
        {/* Header */}
        <div className="app-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
                className="mr-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-headline">Book a Haircut</h1>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <Home className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="app-content">
          {/* Service Selection */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Haircut & Style</h3>
                  <p className="text-sm text-gray-600">Professional cut and styling</p>
                  <p className="text-sm font-semibold text-purple-600">Starting at $28</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Select Date
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {generateDateOptions().map((date, index) => (
                <Button
                  key={index}
                  variant={selectedDate.toDateString() === date.toDateString() ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center"
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="font-semibold">{formatDate(date)}</span>
                  <span className="text-xs opacity-75">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Select Time
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {generateTimeSlots().slice(0, 12).map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
            {generateTimeSlots().length > 12 && (
              <Button variant="ghost" className="w-full mt-2 text-sm">
                Show more times
              </Button>
            )}
          </div>

          {/* Continue Button */}
          <Button
            onClick={() => setStep('stylists')}
            disabled={!selectedDate || !selectedTime}
            className="btn-primary w-full"
          >
            Find Available Stylists
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'stylists') {
    return (
      <div className="app-container">
        {/* Header */}
        <div className="app-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setStep('date')}
                className="mr-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-headline">Available Stylists</h1>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedDate)} at {selectedTime}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <Home className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="app-content">
          {/* Location Info & Sort Options */}
          <Card className="mb-4 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    Near your location
                  </span>
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'distance' | 'price' | 'rating')}
                  className="text-xs bg-white border border-blue-200 rounded px-2 py-1"
                >
                  <option value="distance">Sort by Distance</option>
                  <option value="price">Sort by Price</option>
                  <option value="rating">Sort by Rating</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Map View Toggle */}
          <div className="flex space-x-2 mb-4">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm" 
              className="flex-1"
              onClick={() => setViewMode('list')}
            >
              List View
            </Button>
            <Button 
              variant={viewMode === 'map' ? 'default' : 'outline'} 
              size="sm" 
              className="flex-1"
              onClick={() => setViewMode('map')}
            >
              Map View
            </Button>
          </div>

          {/* Map View */}
          {viewMode === 'map' && availableStylists && (
            <MapView 
              stylists={availableStylists.sort((a, b) => {
                if (sortBy === 'price') return a.price - b.price;
                if (sortBy === 'rating') return b.rating - a.rating;
                return parseFloat(a.distance) - parseFloat(b.distance);
              })} 
              onStylistSelect={(stylist) => {
                setSelectedStylist(stylist);
                setStep('confirm');
              }} 
            />
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {availableStylists?.sort((a, b) => {
                if (sortBy === 'price') return a.price - b.price;
                if (sortBy === 'rating') return b.rating - a.rating;
                return parseFloat(a.distance) - parseFloat(b.distance);
              })?.map((stylist) => (
              <Card 
                key={stylist.id}
                className="cursor-pointer active:scale-95 transition-transform"
                onClick={() => {
                  setSelectedStylist(stylist);
                  setStep('confirm');
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={stylist.profileImage} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {stylist.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{stylist.name}</h3>
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{stylist.rating}</span>
                            <span className="text-sm text-gray-600">({stylist.reviewCount})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${stylist.price}</div>
                          <Badge variant="secondary" className="text-xs">
                            {stylist.isAvailable ? 'Available' : 'Busy'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {stylist.distance}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {stylist.estimatedTime} away
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {stylist.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}

          {!availableStylists?.length && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Finding available stylists...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'confirm' && selectedStylist) {
    return (
      <div className="app-container">
        {/* Header */}
        <div className="app-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setStep('stylists')}
                className="mr-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-headline">Confirm Booking</h1>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <Home className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="app-content">
          {/* Stylist Info */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedStylist.profileImage} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {selectedStylist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{selectedStylist.name}</h2>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{selectedStylist.rating}</span>
                    <span className="text-sm text-gray-600">({selectedStylist.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedStylist.distance} • {selectedStylist.estimatedTime} away
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-semibold">Haircut & Style</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">60 minutes</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">${selectedStylist.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold">Contact after booking</p>
                    <p className="text-sm text-gray-600">We'll share contact details once confirmed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Book Now Button */}
          <Button
            onClick={handleBookNow}
            className="btn-primary w-full h-12 text-lg"
          >
            Book Now - ${selectedStylist.price}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            You'll be charged after the service is completed. 
            Free cancellation up to 2 hours before appointment.
          </p>
        </div>
      </div>
    );
  }

  return null;
}