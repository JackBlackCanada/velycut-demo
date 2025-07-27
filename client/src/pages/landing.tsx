import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import logoPath from "@assets/logo_1753651837767.png";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    window.location.href = "/";
    return null;
  }

  const handleUserTypeSelection = (userType: string) => {
    // Store user type in localStorage for later use
    localStorage.setItem('selectedUserType', userType);
    setShowUserTypeModal(false);
    
    // Redirect to login page with user type stored
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  return (
    <div className="app-container">
      {/* Hero Section - Matches Your First Mockup */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80')"
          }}
        />
        
        {/* Header */}
        <div className="app-header bg-transparent border-b-0 relative z-10">
          <div className="flex items-center justify-between">
            <img src={logoPath} alt="VELY" className="logo-large" />
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/api/login'}
              className="text-white hover:bg-white/10"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center px-6">
          <img src={logoPath} alt="VELY" className="w-24 h-24 mb-8" />
          
          <h1 className="text-4xl font-bold mb-4">
            VELY
          </h1>
          
          <h2 className="text-2xl font-semibold mb-4">
            The Uber for Haircuts
          </h2>
          
          <p className="text-lg text-gray-300 mb-12 max-w-sm leading-relaxed">
            On-demand haircuts, delivered to your door
          </p>

          <Button 
            onClick={() => setShowUserTypeModal(true)}
            className="btn-primary w-full max-w-xs text-lg"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* User Type Selection Modal */}
      <Dialog open={showUserTypeModal} onOpenChange={setShowUserTypeModal}>
        <DialogContent className="app-container max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-title text-center mb-6">
              Join VELY
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div 
              onClick={() => navigate('/book-service')}
              className="ios-card cursor-pointer active:scale-95 transition-all duration-150"
            >
              <div className="ios-card-content text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✂️</span>
                </div>
                <h3 className="text-headline mb-2">Book a Haircut</h3>
                <p className="text-body">
                  Starting at $28 • On-demand service
                </p>
              </div>
            </div>

            <div 
              onClick={() => handleUserTypeSelection('stylist')}
              className="ios-card cursor-pointer active:scale-95 transition-all duration-150"
            >
              <div className="ios-card-content text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💼</span>
                </div>
                <h3 className="text-headline mb-2">Become a Stylist</h3>
                <p className="text-body">
                  Grow your business with VELY
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}