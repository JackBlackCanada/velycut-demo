import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Clock, AlertCircle, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function StylistOnboarding() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: onboardingStatus, isLoading } = useQuery({
    queryKey: ["/api/stylist/stripe-status"],
  });

  const createAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/stylist/create-stripe-account");
      return response;
    },
    onSuccess: (data) => {
      if (data.accountLinkUrl) {
        window.location.href = data.accountLinkUrl;
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create Stripe account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const refreshStatusMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/stylist/refresh-stripe-status");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stylist/stripe-status"] });
      toast({
        title: "Status Updated",
        description: "Your account status has been refreshed.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (onboardingStatus?.status) {
      case 'active':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'pending':
        return <Clock className="w-12 h-12 text-yellow-600" />;
      case 'restricted':
        return <AlertCircle className="w-12 h-12 text-red-600" />;
      default:
        return <Clock className="w-12 h-12 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (onboardingStatus?.status) {
      case 'active':
        return {
          title: "Account Active!",
          description: "Your payout account is set up and ready to receive payments.",
          action: null
        };
      case 'pending':
        return {
          title: "Setup In Progress",
          description: "Complete your account setup to start receiving payments directly to your bank account.",
          action: onboardingStatus.accountLinkUrl ? "Continue Setup" : "Refresh Status"
        };
      case 'restricted':
        return {
          title: "Action Required",
          description: "Your account needs additional information. Please complete the required steps.",
          action: "Complete Requirements"
        };
      default:
        return {
          title: "Get Paid Directly",
          description: "Set up your payout account to receive payments from bookings automatically.",
          action: "Start Setup"
        };
    }
  };

  const status = getStatusMessage();

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/stylist-dashboard')}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-headline">Payout Setup</h1>
        </div>
      </div>

      <div className="app-content">
        {/* Status Card */}
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <h2 className="text-xl font-semibold mb-2">{status.title}</h2>
            <p className="text-gray-600 mb-6">{status.description}</p>
            
            {status.action && (
              <Button
                onClick={() => {
                  if (onboardingStatus?.accountLinkUrl) {
                    window.location.href = onboardingStatus.accountLinkUrl;
                  } else if (onboardingStatus?.status === 'pending') {
                    refreshStatusMutation.mutate();
                  } else {
                    createAccountMutation.mutate();
                  }
                }}
                disabled={createAccountMutation.isPending || refreshStatusMutation.isPending}
                className="btn-primary"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {status.action}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">How Payouts Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Complete Service</h3>
                  <p className="text-caption text-gray-600">
                    After completing a booking, payment is automatically processed
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Platform Fee Deducted</h3>
                  <p className="text-caption text-gray-600">
                    VELY takes a 15% platform fee. You keep 85% of the booking amount
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Direct Deposit</h3>
                  <p className="text-caption text-gray-600">
                    Your earnings are transferred to your bank account within 2 business days
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        {onboardingStatus?.status === 'active' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className="font-semibold text-green-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payout Schedule</span>
                  <span className="font-semibold">Every 2 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-semibold">15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">You Keep</span>
                  <span className="font-semibold text-green-600">85%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Requirements */}
        {onboardingStatus?.status !== 'active' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requirements</CardTitle>
              <CardDescription>
                You'll need to provide the following information:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm">Personal identification (Driver's License or Passport)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm">Social Security Number</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm">Bank account information</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm">Business address</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}