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
        
        {/* Ultra-Light Overlay for Maximum Image Visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Floating Navigation Menu - Responsive */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-20">
          <AnimatedNavMenu />
        </div>

        {/* Floating Elements for Visual Interest */}
        <div className="absolute top-1/4 left-8 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse hidden md:block"></div>
        <div className="absolute top-1/3 right-16 w-3 h-3 bg-pink-400/30 rounded-full animate-pulse hidden lg:block" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-12 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-pulse hidden md:block" style={{animationDelay: '2s'}}></div>

        {/* Main Content - Bottom Layout to Show All Family Members */}
        <div className="relative z-10 min-h-screen flex items-end justify-center px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-20">
          {/* Enhanced Content Box - Bottom Center Position */}
          <div className="backdrop-blur-sm bg-gradient-to-t from-black/20 to-black/12 rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/15 shadow-2xl w-full max-w-lg md:max-w-xl lg:max-w-2xl relative overflow-hidden text-center content-shine">
            {/* Subtle accent gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-3xl"></div>
            
            <div className="relative z-10">
              <img src={logoPath} alt="VELY" className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-4 sm:mb-6 mx-auto drop-shadow-lg float-animation" />
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-white drop-shadow-2xl">
                VELY
              </h1>
              
              <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-4 sm:mb-6"></div>
              
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-white/95 leading-tight">
                Professional Styling at Your Location
              </h2>
              
              <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed">
                Professional styling in the comfort of your home. Quality haircuts for the whole family.
              </p>

              {/* Enhanced CTA with Social Proof */}
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowUserTypeModal(true)}
                  className="btn-primary w-full px-8 py-4 text-base sm:text-lg shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 rounded-2xl font-semibold relative overflow-hidden group"
                >
                  <span className="relative z-10">Get Started Today</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </Button>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-white/85">
                  {/* Trust indicators with enhanced styling */}
                  <div className="flex items-center space-x-4 text-xs sm:text-sm">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="font-medium">Licensed Stylists</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <span className="font-medium">Same-Day Service</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                      <span className="font-medium">All Ages Welcome</span>
                    </div>
                  </div>
                  
                  {/* Social proof */}
                  <div className="text-xs sm:text-sm font-medium text-white/70 flex items-center space-x-1">
                    <span>⭐⭐⭐⭐⭐</span>
                    <span>4.9/5 from 500+ families</span>
                  </div>
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
              className="ios-card cursor-pointer active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100 border border-purple-100 hover:border-purple-200 group"
            >
              <div className="ios-card-content text-center py-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                    {/* Animated background sparkle effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative z-10 p-2 bg-white/10 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                      <img 
                        src="/attached_assets/booking icon_1753675188737.png" 
                        alt="Book a Haircut" 
                        className="w-8 h-8 filter brightness-0 invert drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300 group-hover:scale-105"
                      />
                      {/* Subtle glow effect behind icon */}
                      <div className="absolute inset-0 bg-purple-200/30 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    {/* Subtle rotating border effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
                  </div>
                  <h3 className="text-headline mb-2 font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">Book a Haircut</h3>
                  <p className="text-body font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    Starting at <span className="text-purple-600 font-bold">$20</span> • On-demand service
                  </p>
                  <div className="mt-3 text-xs text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full inline-block group-hover:bg-purple-100 transition-colors duration-300">
                    📍 Available in 15+ cities
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => handleUserTypeSelection('stylist')}
              className="ios-card cursor-pointer active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-green-100 border border-green-100 hover:border-green-200 group"
            >
              <div className="ios-card-content text-center py-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                    {/* Animated background sparkle effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative z-10 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                      <img 
                        src="/attached_assets/Join as a Stylist ICON_1753674957768.png" 
                        alt="Register as a Stylist" 
                        className="w-8 h-8 filter brightness-0 invert drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300 group-hover:rotate-3"
                      />
                    </div>
                    {/* Professional badge effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-xs">★</span>
                    </div>
                  </div>
                  <h3 className="text-headline mb-2 font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300">Register as a Stylist</h3>
                  <p className="text-body font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    Earn up to <span className="text-green-600 font-bold">$125/hour</span> • Flexible schedule
                  </p>
                  <div className="mt-3 text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full inline-block group-hover:bg-green-100 transition-colors duration-300">
                    💼 Join 200+ professional stylists
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}