import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Clock, Shield, Smartphone, Scissors, MapPin, Menu, X } from "lucide-react";
import UserTypeModal from "@/components/user-type-modal";
import ClientSignupForm from "@/components/client-signup-form";
import StylistSignupForm from "@/components/stylist-signup-form";

export default function Landing() {
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [showClientSignup, setShowClientSignup] = useState(false);
  const [showStylistSignup, setShowStylistSignup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">VELY</h1>
              <span className="ml-2 text-sm text-gray-500 hidden sm:inline">
                Professional Hair at Home
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#for-stylists" className="text-gray-600 hover:text-primary transition-colors">
                For Stylists
              </a>
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/api/login'}
              >
                Sign In
              </Button>
              <Button onClick={() => setShowUserTypeModal(true)}>
                Get Started
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="px-4 space-y-4">
              <a href="#how-it-works" className="block text-gray-600 hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#for-stylists" className="block text-gray-600 hover:text-primary transition-colors">
                For Stylists
              </a>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/api/login'}
              >
                Sign In
              </Button>
              <Button 
                className="w-full" 
                onClick={() => setShowUserTypeModal(true)}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Professional Hair Services{" "}
                <span className="text-pink-200">at Your Home</span>
              </h1>
              <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                Book certified stylists and barbers who come to you. Same-day availability, 
                transparent pricing, and quality guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-50 min-h-[56px]"
                  onClick={() => setShowUserTypeModal(true)}
                >
                  Book a Stylist
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary min-h-[56px]"
                  onClick={() => setShowStylistSignup(true)}
                >
                  Become a Stylist
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Professional stylist working on client's hair at home"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose VELY?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the convenience of professional hair services in the comfort of your home
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-home text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">At-Home Convenience</h3>
              <p className="text-gray-600">
                No more salon visits. Professional stylists come to your home at your preferred time.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-certificate text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Certified Professionals</h3>
              <p className="text-gray-600">
                All stylists are licensed, insured, and background-checked for your safety and peace of mind.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-clock text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Book same-day or schedule weeks ahead. Evening and weekend availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <UserTypeModal 
        open={showUserTypeModal}
        onClose={() => setShowUserTypeModal(false)}
        onClientSelect={() => {
          setShowUserTypeModal(false);
          setShowClientSignup(true);
        }}
        onStylistSelect={() => {
          setShowUserTypeModal(false);
          setShowStylistSignup(true);
        }}
      />

      <ClientSignupForm 
        open={showClientSignup}
        onClose={() => setShowClientSignup(false)}
      />

      <StylistSignupForm 
        open={showStylistSignup}
        onClose={() => setShowStylistSignup(false)}
      />
    </div>
  );
}
