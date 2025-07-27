import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, MapPin, Home } from "lucide-react";
import BookingModal from "@/components/booking-modal";
import logoPath from "@assets/logo_1753651837767.png";

export default function SearchStylists() {
  const [, navigate] = useLocation();
  const [selectedStylist, setSelectedStylist] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { data: stylists, isLoading } = useQuery({
    queryKey: ["/api/stylists"],
  });

  const handleBookStylist = (stylist: any) => {
    setSelectedStylist(stylist);
    setShowBookingModal(true);
  };

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
      {/* Header - Matches "Book a Haircut" Mockup */}
      <div className="app-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-title">Book a Haircut</h1>
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
        {/* Time Selection - Matches Mockup */}
        <div className="ios-card mb-6">
          <div className="ios-card-content">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src="https://images.unsplash.com/photo-1594736797933-d0d4519d8e0a?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback>YU</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-headline mb-1">Today</h3>
                <p className="text-2xl font-bold text-gray-900">2:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Stylists List - Matches "Book a Haircut" Mockup */}
        <div className="space-y-4">
          {/* Sample Stylists matching mockup */}
          {[
            { name: "Sarah", title: "Experienced stylist", avatar: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=100&h=100&fit=crop&crop=face" },
            { name: "James", title: "Experienced stylist", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
            { name: "Emily", title: "Experienced stylist", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
            { name: "Daniel", title: "Experienced stylist", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" }
          ].map((stylist, index) => (
            <div key={index} className="ios-list-item">
              <Avatar className="w-12 h-12 mr-4">
                <AvatarImage src={stylist.avatar} />
                <AvatarFallback>{stylist.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-headline">{stylist.name}</h3>
                <p className="text-body">{stylist.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Stylists from API */}
        {stylists?.map((stylist: any) => (
          <div key={stylist.id} className="ios-list-item cursor-pointer" onClick={() => handleBookStylist(stylist)}>
            <Avatar className="w-12 h-12 mr-4">
              <AvatarImage src={stylist.profileImageUrl} />
              <AvatarFallback>
                {stylist.firstName?.[0]}{stylist.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-headline">
                  {stylist.firstName} {stylist.lastName}
                </h3>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-semibold">{stylist.averageRating || '4.9'}</span>
                  <span className="text-caption ml-1">({stylist.reviewCount || '4.9'})</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-body">{stylist.bio || 'Experienced stylist'}</p>
                <div className="flex items-center text-caption">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{stylist.location || 'Nearby'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Button - Matches Mockup */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="app-container max-w-sm mx-auto">
          <Button 
            onClick={() => setShowBookingModal(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-semibold text-lg"
          >
            Book Now
          </Button>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal 
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        stylist={selectedStylist}
      />
    </div>
  );
}