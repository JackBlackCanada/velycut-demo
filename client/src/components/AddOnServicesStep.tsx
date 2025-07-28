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
  Users, 
  Clock,
  DollarSign,
  ArrowRight
} from "lucide-react";

interface AddOnService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  popularity: boolean;
}

interface AddOnServicesStepProps {
  selectedAddOns: string[];
  onAddOnsChange: (addOns: string[]) => void;
  onContinue: () => void;
  mainServiceTotal: number;
}

export default function AddOnServicesStep({ 
  selectedAddOns, 
  onAddOnsChange, 
  onContinue,
  mainServiceTotal 
}: AddOnServicesStepProps) {
  const addOnServices: AddOnService[] = [
    {
      id: "hair-wash-massage",
      name: "Hair Wash & Scalp Massage",
      description: "Luxury scalp massage with premium shampoo",
      price: 20,
      duration: "15 min",
      category: "care",
      popularity: true
    },
    {
      id: "deep-conditioning",
      name: "Deep Conditioning Treatment",
      description: "Intensive moisture treatment for enhanced shine",
      price: 30,
      duration: "20 min",
      category: "care",
      popularity: true
    },
    {
      id: "blow-dry-finish",
      name: "Blow Dry & Finish",
      description: "Professional blow dry with styling",
      price: 25,
      duration: "30 min",
      category: "styling",
      popularity: true
    },
    {
      id: "root-touch-up",
      name: "Root Touch-Up",
      description: "Quick color refresh to maintain your look",
      price: 50,
      duration: "30 min",
      category: "color",
      popularity: true
    },
    {
      id: "beard-trim",
      name: "Beard Trim",
      description: "Professional beard grooming",
      price: 20,
      duration: "15 min",
      category: "grooming",
      popularity: false
    },
    {
      id: "styling-tutorial",
      name: "Mini Styling Tutorial",
      description: "Learn to maintain your new look at home",
      price: 15,
      duration: "10 min",
      category: "education",
      popularity: false
    }
  ];

  const popularServices = addOnServices.filter(service => service.popularity);
  const otherServices = addOnServices.filter(service => !service.popularity);

  const toggleService = (serviceId: string) => {
    if (selectedAddOns.includes(serviceId)) {
      onAddOnsChange(selectedAddOns.filter(id => id !== serviceId));
    } else {
      onAddOnsChange([...selectedAddOns, serviceId]);
    }
  };

  const calculateAddOnTotal = () => {
    return selectedAddOns.reduce((total, serviceId) => {
      const service = addOnServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const getMultiServiceDiscount = () => {
    if (selectedAddOns.length >= 2) {
      return Math.min(selectedAddOns.length * 5, 15); // Max $15 discount
    }
    return 0;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'care': return Droplets;
      case 'styling': return Sparkles;
      case 'color': return Palette;
      case 'grooming': return Scissors;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold">Enhance Your Experience</h3>
        <p className="text-gray-600">Add premium services to make your appointment even more special</p>
        
        {selectedAddOns.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-800">
                {selectedAddOns.length} add-on{selectedAddOns.length > 1 ? 's' : ''} selected
              </span>
            </div>
            {getMultiServiceDiscount() > 0 && (
              <p className="text-sm text-purple-700 mt-1">
                Multi-service discount: ${getMultiServiceDiscount()} off!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Popular Add-Ons */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
          Most Popular Add-Ons
        </h4>
        
        {popularServices.map((service) => {
          const isSelected = selectedAddOns.includes(service.id);
          const ServiceIcon = getCategoryIcon(service.category);
          
          return (
            <Card 
              key={service.id} 
              className={`cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'
              }`}
              onClick={() => toggleService(service.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    checked={isSelected}
                    onChange={() => {}}
                  />
                  
                  <ServiceIcon className="w-5 h-5 text-purple-600" />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{service.name}</h5>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">${service.price}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {service.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Other Services */}
      {otherServices.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Other Services</h4>
          
          {otherServices.map((service) => {
            const isSelected = selectedAddOns.includes(service.id);
            const ServiceIcon = getCategoryIcon(service.category);
            
            return (
              <Card 
                key={service.id} 
                className={`cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'
                }`}
                onClick={() => toggleService(service.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={isSelected}
                      onChange={() => {}}
                    />
                    
                    <ServiceIcon className="w-5 h-5 text-gray-600" />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{service.name}</h5>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-700">${service.price}</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {service.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Total Summary */}
      <Card className="border-purple-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Main Service</span>
              <span>${mainServiceTotal}</span>
            </div>
            
            {selectedAddOns.length > 0 && (
              <div className="flex justify-between text-sm">
                <span>Add-ons ({selectedAddOns.length})</span>
                <span>${calculateAddOnTotal()}</span>
              </div>
            )}
            
            {getMultiServiceDiscount() > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Multi-service Discount</span>
                <span>-${getMultiServiceDiscount()}</span>
              </div>
            )}
            
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-bold">Total</span>
              <span className="text-xl font-bold text-purple-600">
                ${mainServiceTotal + calculateAddOnTotal() - getMultiServiceDiscount()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={onContinue}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          size="lg"
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Continue to Payment
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={onContinue}
          className="w-full text-gray-600"
        >
          Skip add-ons
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}