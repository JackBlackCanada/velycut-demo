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

  // Calculate positions based on real coordinates relative to center
  const calculatePosition = (stylist: Stylist, stylists: Stylist[]) => {
    if (!stylists.length) return { top: '50%', left: '50%' };
    
    // Find center point of all stylists
    const centerLat = stylists.reduce((sum, s) => sum + s.location.lat, 0) / stylists.length;
    const centerLng = stylists.reduce((sum, s) => sum + s.location.lng, 0) / stylists.length;
    
    // Calculate relative position (simplified projection)
    const latRange = Math.max(...stylists.map(s => s.location.lat)) - Math.min(...stylists.map(s => s.location.lat));
    const lngRange = Math.max(...stylists.map(s => s.location.lng)) - Math.min(...stylists.map(s => s.location.lng));
    
    const normalizedLat = latRange > 0 ? (stylist.location.lat - Math.min(...stylists.map(s => s.location.lat))) / latRange : 0.5;
    const normalizedLng = lngRange > 0 ? (stylist.location.lng - Math.min(...stylists.map(s => s.location.lng))) / lngRange : 0.5;
    
    // Convert to percentages with some padding
    const top = Math.max(10, Math.min(90, (1 - normalizedLat) * 80 + 10)) + '%';
    const left = Math.max(10, Math.min(90, normalizedLng * 80 + 10)) + '%';
    
    return { top, left };
  };

  return (
    <div className="relative">
      {/* Interactive Map Container */}
      <div className="bg-gray-100 rounded-lg h-80 relative overflow-hidden mb-4 border">
        {/* Map Background - Street Map Style */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Street Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-15">
            <defs>
              <pattern id="streets" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#333" strokeWidth="2"/>
                <path d="M 30 0 L 30 60 M 0 30 L 60 30" fill="none" stroke="#666" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#streets)" />
          </svg>
          
          {/* Neighborhood Labels */}
          <div className="absolute top-4 left-4 text-xs font-semibold text-gray-600 bg-white/80 px-2 py-1 rounded">
            {stylists?.[0]?.location.address.includes('Toronto') ? 'Toronto, ON' : 'Los Angeles, CA'}
          </div>
          
          {/* Your Location */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              <div className="w-5 h-5 bg-blue-600 rounded-full border-3 border-white shadow-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full opacity-20 absolute -top-2.5 -left-2.5 animate-ping"></div>
              </div>
              <div className="text-xs font-bold text-blue-600 mt-1 whitespace-nowrap bg-white/90 px-1 rounded">You</div>
            </div>
          </div>
          
          {/* Stylist Markers */}
          {stylists?.map((stylist) => {
            const position = calculatePosition(stylist, stylists);
            
            return (
              <div
                key={stylist.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-transform hover:scale-110"
                style={{ top: position.top, left: position.left }}
                onClick={() => setSelectedStylist(stylist)}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:bg-purple-700 transition-colors">
                    <span className="text-white text-xs font-bold">${stylist.price}</span>
                  </div>
                  {selectedStylist?.id === stylist.id && (
                    <div className="w-14 h-14 bg-purple-600 rounded-full opacity-30 absolute -top-2 -left-2 animate-pulse"></div>
                  )}
                  {/* Distance Line */}
                  <svg className="absolute top-1/2 left-1/2 w-32 h-32 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                    <line x1="64" y1="64" x2="64" y2="64" stroke="#6366f1" strokeWidth="2" strokeDasharray="4,4" />
                  </svg>
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