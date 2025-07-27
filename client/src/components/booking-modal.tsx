import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const bookingSchema = z.object({
  stylistId: z.string().min(1, "Stylist is required"),
  serviceId: z.string().min(1, "Service is required"),
  scheduledAt: z.string().min(1, "Date and time is required"),
  clientAddress: z.string().min(1, "Address is required"),
  clientPhone: z.string().min(10, "Phone number is required"),
  specialRequests: z.string().optional(),
  totalAmount: z.number().min(0, "Amount is required"),
});

type BookingForm = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  stylist?: any;
}

export default function BookingModal({ open, onClose, stylist }: BookingModalProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Get stylists for selection if none provided
  const { data: stylists } = useQuery({
    queryKey: ["/api/stylists"],
    enabled: !stylist,
  });

  // Get services for selected stylist
  const { data: services } = useQuery({
    queryKey: ["/api/services/stylist", stylist?.id],
    enabled: !!stylist?.id,
  });

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      stylistId: stylist?.id || "",
      serviceId: "",
      scheduledAt: "",
      clientAddress: "",
      clientPhone: "",
      specialRequests: "",
      totalAmount: 0,
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingForm) => {
      return await apiRequest("POST", "/api/bookings", data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/user"] });
      toast({
        title: "Booking Created!",
        description: "Your appointment has been scheduled successfully.",
      });
      onClose();
      // Navigate to checkout for payment
      navigate('/checkout');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingForm) => {
    bookingMutation.mutate(data);
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = services?.find((s: any) => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      form.setValue("serviceId", serviceId);
      form.setValue("totalAmount", parseFloat(service.price));
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !form.getValues("serviceId")) {
      toast({
        title: "Select a Service",
        description: "Please select a service to continue.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-2">Book Your Service</DialogTitle>
          <p className="text-center text-gray-600">Choose your preferred time and service</p>
        </DialogHeader>

        {/* Booking Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center text-sm font-semibold`}>
                1
              </div>
              <span className={`ml-2 text-sm ${currentStep >= 1 ? 'font-medium' : 'text-gray-600'}`}>
                Service
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center text-sm font-semibold`}>
                2
              </div>
              <span className={`ml-2 text-sm ${currentStep >= 2 ? 'font-medium' : 'text-gray-600'}`}>
                Details
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center text-sm font-semibold`}>
                3
              </div>
              <span className={`ml-2 text-sm ${currentStep >= 3 ? 'font-medium' : 'text-gray-600'}`}>
                Confirm
              </span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Select Service</h4>
                
                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleServiceSelect(value);
                          }}
                          value={field.value}
                          className="space-y-3"
                        >
                          {services?.map((service: any) => (
                            <div key={service.id} className="flex items-center space-x-2 p-4 border-2 border-gray-200 rounded-xl hover:border-primary cursor-pointer">
                              <RadioGroupItem value={service.id} id={service.id} />
                              <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{service.name}</span>
                                  <span className="font-semibold">${service.price}</span>
                                </div>
                                <p className="text-sm text-gray-600">{service.description}</p>
                                <p className="text-xs text-gray-500">{service.duration} minutes</p>
                              </Label>
                            </div>
                          )) || (
                            <div className="text-center py-8">
                              <p className="text-gray-600">No services available</p>
                            </div>
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Booking Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Booking Details</h4>
                
                <FormField
                  control={form.control}
                  name="scheduledAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter the address where you'd like the service" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special requests or notes for the stylist..."
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Confirm Your Booking</h4>
                
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedService?.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-medium">
                      {form.getValues("scheduledAt") ? 
                        new Date(form.getValues("scheduledAt")).toLocaleString() : 
                        "Not selected"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium">{form.getValues("clientAddress")}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-primary">${form.getValues("totalAmount")}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                  Back
                </Button>
              )}
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep} className="flex-1">
                  Continue
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? "Creating Booking..." : "Confirm Booking"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
