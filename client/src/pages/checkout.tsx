import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Home } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ bookingDetails }: { bookingDetails: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/client-dashboard?payment=success`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment processing.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your booking! Your appointment has been confirmed.",
      });
      navigate('/client-dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement 
            options={{
              layout: "tabs"
            }}
          />
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-indigo-700"
        disabled={!stripe || !elements || isProcessing}
        size="lg"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : (
          `Pay $${bookingDetails?.amount || '0.00'}`
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to be logged in to access checkout.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (user && user.userType !== 'client') {
      navigate('/stylist-dashboard');
      return;
    }
  }, [user, isLoading, isAuthenticated, navigate, toast]);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    // In a real app, this would be based on the booking being processed
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: 45.00 // This would come from the actual booking
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
        
        // Mock booking details - in real app this would come from booking state/props
        setBookingDetails({
          amount: 45.00,
          service: "Haircut & Wash",
          stylist: "Maria Rodriguez",
          date: new Date().toLocaleDateString(),
          time: "2:00 PM"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
        navigate('/client-dashboard');
      }
    };

    if (isAuthenticated && user?.userType === 'client') {
      createPaymentIntent();
    }
  }, [isAuthenticated, user, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!clientSecret || !bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/client-dashboard')}
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Dashboard
              </Button>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
            </div>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{bookingDetails.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stylist:</span>
                  <span className="font-medium">{bookingDetails.stylist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{bookingDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{bookingDetails.time}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee:</span>
                  <span className="font-medium">${bookingDetails.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-medium">$2.99</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">${(bookingDetails.amount + 2.99).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Booking Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <i className="fas fa-clock text-accent mr-2 mt-0.5"></i>
                  <p>Cancellations must be made at least 24 hours in advance for a full refund.</p>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-shield-alt text-accent mr-2 mt-0.5"></i>
                  <p>All stylists are licensed professionals and fully insured.</p>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-heart text-accent mr-2 mt-0.5"></i>
                  <p>Your satisfaction is guaranteed. Contact support if you're not happy with your service.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            {/* Make SURE to wrap the form in <Elements> which provides the stripe context. */}
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm bookingDetails={bookingDetails} />
            </Elements>
            
            {/* Security Notice */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <i className="fas fa-lock text-green-600 mr-2"></i>
                <span className="text-sm text-green-800 font-medium">
                  Your payment information is encrypted and secure
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Powered by Stripe - industry-leading payment security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
