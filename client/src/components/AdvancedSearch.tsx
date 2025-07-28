import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Filter, MapPin, Star, DollarSign, Clock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchFilters {
  location: string;
  radius: number;
  priceMin: number;
  priceMax: number;
  minRating: number;
  specialties: string[];
  availability: string;
  language?: string;
  sortBy: string;
}

export default function AdvancedSearch() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    radius: 10,
    priceMin: 20,
    priceMax: 200,
    minRating: 0,
    specialties: [],
    availability: "any",
    sortBy: "rating"
  });

  const specialtyOptions = [
    "Hair Cutting", "Hair Coloring", "Highlights", "Balayage", 
    "Keratin Treatment", "Hair Extensions", "Bridal Styling", 
    "Men's Cuts", "Beard Trimming", "Kids Cuts", "Curly Hair",
    "Color Correction", "Perm", "Hair Treatments", "Styling"
  ];

  const handleSpecialtyToggle = (specialty: string) => {
    setFilters(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      radius: 10,
      priceMin: 20,
      priceMax: 200,
      minRating: 0,
      specialties: [],
      availability: "any",
      language: "",
      sortBy: "rating"
    });
    setSearchQuery("");
  };

  const applyFilters = () => {
    // Simulate search with filters
    toast({
      title: "Search Applied",
      description: `Found stylists matching your criteria in ${filters.location || 'your area'}`,
    });
    setIsOpen(false);
  };

  const activeFiltersCount = [
    filters.location,
    filters.minRating > 0,
    filters.specialties.length > 0,
    filters.availability !== "any",
    filters.language,
    filters.priceMin > 20 || filters.priceMax < 200
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search stylists, services, or areas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-12"
        />
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Filter className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center bg-purple-500 text-white text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent side="right" className="w-full sm:w-96 p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-headline font-bold">Search Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Clear all
                  </Button>
                </div>
              </div>

              {/* Filters Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Location */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location & Distance
                  </Label>
                  <div className="space-y-3">
                    <Input
                      placeholder="Enter address or postal code"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    />
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Max distance</span>
                        <span className="text-sm font-medium">{filters.radius} km</span>
                      </div>
                      <Slider
                        value={[filters.radius]}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, radius: value[0] }))}
                        max={50}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Price Range
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        ${filters.priceMin} - ${filters.priceMax}
                      </span>
                    </div>
                    <div className="px-2">
                      <Slider
                        value={[filters.priceMin, filters.priceMax]}
                        onValueChange={(value) => setFilters(prev => ({ 
                          ...prev, 
                          priceMin: value[0], 
                          priceMax: value[1] 
                        }))}
                        max={300}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    <Star className="w-4 h-4 inline mr-2" />
                    Minimum Rating
                  </Label>
                  <Select
                    value={filters.minRating.toString()}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any rating</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="5">5 stars only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Availability
                  </Label>
                  <Select
                    value={filters.availability}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="today">Available today</SelectItem>
                      <SelectItem value="tomorrow">Available tomorrow</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="weekend">Weekends</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Specialties */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Specialties
                  </Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {specialtyOptions.map((specialty) => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox
                          id={specialty}
                          checked={filters.specialties.includes(specialty)}
                          onCheckedChange={() => handleSpecialtyToggle(specialty)}
                        />
                        <Label htmlFor={specialty} className="text-xs cursor-pointer">
                          {specialty}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Language Preference */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Preferred Language
                  </Label>
                  <Select
                    value={filters.language || "any"}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, language: value === "any" ? "" : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any language</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="mandarin">Mandarin Chinese</SelectItem>
                      <SelectItem value="cantonese">Cantonese</SelectItem>
                      <SelectItem value="punjabi">Punjabi</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                      <SelectItem value="tagalog">Tagalog</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="portuguese">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Sort By
                  </Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to high</SelectItem>
                      <SelectItem value="price-high">Price: High to low</SelectItem>
                      <SelectItem value="distance">Nearest first</SelectItem>
                      <SelectItem value="popular">Most popular</SelectItem>
                      <SelectItem value="newest">Newest stylists</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-gray-50 space-y-3">
                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {filters.location && (
                      <Badge variant="secondary" className="text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {filters.location}
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, location: "" }))}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.minRating > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        {filters.minRating}+ stars
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, minRating: 0 }))}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                        <button
                          onClick={() => handleSpecialtyToggle(specialty)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 btn-primary"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Quick Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={filters.availability === "today" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilters(prev => ({ 
            ...prev, 
            availability: prev.availability === "today" ? "any" : "today" 
          }))}
          className="whitespace-nowrap"
        >
          Available Today
        </Button>
        <Button
          variant={filters.minRating === 5 ? "default" : "outline"}
          size="sm"
          onClick={() => setFilters(prev => ({ 
            ...prev, 
            minRating: prev.minRating === 5 ? 0 : 5 
          }))}
          className="whitespace-nowrap"
        >
          <Star className="w-3 h-3 mr-1" />
          5 Stars
        </Button>
        <Button
          variant={filters.specialties.includes("Hair Cutting") ? "default" : "outline"}
          size="sm"
          onClick={() => handleSpecialtyToggle("Hair Cutting")}
          className="whitespace-nowrap"
        >
          Hair Cuts
        </Button>
        <Button
          variant={filters.specialties.includes("Hair Coloring") ? "default" : "outline"}
          size="sm"
          onClick={() => handleSpecialtyToggle("Hair Coloring")}
          className="whitespace-nowrap"
        >
          Coloring
        </Button>
      </div>

      {/* Search Results Preview */}
      {(searchQuery || activeFiltersCount > 0) && (
        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Search Results</h3>
                <p className="text-sm text-gray-600">
                  {Math.floor(Math.random() * 20) + 5} stylists found
                  {filters.location && ` near ${filters.location}`}
                </p>
              </div>
              <Button size="sm" className="btn-primary">
                View Results
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}