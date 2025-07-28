import { useState } from "react";
import { Search, Filter, MapPin, DollarSign, Star, Clock, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SearchFilters {
  query: string;
  location: string;
  maxDistance: number;
  priceRange: [number, number];
  minRating: number;
  availableNow: boolean;
  specialties: string[];
  sortBy: 'distance' | 'price' | 'rating' | 'availability';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClose: () => void;
}

export default function AdvancedSearch({ onSearch, onClose }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    maxDistance: 10,
    priceRange: [25, 100],
    minRating: 4.0,
    availableNow: false,
    specialties: [],
    sortBy: 'distance'
  });

  const [showFilters, setShowFilters] = useState(false);

  const specialtyOptions = [
    'Basic Cut', 'Color Specialist', 'Curly Hair', 'Men\'s Cuts', 
    'Layered Cut', 'Premium Cut', 'Wash & Style', 'Fade', 
    'Blowout', 'Styling', 'Bridal', 'Extensions'
  ];

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleSpecialty = (specialty: string) => {
    setFilters(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      maxDistance: 10,
      priceRange: [25, 100],
      minRating: 4.0,
      availableNow: false,
      specialties: [],
      sortBy: 'distance'
    });
  };

  const activeFiltersCount = [
    filters.query,
    filters.location,
    filters.maxDistance !== 10,
    filters.priceRange[0] !== 25 || filters.priceRange[1] !== 100,
    filters.minRating !== 4.0,
    filters.availableNow,
    filters.specialties.length > 0
  ].filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <Card className="w-full max-w-md h-[90vh] rounded-t-2xl rounded-b-none overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-headline font-bold">Advanced Search</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between mt-2">
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
              </Badge>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                Clear all
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-4 overflow-y-auto h-full pb-24">
          {/* Basic Search */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Search by name or style</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="e.g. Sarah, blonde highlights"
                  value={filters.query}
                  onChange={(e) => updateFilter('query', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Location</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Address, neighborhood, or postal code"
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Toggle Advanced Filters */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Sliders className="w-4 h-4" />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </Button>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="space-y-6 pt-4 border-t border-gray-200">
                {/* Distance */}
                <div>
                  <Label className="text-sm font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Max Distance: {filters.maxDistance} km
                  </Label>
                  <Slider
                    value={[filters.maxDistance]}
                    onValueChange={(value) => updateFilter('maxDistance', value[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </Label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                    max={200}
                    min={20}
                    step={5}
                    className="mt-2"
                  />
                </div>

                {/* Rating */}
                <div>
                  <Label className="text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Minimum Rating: {filters.minRating.toFixed(1)}★
                  </Label>
                  <Slider
                    value={[filters.minRating]}
                    onValueChange={(value) => updateFilter('minRating', value[0])}
                    max={5.0}
                    min={3.0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                {/* Availability */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available-now"
                    checked={filters.availableNow}
                    onCheckedChange={(checked) => updateFilter('availableNow', checked)}
                  />
                  <Label htmlFor="available-now" className="text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Available now
                  </Label>
                </div>

                {/* Specialties */}
                <div>
                  <Label className="text-sm font-medium">Specialties</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {specialtyOptions.map((specialty) => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox
                          id={specialty}
                          checked={filters.specialties.includes(specialty)}
                          onCheckedChange={() => toggleSpecialty(specialty)}
                        />
                        <Label htmlFor={specialty} className="text-xs">
                          {specialty}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <Label className="text-sm font-medium">Sort by</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { key: 'distance', label: 'Distance' },
                      { key: 'price', label: 'Price' },
                      { key: 'rating', label: 'Rating' },
                      { key: 'availability', label: 'Availability' }
                    ].map((option) => (
                      <Button
                        key={option.key}
                        variant={filters.sortBy === option.key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFilter('sortBy', option.key)}
                        className="text-xs"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <Button
            onClick={handleSearch}
            className="w-full btn-primary"
          >
            Search Stylists
          </Button>
        </div>
      </Card>
    </div>
  );
}