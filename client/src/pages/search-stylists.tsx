import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BookingModal from "@/components/booking-modal";

export default function SearchStylists() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState<any>(null);

  const { data: stylists, isLoading } = useQuery({
    queryKey: ["/api/stylists", selectedLocation, selectedSpecialization],
  });

  const handleBookStylist = (stylist: any) => {
    setSelectedStylist(stylist);
    setShowBookingModal(true);
  };

  const filteredStylists = stylists?.filter((stylist: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      stylist.firstName?.toLowerCase().includes(query) ||
      stylist.lastName?.toLowerCase().includes(query) ||
      stylist.specializations?.some((spec: string) => spec.toLowerCase().includes(query)) ||
      stylist.bio?.toLowerCase().includes(query)
    );
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left"></i>
            </Button>
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search stylists, services, or locations"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3">
            <Button 
              variant={!selectedSpecialization ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialization("")}
            >
              All Services
            </Button>
            <Button 
              variant={selectedLocation ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLocation(selectedLocation ? "" : "nearby")}
            >
              Nearby
            </Button>
            <Button 
              variant={selectedSpecialization === "available" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialization(selectedSpecialization === "available" ? "" : "available")}
            >
              Available Today
            </Button>
            <Button 
              variant={selectedSpecialization === "top-rated" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialization(selectedSpecialization === "top-rated" ? "" : "top-rated")}
            >
              Top Rated
            </Button>
          </div>
        </div>
      </div>

      {/* Stylist Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredStylists.length}</span> stylists
            {selectedLocation && " near you"}
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredStylists.map((stylist: any) => (
              <Card key={stylist.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={stylist.profileImageUrl || ''} />
                        <AvatarFallback className="text-2xl">
                          {stylist.firstName?.[0]}{stylist.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {stylist.firstName} {stylist.lastName}
                          </h3>
                          <div className="flex items-center mt-1">
                            <div className="flex text-yellow-400">
                              {[1,2,3,4,5].map(star => (
                                <i key={star} className={`fas fa-star ${parseFloat(stylist.rating) >= star ? '' : 'text-gray-300'}`}></i>
                              ))}
                            </div>
                            <span className="text-gray-600 ml-1">
                              {stylist.rating} ({stylist.totalReviews} reviews)
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{stylist.serviceArea}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">From $45</p>
                          {stylist.isAvailable && (
                            <Badge className="bg-accent text-white">
                              Available Today
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        {stylist.bio || "Professional stylist with years of experience."}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {stylist.specializations?.map((spec: string) => (
                          <Badge key={spec} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          variant="outline"
                          className="flex-1"
                          onClick={() => {/* TODO: Navigate to profile */}}
                        >
                          View Profile
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => handleBookStylist(stylist)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredStylists.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No stylists found</h4>
                <p className="text-gray-600">Try adjusting your search criteria or location</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal 
        open={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedStylist(null);
        }}
        stylist={selectedStylist}
      />
    </div>
  );
}
