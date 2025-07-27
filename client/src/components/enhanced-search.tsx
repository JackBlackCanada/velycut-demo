import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Filter, X } from "lucide-react";

interface SearchFilters {
  location: string;
  priceRange: [number, number];
  specializations: string[];
  availability: string;
  rating: number;
}

interface EnhancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  loading?: boolean;
}

export default function EnhancedSearch({ onSearch, loading }: EnhancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    priceRange: [20, 200],
    specializations: [],
    availability: "",
    rating: 0,
  });

  const specializations = [
    "Hair Cutting",
    "Hair Coloring",
    "Hair Styling",
    "Beard Trimming",
    "Wedding Hair",
    "Extensions",
    "Curly Hair",
    "Men's Grooming",
  ];

  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      priceRange: [20, 200],
      specializations: [],
      availability: "",
      rating: 0,
    });
    setSearchQuery("");
    onSearch("", {
      location: "",
      priceRange: [20, 200],
      specializations: [],
      availability: "",
      rating: 0,
    });
  };

  const toggleSpecialization = (spec: string) => {
    setFilters(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  return (
    <div className="mobile-container py-6 space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search stylists by name, location, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 text-lg"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="p-3"
        >
          <Filter className="w-4 h-4" />
        </Button>
        <Button onClick={handleSearch} disabled={loading} className="px-6">
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Active Filters Display */}
      {(filters.location || filters.specializations.length > 0 || filters.rating > 0) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-600">Active Filters:</span>
          {filters.location && (
            <Badge variant="secondary" className="gap-1">
              <MapPin className="w-3 h-3" />
              {filters.location}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, location: "" }))}
              />
            </Badge>
          )}
          {filters.specializations.map(spec => (
            <Badge key={spec} variant="secondary" className="gap-1">
              {spec}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleSpecialization(spec)}
              />
            </Badge>
          ))}
          {filters.rating > 0 && (
            <Badge variant="secondary" className="gap-1">
              {filters.rating}+ Stars
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, rating: 0 }))}
              />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card className="glass-card">
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Location Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Location
                </label>
                <Select
                  value={filters.location}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manhattan">Manhattan</SelectItem>
                    <SelectItem value="brooklyn">Brooklyn</SelectItem>
                    <SelectItem value="queens">Queens</SelectItem>
                    <SelectItem value="bronx">Bronx</SelectItem>
                    <SelectItem value="staten-island">Staten Island</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                  max={300}
                  min={10}
                  step={10}
                  className="mt-2"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Minimum Rating
                </label>
                <Select
                  value={filters.rating.toString()}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, rating: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Specializations */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Specializations
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {specializations.map(spec => (
                  <div key={spec} className="flex items-center space-x-2">
                    <Checkbox
                      id={spec}
                      checked={filters.specializations.includes(spec)}
                      onCheckedChange={() => toggleSpecialization(spec)}
                    />
                    <label
                      htmlFor={spec}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {spec}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Availability
              </label>
              <Select
                value={filters.availability}
                onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any time</SelectItem>
                  <SelectItem value="today">Available today</SelectItem>
                  <SelectItem value="tomorrow">Available tomorrow</SelectItem>
                  <SelectItem value="this-week">This week</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}