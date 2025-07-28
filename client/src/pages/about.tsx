import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MapPin, Users, Clock, Shield, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import logoPath from "@assets/logo_1753651837767.png";

export default function About() {
  const [, navigate] = useLocation();

  return (
    <div className="app-container mx-auto bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-headline font-bold text-gray-900 dark:text-white">About VELY</h1>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* Hero Section */}
        <div className="text-center py-8">
          <img src={logoPath} alt="VELY" className="w-20 h-20 mx-auto mb-4 drop-shadow-lg" />
          <h2 className="text-title-large font-bold text-gray-900 dark:text-white mb-2">
            Reimagining Haircuts
          </h2>
          <p className="text-body text-gray-600 dark:text-gray-300">
            Professional styling at your location
          </p>
        </div>

        {/* Founder's Letter */}
        <div className="ios-card mb-8">
          <div className="ios-card-content">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <div>
                <h3 className="text-headline font-bold text-gray-900 dark:text-white">
                  A Letter from Our Founder
                </h3>
                <p className="text-caption text-gray-500 dark:text-gray-400">Jason W, Founder & CEO</p>
              </div>
            </div>
            
            <div className="space-y-4 text-body text-gray-700 dark:text-gray-300">
              <p className="font-medium text-gray-900 dark:text-white">
                VELY was born from a simple insight: getting a haircut shouldn't feel like a chore—it should feel effortless.
              </p>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border-l-4 border-purple-500">
                <p className="italic">
                  "As someone who dreaded salon waits and endless rescheduling, I imagined an app where quality hairstylists come to you. No commute. No compromise. That belief became VELY.
                </p>
                <p className="italic mt-2">
                  Our goal is to deliver premium grooming on your terms: home, office, hotel—anywhere you want. We support stylists to keep more income, set their hours, and grow their own brands. Today we launch in Toronto and LA. Tomorrow? Anywhere you need a haircut."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="ios-card mb-8">
          <div className="ios-card-content">
            <h3 className="text-headline font-bold text-gray-900 dark:text-white mb-4">
              We're Not Just a Booking App—We're a Movement
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Clean, Trusted Professionals</h4>
                  <p className="text-body text-gray-600 dark:text-gray-300">Vetted stylists at your door with hygiene standards</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">User-First Technology</h4>
                  <p className="text-body text-gray-600 dark:text-gray-300">Search, book, pay, track, and rate—all in one app</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Built for Modern Life</h4>
                  <p className="text-body text-gray-600 dark:text-gray-300">Flexible scheduling for both clients and stylists</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="ios-card mb-8">
          <div className="ios-card-content">
            <h3 className="text-headline font-bold text-gray-900 dark:text-white mb-6">
              How VELY Works
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Book with a Few Taps</h4>
                  <p className="text-body text-gray-600 dark:text-gray-300">Find available stylists by ratings, specialties, and location.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Real-Time Tracking</h4>
                  <p className="text-body text-gray-600 dark:text-gray-300">See exactly when your stylist will arrive—just like a ride app.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Rate & Review</h4>
                  <p className="text-body text-gray-600 dark:text-gray-300">Your voice matters. High-quality feedback helps us maintain excellence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why We Exist */}
        <div className="ios-card mb-8">
          <div className="ios-card-content">
            <h3 className="text-headline font-bold text-gray-900 dark:text-white mb-4">
              Why We Exist
            </h3>
            
            <p className="text-body text-gray-700 dark:text-gray-300 mb-6 font-medium">
              Hospitals offer home care. Meals get delivered. Why not haircuts?
            </p>
            
            <p className="text-body text-gray-600 dark:text-gray-300 mb-4">
              VELY empowers busy professionals, parents, and style-savvy people who value:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Time:</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-1">eliminate travel and waiting</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Trust:</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-1">vetted pros, hygiene standards, and reviews</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Empowerment:</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-1">stylists own their schedule and earnings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Launch Cities */}
        <div className="ios-card mb-8">
          <div className="ios-card-content text-center">
            <MapPin className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-headline font-bold text-gray-900 dark:text-white mb-2">
              Now Available
            </h3>
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-lg">🍁</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">Toronto</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-lg">☀️</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">Los Angeles</p>
              </div>
            </div>
            <p className="text-caption text-gray-500 dark:text-gray-400 mt-4">
              More cities coming soon
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Button
            onClick={() => navigate('/')}
            className="btn-primary w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl shadow-lg"
          >
            Experience VELY Today
          </Button>
        </div>
      </div>
    </div>
  );
}