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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const clientSignupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  userType: z.literal("client"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms"),
});

type ClientSignupForm = z.infer<typeof clientSignupSchema>;

interface ClientSignupFormProps {
  open: boolean;
  onClose: () => void;
}

export default function ClientSignupForm({ open, onClose }: ClientSignupFormProps) {
  const { toast } = useToast();
  const [showLogin, setShowLogin] = useState(false);

  const form = useForm<ClientSignupForm>({
    resolver: zodResolver(clientSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      userType: "client",
      agreeToTerms: false,
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: ClientSignupForm) => {
      return await apiRequest("POST", "/api/users/setup-profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Account Created!",
        description: "Welcome to VELY! You can now start booking services.",
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
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ClientSignupForm) => {
    signupMutation.mutate(data);
  };

  if (showLogin) {
    // Redirect to login
    window.location.href = '/api/login';
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-2">Create Your Account</DialogTitle>
          <p className="text-center text-gray-600">Start booking professional hair services</p>
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
                      <Input placeholder="Enter your first name" {...field} />
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
                      <Input placeholder="Enter your last name" {...field} />
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
            
            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Button type="button" variant="link" onClick={() => setShowLogin(true)}>
                Sign In
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}