import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const stylistSignupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Phone number is required"),
  bio: z.string().min(10, "Please provide a brief bio"),
  yearsExperience: z.number().min(1, "Experience is required"),
  specializations: z.array(z.string()).min(1, "Select at least one specialization"),
  serviceArea: z.string().min(1, "Service area is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  userType: z.literal("stylist"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms"),
});

type StylistSignupForm = z.infer<typeof stylistSignupSchema>;

interface StylistSignupFormProps {
  open: boolean;
  onClose: () => void;
}

export default function StylistSignupForm({ open, onClose }: StylistSignupFormProps) {
  const { toast } = useToast();
  const [showLogin, setShowLogin] = useState(false);

  const form = useForm<StylistSignupForm>({
    resolver: zodResolver(stylistSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      bio: "",
      yearsExperience: 1,
      specializations: [],
      serviceArea: "",
      licenseNumber: "",
      userType: "stylist",
      agreeToTerms: false,
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: StylistSignupForm) => {
      return await apiRequest("POST", "/api/users/setup-profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Welcome to VELY! You can now start accepting bookings.",
      });
      onClose();
      // Redirect to login since they need to authenticate
      setTimeout(() => {
        window.location.href = '/api/login';
      }, 1000);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: StylistSignupForm) => {
    signupMutation.mutate(data);
  };

  const specializationOptions = [
    "Hair Cutting",
    "Hair Coloring", 
    "Hair Styling",
    "Beard Grooming",
    "Natural Hair",
    "Curly Hair",
    "Extensions",
    "Treatments"
  ];

  const toggleSpecialization = (specialization: string) => {
    const current = form.getValues("specializations");
    const updated = current.includes(specialization)
      ? current.filter(s => s !== specialization)
      : [...current, specialization];
    form.setValue("specializations", updated);
  };

  if (showLogin) {
    window.location.href = '/api/login';
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-2">Join as a Professional</DialogTitle>
          <p className="text-center text-gray-600">Start your VELY stylist journey</p>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell clients about your experience and expertise..." 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="yearsExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1-2 years</SelectItem>
                      <SelectItem value="3">3-5 years</SelectItem>
                      <SelectItem value="6">6-10 years</SelectItem>
                      <SelectItem value="10">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="specializations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specializations</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {specializationOptions.map((spec) => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox
                          id={spec}
                          checked={field.value.includes(spec)}
                          onCheckedChange={() => toggleSpecialization(spec)}
                        />
                        <label htmlFor={spec} className="text-sm font-medium">
                          {spec}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serviceArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Area</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your city/area" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Professional license number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">
                      I certify that I am a licensed professional and agree to VELY's{" "}
                      <a href="#" className="text-secondary hover:underline">Professional Terms</a>
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-secondary hover:bg-pink-600"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Submitting Application..." : "Start Application"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}