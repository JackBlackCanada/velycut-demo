import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import AnimatedNavMenu from "@/components/AnimatedNavMenu";
import logoPath from "@assets/logo_1753651837767.png";
import heroImagePath from "@assets/Asian famliy_1753662896690.png";

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
      <div className="min-h-screen text-white relative overflow-hidden">
        {/* Background Image - Full Screen with Better Visibility */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImagePath})`
          }}
        />
        
        {/* Warm Overlay to Complement Family Image */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-black/60" />
        
        {/* Floating Navigation Menu - Responsive */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-20">
          <AnimatedNavMenu />
        </div>

        {/* Main Content - Positioned to Show More Image */}
        <div className="relative z-10 flex flex-col items-center justify-end min-h-screen text-center px-4 sm:px-6 md:px-8 pb-20 sm:pb-24 md:pb-32">
          <div className="backdrop-blur-sm bg-black/20 rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/25 shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg">
            <img src={logoPath} alt="VELY" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-6 sm:mb-8 mx-auto" />
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white drop-shadow-xl">
              VELY
            </h1>
            
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 text-white/95">
              Professional Styling at Your Location
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 leading-relaxed">
              Professional styling in the comfort of your home. Quality haircuts for the whole family.
            </p>

            <Button 
              onClick={() => setShowUserTypeModal(true)}
              className="btn-primary w-full text-base sm:text-lg md:text-xl py-3 sm:py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
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