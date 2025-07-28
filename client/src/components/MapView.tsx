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
  
  // Debug logging
  console.log('MapView rendered with stylists:', stylists?.length, stylists);

  // Calculate positions based on real coordinates with better distribution
  const calculatePosition = (stylist: Stylist, stylists: Stylist[], index: number) => {
    if (!stylists.length) return { top: '50%', left: '50%' };
    
    // Get all coordinates
    const allLats = stylists.map(s => s.location.lat);
    const allLngs = stylists.map(s => s.location.lng);
    
    const minLat = Math.min(...allLats);
    const maxLat = Math.max(...allLats);
    const minLng = Math.min(...allLngs);
    const maxLng = Math.max(...allLngs);
    
    // Handle case where all stylists are at the same location (spread them out artificially)
    let latRange = maxLat - minLat;
    let lngRange = maxLng - minLng;
    
    if (latRange < 0.01 && lngRange < 0.01) {
      // All stylists at same location - create artificial spread
      const positions = [
        { top: '25%', left: '30%' },
        { top: '40%', left: '65%' },
        { top: '65%', left: '35%' },
        { top: '30%', left: '75%' },
        { top: '70%', left: '25%' },
        { top: '55%', left: '60%' }
      ];
      return positions[index % positions.length] || { top: '50%', left: '50%' };
    }
    
    // Ensure minimum spread for better visibility
    latRange = Math.max(latRange, 0.02);
    lngRange = Math.max(lngRange, 0.02);
    
    // Normalize coordinates (0 to 1)
    const normalizedLat = (stylist.location.lat - minLat) / latRange;
    const normalizedLng = (stylist.location.lng - minLng) / lngRange;
    
    // Convert to map percentages with generous padding
    // Flip latitude because map coordinates are inverted (north = top)
    const top = Math.max(15, Math.min(85, (1 - normalizedLat) * 70 + 15)) + '%';
    const left = Math.max(15, Math.min(85, normalizedLng * 70 + 15)) + '%';
    
    console.log(`Stylist ${stylist.name}: lat=${stylist.location.lat}, lng=${stylist.location.lng} -> top=${top}, left=${left}`);
    
    return { top, left };
  };

  // Early return with loading state if no stylists
  if (!stylists || stylists.length === 0) {
    return (
      <div className="relative">
        <div className="bg-gray-100 rounded-lg h-80 relative overflow-hidden mb-4 border flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Interactive Map Container */}
      <div className="bg-gray-100 rounded-lg h-80 relative overflow-hidden mb-4 border">
        {/* Map Background - Realistic Map Style */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
          {/* Natural Map Features */}
          <div className="absolute inset-0">
            {/* Water bodies */}
            <div className="absolute top-8 right-8 w-16 h-12 bg-blue-200 rounded-full opacity-60"></div>
            <div className="absolute bottom-12 left-12 w-20 h-8 bg-blue-200 rounded-lg opacity-60"></div>
            
            {/* Parks/Green spaces */}
            <div className="absolute top-16 left-16 w-12 h-12 bg-green-200 rounded-lg opacity-60"></div>
            <div className="absolute bottom-20 right-20 w-14 h-10 bg-green-200 rounded-full opacity-60"></div>
            
            {/* Road lines - simplified organic roads */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <path d="M 0 50 Q 80 30, 160 50 T 320 60" fill="none" stroke="#666" strokeWidth="3"/>
              <path d="M 30 0 Q 50 80, 70 160 T 80 320" fill="none" stroke="#666" strokeWidth="2"/>
              <path d="M 0 120 Q 60 110, 120 120 T 240 130" fill="none" stroke="#888" strokeWidth="2"/>
              <path d="M 200 0 Q 210 60, 220 120 T 240 240" fill="none" stroke="#888" strokeWidth="2"/>
            </svg>
          </div>
          
          {/* Neighborhood Labels */}
          <div className="absolute top-4 left-4 text-xs font-semibold text-gray-600 bg-white/80 px-2 py-1 rounded shadow-sm">
            {stylists?.[0]?.location.address.includes('Toronto') ? 'Toronto, ON' : 'Los Angeles, CA'}
          </div>
          
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-4 right-4 text-xs bg-yellow-100 px-2 py-1 rounded">
              {stylists?.length} stylists
            </div>
          )}
          
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
          {stylists?.map((stylist, index) => {
            const position = calculatePosition(stylist, stylists, index);
            
            return (
              <div
                key={stylist.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-all duration-200 hover:scale-110"
                style={{ 
                  top: position.top, 
                  left: position.left,
                  zIndex: selectedStylist?.id === stylist.id ? 30 : 20
                }}
                onClick={() => setSelectedStylist(stylist)}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                    selectedStylist?.id === stylist.id ? 'bg-purple-700 scale-125' : stylist.isAvailable ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400'
                  }`}>
                    <span className="text-white text-xs font-bold">${stylist.price}</span>
                  </div>
                  
                  {/* Availability indicator */}
                  {stylist.isAvailable && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                  )}
                  {selectedStylist?.id === stylist.id && (
                    <div className="w-16 h-16 bg-purple-600 rounded-full opacity-20 absolute -top-2 -left-2 animate-pulse"></div>
                  )}
                  {/* Stylist name label */}
                  <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white/90 px-1 py-0.5 rounded text-xs font-medium whitespace-nowrap shadow-sm">
                    {stylist.name.split(' ')[0]}
                  </div>
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