import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  MapPin, 
  Clock, 
  Star, 
  Calendar, 
  CreditCard, 
  User, 
  Camera,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { useLocation } from "wouter";
import WeatherIntegration from "./WeatherIntegration";
import PhotoUploadBooking from "./PhotoUploadBooking";
import AddOnServicesStep from "./AddOnServicesStep";

interface SmartBookingWizardProps {
  stylistId: string;
  stylist?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    rating: number;
    reviewCount: number;
  };
}

interface BookingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  isComplete: boolean;
}

export default function SmartBookingWizard({ stylistId, stylist }: SmartBookingWizardProps) {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<any>({
    services: [],
    addOnServices: [],
    datetime: null,
    location: '',
    specialRequests: '',
    photos: [],
    groupSize: 1,
    recurringBooking: false
  });

  // Smart service recommendations based on AI analysis
  const recommendedServices = [
    {
      id: 'cut-style',
      name: 'Precision Cut & Style',
      description: 'Professional cut with styling',
      duration: '90 min',
      price: 85,
      isRecommended: true,
      aiReason: 'Perfect for your hair type and face shape'
    },
    {
      id: 'color-touch',
      name: 'Color Touch-up',
      description: 'Root touch-up and gloss',
      duration: '120 min',
      price: 120,
      isRecommended: false,
      aiReason: 'Based on your last appointment 6 weeks ago'
    },
    {
      id: 'deep-treatment',
      name: 'Deep Conditioning',
      description: 'Intensive hair treatment',
      duration: '45 min',
      price: 45,
      isRecommended: true,
      aiReason: 'Weather conditions suggest extra hydration'
    }
  ];

  const steps: BookingStep[] = [
    {
      id: 'services',
      title: 'Select Services',
      description: 'Choose your desired services',
      isComplete: bookingData.services.length > 0,
      component: (
        <div className="space-y-4">
          <WeatherIntegration location="Toronto" />
          
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
              AI Recommended for You
            </h3>
            {recommendedServices.map(service => (
              <Card 
                key={service.id}
                className={`cursor-pointer transition-all ${
                  bookingData.services.includes(service.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  const newServices = bookingData.services.includes(service.id)
                    ? bookingData.services.filter((s: string) => s !== service.id)
                    : [...bookingData.services, service.id];
                  setBookingData({ ...bookingData, services: newServices });
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{service.name}</h4>
                        {service.isRecommended && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {service.duration}
                        </span>
                        <span className="font-semibold text-purple-600">
                          ${service.price}
                        </span>
                      </div>
                      {service.isRecommended && (
                        <p className="text-xs text-green-700 mt-1 italic">
                          💡 {service.aiReason}
                        </p>
                      )}
                    </div>
                    {bookingData.services.includes(service.id) && (
                      <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'datetime',
      title: 'Date & Time',
      description: 'Choose when you want your appointment',
      isComplete: bookingData.datetime !== null,
      component: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Select Date</Label>
            <Input
              type="date"
              value={bookingData.date || ''}
              onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Select Time</Label>
            <div className="grid grid-cols-3 gap-2">
              {['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'].map(time => (
                <Button
                  key={time}
                  variant={bookingData.time === time ? "default" : "outline"}
                  onClick={() => {
                    setBookingData({ 
                      ...bookingData, 
                      time,
                      datetime: new Date(`${bookingData.date}T${time}`)
                    });
                  }}
                  className="text-sm"
                  disabled={!bookingData.date}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Smart scheduling suggestions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">💡 Best Times: </span>
                Morning slots (9:00-12:00) are typically less rushed and allow for the best natural lighting for your photos.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'location',
      title: 'Location & Details',
      description: 'Where should your stylist come to you?',
      isComplete: bookingData.location.length > 0,
      component: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Your Address</Label>
            <Input
              placeholder="Enter your full address"
              value={bookingData.location}
              onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Group Size</Label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map(size => (
                <Button
                  key={size}
                  variant={bookingData.groupSize === size ? "default" : "outline"}
                  onClick={() => setBookingData({ ...bookingData, groupSize: size })}
                  className="w-12 h-12"
                >
                  {size}
                </Button>
              ))}
            </div>
            {bookingData.groupSize > 1 && (
              <p className="text-xs text-gray-600 mt-1">
                Additional person: +${(bookingData.groupSize - 1) * 30}
              </p>
            )}
          </div>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3">
              <p className="text-sm text-green-800">
                <span className="font-medium">🏡 Home Service Benefits: </span>
                Comfortable environment, no travel time, personalized attention, and COVID-safe experience.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'photos',
      title: 'Style Inspiration',
      description: 'Share photos of your desired look',
      isComplete: true, // Optional step
      component: (
        <PhotoUploadBooking
          stylistId={stylistId}
          selectedServices={bookingData.services}
          onBookingSubmit={(data) => {
            setBookingData({ ...bookingData, ...data });
            setCurrentStep(currentStep + 1);
          }}
        />
      )
    },
    {
      id: 'payment',
      title: 'Payment & Confirmation',
      description: 'Complete your booking',
      isComplete: false,
      component: (
        <div className="space-y-4">
          {/* Booking Summary */}
          <Card className="ios-card">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={stylist?.profileImageUrl} />
                  <AvatarFallback>
                    {stylist?.firstName?.[0]}{stylist?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {stylist?.firstName} {stylist?.lastName}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {stylist?.rating || 4.9} • {stylist?.reviewCount || 127} reviews
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Services</span>
                  <span>${calculateMainTotal()}</span>
                </div>
                {bookingData.addOnServices.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Add-ons ({bookingData.addOnServices.length})</span>
                    <span>${calculateAddOnTotal()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Travel Fee</span>
                  <span>$15</span>
                </div>
                {bookingData.groupSize > 1 && (
                  <div className="flex justify-between text-sm">
                    <span>Additional Persons ({bookingData.groupSize - 1})</span>
                    <span>${(bookingData.groupSize - 1) * 30}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>${calculateMainTotal() + calculateAddOnTotal() + 15 + (bookingData.groupSize - 1) * 30}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleCompleteBooking}
            className="w-full btn-primary"
            size="lg"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Complete Booking
          </Button>
        </div>
      )
    },
    {
      id: 'add-ons',
      title: 'Add-On Services',
      description: 'Enhance your experience',
      isComplete: true, // Optional step
      component: (
        <AddOnServicesStep
          selectedAddOns={bookingData.addOnServices}
          onAddOnsChange={(addOns) => setBookingData({...bookingData, addOnServices: addOns})}
          onContinue={() => setCurrentStep(currentStep + 1)}
          mainServiceTotal={calculateMainTotal()}
        />
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateMainTotal = () => {
    return bookingData.services.reduce((total: number, serviceId: string) => {
      const service = recommendedServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const calculateAddOnTotal = () => {
    const addOnServices = [
      { id: "hair-wash-massage", price: 20 },
      { id: "deep-conditioning", price: 30 },
      { id: "blow-dry-finish", price: 25 },
      { id: "root-touch-up", price: 50 },
      { id: "beard-trim", price: 20 },
      { id: "styling-tutorial", price: 15 }
    ];
    
    return bookingData.addOnServices.reduce((total: number, serviceId: string) => {
      const service = addOnServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateMainTotal() + calculateAddOnTotal();
  };

  const handleCompleteBooking = () => {
    // Navigate to payment flow
    navigate('/checkout');
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="app-container">
      <div className="app-content">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-title-large">Smart Booking</h1>
            <span className="text-sm text-gray-600">
              {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <div className="flex space-x-1">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 h-2 rounded-full ${
                  index < currentStep
                    ? 'bg-green-500'
                    : index === currentStep
                    ? 'bg-purple-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="ios-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <h2 className="text-headline">{currentStepData.title}</h2>
                <p className="text-caption text-gray-600">{currentStepData.description}</p>
              </div>
              {currentStepData.isComplete && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStepData.component}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex space-x-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          {currentStep < steps.length - 1 && (
            <Button
              onClick={nextStep}
              disabled={!currentStepData.isComplete}
              className="flex-1 btn-primary"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}