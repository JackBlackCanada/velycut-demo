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
        
        {/* Enhanced Overlay for Better Visual Appeal */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/15 via-transparent via-transparent to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/5 to-transparent" />
        
        {/* Floating Navigation Menu - Responsive */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-20">
          <AnimatedNavMenu />
        </div>

        {/* Main Content - Enhanced Layout */}
        <div className="relative z-10 flex flex-col items-center justify-end min-h-screen text-center px-4 sm:px-6 md:px-8 pb-16 sm:pb-20 md:pb-24">
          {/* Enhanced Content Box */}
          <div className="backdrop-blur-md bg-gradient-to-b from-black/25 to-black/35 rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/30 shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg relative overflow-hidden">
            {/* Subtle accent gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-3xl"></div>
            
            <div className="relative z-10">
              <img src={logoPath} alt="VELY" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-6 sm:mb-8 mx-auto drop-shadow-lg" />
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-white drop-shadow-2xl">
                VELY
              </h1>
              
              <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-6 sm:mb-8"></div>
              
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-white/95 leading-tight">
                Professional Styling at Your Location
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 leading-relaxed">
                Professional styling in the comfort of your home. Quality haircuts for the whole family.
              </p>

              {/* Enhanced CTA Button */}
              <Button 
                onClick={() => setShowUserTypeModal(true)}
                className="btn-primary w-full text-base sm:text-lg md:text-xl py-4 sm:py-5 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 rounded-2xl font-semibold"
              >
                Get Started Today
              </Button>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center space-x-6 mt-6 sm:mt-8 text-white/80 text-xs sm:text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Licensed Stylists</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Same-Day Service</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>All Ages</span>
                </div>
              </div>
            </div>
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