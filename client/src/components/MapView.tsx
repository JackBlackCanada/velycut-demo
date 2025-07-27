import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Star } from "lucide-react";

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

interface MapViewProps {
  stylists: Stylist[];
  onStylistSelect: (stylist: Stylist) => void;
}

export default function MapView({ stylists, onStylistSelect }: MapViewProps) {
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);

  return (
    <div className="relative">
      {/* Simplified Map Container */}
      <div className="bg-gray-100 rounded-lg h-64 relative overflow-hidden mb-4">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
          {/* Street Grid Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#666" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          
          {/* Your Location */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full opacity-30 absolute -top-2 -left-2 animate-pulse"></div>
            </div>
            <div className="text-xs font-semibold text-blue-600 mt-1 whitespace-nowrap">You</div>
          </div>
          
          {/* Stylist Markers */}
          {stylists?.map((stylist, index) => {
            const positions = [
              { top: '25%', left: '30%' },
              { top: '40%', left: '65%' },
              { top: '65%', left: '35%' },
              { top: '30%', left: '75%' },
              { top: '70%', left: '60%' },
              { top: '55%', left: '20%' }
            ];
            const position = positions[index] || { top: '50%', left: '50%' };
            
            return (
              <div
                key={stylist.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ top: position.top, left: position.left }}
                onClick={() => setSelectedStylist(stylist)}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">${stylist.price}</span>
                  </div>
                  {selectedStylist?.id === stylist.id && (
                    <div className="w-12 h-12 bg-purple-600 rounded-full opacity-30 absolute -top-2 -left-2 animate-pulse"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Stylist Info */}
      {selectedStylist && (
        <Card className="mb-4 border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={selectedStylist.profileImage} />
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  {selectedStylist.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold">{selectedStylist.name}</h3>
                  <div className="font-bold text-lg">${selectedStylist.price}</div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-semibold">{selectedStylist.rating}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedStylist.distance} • {selectedStylist.estimatedTime}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onStylistSelect(selectedStylist)}
                    className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => setSelectedStylist(null)}
                    className="bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Legend */}
      <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span>Your location</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
          <span>Available stylists</span>
        </div>
      </div>
    </div>
  );
}