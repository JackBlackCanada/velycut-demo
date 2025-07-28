import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Camera, 
  Plus, 
  Minus, 
  Users, 
  Repeat,
  Star,
  Upload,
  X
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  price: number; // Dynamic pricing
}

interface GroupMember {
  name: string;
  services: Service[];
}

interface EnhancedBookingProps {
  stylistId: string;
  onBookingComplete: (bookingId: string) => void;
}

export default function EnhancedBooking({ stylistId, onBookingComplete }: EnhancedBookingProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [address, setAddress] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [inspirationPhotos, setInspirationPhotos] = useState<File[]>([]);
  const [isGroupBooking, setIsGroupBooking] = useState(false);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');

  // Fetch available services
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/stylist', stylistId, 'services'],
  });

  // Fetch available time slots
  const { data: timeSlots, isLoading: timeSlotsLoading } = useQuery({
    queryKey: ['/api/stylist', stylistId, 'availability', selectedDate],
    enabled: !!selectedDate,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return apiRequest('POST', '/api/bookings', bookingData);
    },
    onSuccess: (data) => {
      toast({ title: "Booking created successfully!" });
      onBookingComplete(data.id);
    },
    onError: () => {
      toast({ 
        title: "Failed to create booking", 
        description: "Please try again",
        variant: "destructive" 
      });
    }
  });

  const handleServiceToggle = (service: Service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + inspirationPhotos.length > 5) {
      toast({ 
        title: "Too many photos", 
        description: "Maximum 5 photos allowed",
        variant: "destructive" 
      });
      return;
    }
    setInspirationPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setInspirationPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const addGroupMember = () => {
    setGroupMembers(prev => [...prev, { name: "", services: [] }]);
  };

  const updateGroupMember = (index: number, field: string, value: any) => {
    setGroupMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    ));
  };

  const removeGroupMember = (index: number) => {
    setGroupMembers(prev => prev.filter((_, i) => i !== index));
  };

  const getTotalPrice = () => {
    let basePrice = selectedServices.reduce((total, service) => total + service.price, 0);
    
    if (isGroupBooking) {
      const groupPrice = groupMembers.reduce((total, member) => 
        total + member.services.reduce((memberTotal, service) => memberTotal + service.price, 0), 0
      );
      basePrice += groupPrice;
    }

    // Apply dynamic pricing based on time slot
    if (selectedTime && timeSlots) {
      const timeSlot = (timeSlots as TimeSlot[]).find(slot => slot.time === selectedTime);
      if (timeSlot && timeSlot.price !== 1) {
        basePrice *= timeSlot.price; // Price multiplier
      }
    }

    return basePrice;
  };

  const getTotalDuration = () => {
    let duration = selectedServices.reduce((total, service) => total + service.duration, 0);
    
    if (isGroupBooking) {
      const groupDuration = groupMembers.reduce((total, member) => 
        total + member.services.reduce((memberTotal, service) => memberTotal + service.duration, 0), 0
      );
      duration += groupDuration;
    }

    return duration;
  };

  const handleSubmit = async () => {
    const bookingData = {
      stylistId,
      services: selectedServices.map(s => s.id),
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      address,
      specialRequests,
      inspirationPhotos: inspirationPhotos.map(photo => photo.name), // In production, upload to cloud storage
      isGroupBooking,
      groupMembers: isGroupBooking ? groupMembers : [],
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : null,
      totalAmount: getTotalPrice(),
      estimatedDuration: getTotalDuration()
    };

    createBookingMutation.mutate(bookingData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedServices.length > 0;
      case 2: return selectedDate && selectedTime;
      case 3: return address.trim().length > 0;
      case 4: return true;
      default: return false;
    }
  };

  if (servicesLoading) {
    return (
      <div className="app-container">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-content">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of 4</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-purple-600" />
                Select Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Group Booking Toggle */}
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Group Booking</Label>
                  <p className="text-xs text-gray-600">Book for multiple people</p>
                </div>
                <Switch
                  checked={isGroupBooking}
                  onCheckedChange={setIsGroupBooking}
                />
              </div>

              {/* Service Selection */}
              <div className="grid gap-3">
                {(services as Service[] || []).map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedServices.find(s => s.id === service.id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleServiceToggle(service)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {service.duration} min
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${service.price}</div>
                        {selectedServices.find(s => s.id === service.id) && (
                          <Badge className="mt-1">Selected</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Group Members */}
              {isGroupBooking && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Group Members</Label>
                    <Button variant="outline" size="sm" onClick={addGroupMember}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Member
                    </Button>
                  </div>
                  
                  {groupMembers.map((member, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <Input
                          placeholder="Member name"
                          value={member.name}
                          onChange={(e) => updateGroupMember(index, 'name', e.target.value)}
                          className="flex-1 mr-2"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGroupMember(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {/* Services for this member would go here */}
                    </div>
                  ))}
                </div>
              )}

              {/* Recurring Booking */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Recurring Appointment</Label>
                  <p className="text-xs text-gray-600">Set up regular appointments</p>
                </div>
                <Switch
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
              </div>

              {isRecurring && (
                <div className="flex gap-2">
                  {(['weekly', 'biweekly', 'monthly'] as const).map((freq) => (
                    <Button
                      key={freq}
                      variant={recurringFrequency === freq ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setRecurringFrequency(freq)}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Date & Time */}
        {currentStep === 2 && (
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                Choose Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Select Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Available Times</Label>
                  {timeSlotsLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {(timeSlots as TimeSlot[] || []).map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? 'default' : 'outline'}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className="flex flex-col p-3 h-auto"
                        >
                          <span>{slot.time}</span>
                          {slot.price !== 1 && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {slot.price > 1 ? `+${Math.round((slot.price - 1) * 100)}%` : `${Math.round((1 - slot.price) * 100)}% off`}
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Duration Estimate */}
              {selectedServices.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span>Estimated Duration:</span>
                    <span className="font-medium">{getTotalDuration()} minutes</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Location & Details */}
        {currentStep === 3 && (
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                Location & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Address */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Service Address</Label>
                <Textarea
                  placeholder="Enter your full address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Special Requests */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Special Requests</Label>
                <Textarea
                  placeholder="Any specific requests, allergies, or notes..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Inspiration Photos */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Inspiration Photos (Optional)</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <span className="text-sm text-gray-600">Upload photos</span>
                      </div>
                    </Label>
                    <Input
                      id="photo-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>

                  {inspirationPhotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {inspirationPhotos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Inspiration ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-6 h-6 p-0"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review & Confirm */}
        {currentStep === 4 && (
          <Card className="ios-card">
            <CardHeader>
              <CardTitle>Review Your Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Services Summary */}
              <div>
                <h4 className="font-semibold mb-2">Services</h4>
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex justify-between items-center py-1">
                    <span className="text-sm">{service.name}</span>
                    <span className="text-sm font-medium">${service.price}</span>
                  </div>
                ))}
              </div>

              {/* Date & Time */}
              <div>
                <h4 className="font-semibold mb-2">Appointment</h4>
                <div className="text-sm space-y-1">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {selectedDate && new Date(selectedDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {selectedTime}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {address}
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">${getTotalPrice()}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Duration: {getTotalDuration()} minutes
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? 'Creating...' : 'Confirm Booking'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}