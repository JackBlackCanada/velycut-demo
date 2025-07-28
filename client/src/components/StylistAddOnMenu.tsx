import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Sparkles, 
  Droplets, 
  Scissors, 
  Palette, 
  Heart, 
  Users, 
  TrendingUp,
  Clock,
  DollarSign,
  Star
} from "lucide-react";

interface AddOnService {
  id: string;
  category: string;
  service: string;
  description: string;
  priceMin: number;
  priceMax: number;
  duration: string;
  popularity: number;
  icon: any;
  benefits: string[];
}

interface StylistAddOnMenuProps {
  stylistId: string;
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  onContinue: () => void;
  mainServicePrice: number;
}

export default function StylistAddOnMenu({ 
  stylistId, 
  selectedServices, 
  onServicesChange, 
  onContinue,
  mainServicePrice 
}: StylistAddOnMenuProps) {
  const [activeCategory, setActiveCategory] = useState("popular");

  const addOnServices: AddOnService[] = [
    // Hair Care Add-Ons
    {
      id: "hair-wash-massage",
      category: "hair-care",
      service: "Hair Wash & Scalp Massage",
      description: "Luxury scalp massage with premium shampoo for ultimate relaxation",
      priceMin: 15,
      priceMax: 25,
      duration: "15 min",
      popularity: 85,
      icon: Droplets,
      benefits: ["Deep relaxation", "Improved circulation", "Stress relief"]
    },
    {
      id: "deep-conditioning",
      category: "hair-care",
      service: "Deep Conditioning Treatment",
      description: "Intensive moisture treatment for enhanced shine and texture",
      priceMin: 25,
      priceMax: 40,
      duration: "20 min",
      popularity: 78,
      icon: Sparkles,
      benefits: ["Improved shine", "Softer texture", "Damage repair"]
    },
    {
      id: "hot-oil-treatment",
      category: "hair-care",
      service: "Hot Oil Treatment",
      description: "Nourishing hot oil therapy to restore moisture and vitality",
      priceMin: 30,
      priceMax: 45,
      duration: "25 min",
      popularity: 72,
      icon: Droplets,
      benefits: ["Moisture restoration", "Frizz control", "Natural shine"]
    },
    {
      id: "keratin-treatment",
      category: "hair-care",
      service: "Protein/Keratin Treatment",
      description: "Professional smoothing treatment to eliminate frizz and repair damage",
      priceMin: 80,
      priceMax: 150,
      duration: "45 min",
      popularity: 65,
      icon: Star,
      benefits: ["Frizz elimination", "Hair repair", "Long-lasting smoothness"]
    },
    
    // Styling & Finishing
    {
      id: "blow-dry-finish",
      category: "styling",
      service: "Blow Dry & Finish",
      description: "Professional blow dry with styling for a polished, ready-to-go look",
      priceMin: 20,
      priceMax: 40,
      duration: "30 min",
      popularity: 90,
      icon: Scissors,
      benefits: ["Salon-perfect finish", "Extended style life", "Professional look"]
    },
    {
      id: "curling-styling",
      category: "styling",
      service: "Curling or Flat Iron Styling",
      description: "Expert heat styling for special events or polished everyday looks",
      priceMin: 30,
      priceMax: 50,
      duration: "25 min",
      popularity: 68,
      icon: Sparkles,
      benefits: ["Event-ready style", "Long-lasting hold", "Professional technique"]
    },
    {
      id: "braiding-twists",
      category: "styling",
      service: "Braiding or Twists",
      description: "Functional and fashionable protective styling options",
      priceMin: 25,
      priceMax: 75,
      duration: "45 min",
      popularity: 60,
      icon: Heart,
      benefits: ["Protective styling", "Versatile looks", "Low maintenance"]
    },
    {
      id: "updo-special",
      category: "styling",
      service: "Updos (Weddings/Events)",
      description: "Elegant formal updos perfect for special occasions and events",
      priceMin: 60,
      priceMax: 120,
      duration: "60 min",
      popularity: 45,
      icon: Star,
      benefits: ["Special occasion ready", "Long-lasting hold", "Elegant finish"]
    },

    // Color & Enhancements
    {
      id: "root-touch-up",
      category: "color",
      service: "Root Touch-Up",
      description: "Quick color refresh to maintain your look between full appointments",
      priceMin: 40,
      priceMax: 70,
      duration: "30 min",
      popularity: 82,
      icon: Palette,
      benefits: ["Color maintenance", "Extended salon visit", "Seamless coverage"]
    },
    {
      id: "toner-application",
      category: "color",
      service: "Toner Application",
      description: "Color-enhancing toner to refresh and perfect your hair tone",
      priceMin: 30,
      priceMax: 60,
      duration: "20 min",
      popularity: 55,
      icon: Palette,
      benefits: ["Enhanced color", "Tone correction", "Vibrant finish"]
    },

    // Family & Add-on Cuts
    {
      id: "family-bundle",
      category: "family",
      service: "Family Cut Bundle",
      description: "Additional family member cuts at discounted rates",
      priceMin: 25,
      priceMax: 40,
      duration: "30 min each",
      popularity: 40,
      icon: Users,
      benefits: ["Family savings", "Convenient timing", "Group discount"]
    },
    {
      id: "children-cut",
      category: "family",
      service: "Children's Haircut",
      description: "Kid-friendly cuts with patience and gentle techniques",
      priceMin: 20,
      priceMax: 30,
      duration: "20 min",
      popularity: 50,
      icon: Heart,
      benefits: ["Child-friendly service", "Quick & gentle", "Parent convenience"]
    },
    {
      id: "beard-trim",
      category: "family",
      service: "Beard Trim or Shape-Up",
      description: "Professional beard grooming to complement your new haircut",
      priceMin: 15,
      priceMax: 25,
      duration: "15 min",
      popularity: 35,
      icon: Scissors,
      benefits: ["Complete grooming", "Professional finish", "Value addition"]
    },

    // Revenue Boosters
    {
      id: "styling-tutorial",
      category: "extras",
      service: "Mini Styling Tutorial",
      description: "Personalized how-to session for maintaining your new look at home",
      priceMin: 10,
      priceMax: 20,
      duration: "10 min",
      popularity: 25,
      icon: TrendingUp,
      benefits: ["Learn techniques", "Maintain style", "Personal guidance"]
    }
  ];

  const categories = [
    { id: "popular", name: "Most Popular", icon: TrendingUp },
    { id: "hair-care", name: "Hair Care", icon: Droplets },
    { id: "styling", name: "Styling", icon: Sparkles },
    { id: "color", name: "Color", icon: Palette },
    { id: "family", name: "Family", icon: Users },
    { id: "extras", name: "Extras", icon: Star }
  ];

  const getFilteredServices = () => {
    if (activeCategory === "popular") {
      return addOnServices.filter(service => service.popularity >= 70).sort((a, b) => b.popularity - a.popularity);
    }
    return addOnServices.filter(service => service.category === activeCategory);
  };

  const calculateTotal = () => {
    const addOnTotal = selectedServices.reduce((total, serviceId) => {
      const service = addOnServices.find(s => s.id === serviceId);
      return total + (service?.priceMin || 0);
    }, 0);
    return mainServicePrice + addOnTotal;
  };

  const calculateSavings = () => {
    if (selectedServices.length >= 2) {
      return Math.floor(selectedServices.length * 5); // $5 savings per additional service
    }
    return 0;
  };

  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      onServicesChange(selectedServices.filter(id => id !== serviceId));
    } else {
      onServicesChange([...selectedServices, serviceId]);
    }
  };

  return (
    <div className="app-container">
      <div className="app-content space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Enhance Your Experience</h2>
          <p className="text-gray-600">Add premium services to make your appointment even more special</p>
          
          {selectedServices.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">
                  {selectedServices.length} add-on{selectedServices.length > 1 ? 's' : ''} selected
                </span>
              </div>
              {calculateSavings() > 0 && (
                <p className="text-sm text-green-700 mt-1">
                  You're saving ${calculateSavings()} with multiple services!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                <CategoryIcon className="w-4 h-4" />
                <span>{category.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="space-y-3">
          {getFilteredServices().map((service) => {
            const ServiceIcon = service.icon;
            const isSelected = selectedServices.includes(service.id);
            
            return (
              <Card 
                key={service.id} 
                className={`ios-card cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'
                }`}
                onClick={() => toggleService(service.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Checkbox 
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <ServiceIcon className="w-5 h-5 text-purple-600" />
                            <h3 className="font-semibold text-gray-900">{service.service}</h3>
                            {service.popularity >= 70 && (
                              <Badge variant="secondary" className="text-xs">Popular</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-purple-600">
                            ${service.priceMin}
                            {service.priceMax > service.priceMin && `–$${service.priceMax}`}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {service.duration}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {service.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary & Continue */}
        <Card className="ios-card border-purple-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Service Total:</span>
                <span className="text-xl font-bold text-purple-600">
                  ${calculateTotal()}
                </span>
              </div>
              
              {calculateSavings() > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="font-medium">Multi-service Savings:</span>
                  <span className="font-bold">-${calculateSavings()}</span>
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-purple-600">
                    ${calculateTotal() - calculateSavings()}
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={onContinue}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Continue to Payment
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={onContinue}
                className="w-full text-gray-600"
              >
                Skip add-ons and continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}