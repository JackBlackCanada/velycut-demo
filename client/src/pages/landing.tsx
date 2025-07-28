import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import AnimatedNavMenu from "@/components/AnimatedNavMenu";
import logoPath from "@assets/logo_1753651837767.png";
import heroImagePath from "@assets/Business scene indian lady office_1753660854288.png";

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
      {/* Hero Section - Full Screen Professional Focus */}
      <div className="min-h-screen bg-gradient-to-br from-purple-900/95 to-indigo-900/95 text-white relative overflow-hidden">
        {/* Background Image - Full Screen */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-85"
          style={{
            backgroundImage: `url(${heroImagePath})`
          }}
        />
        
        {/* Floating Navigation Menu */}
        <div className="absolute top-6 right-6 z-20">
          <AnimatedNavMenu />
        </div>

        {/* Main Content - Centered */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
          <div className="backdrop-blur-md bg-black/20 rounded-3xl p-10 border border-white/30 shadow-2xl max-w-md">
            <img src={logoPath} alt="VELY" className="w-24 h-24 mb-8 mx-auto" />
            
            <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-xl">
              VELY
            </h1>
            
            <h2 className="text-2xl font-semibold mb-8 text-white/95">
              Professional Styling at Your Location
            </h2>
            
            <p className="text-lg text-white/90 mb-10 leading-relaxed">
              Book expert stylists who come to you. Quality haircuts and styling services wherever you are.
            </p>

            <Button 
              onClick={() => setShowUserTypeModal(true)}
              className="btn-primary w-full text-lg py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Button>
          </div>
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