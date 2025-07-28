import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import logoPath from "@assets/logo_1753651837767.png";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="app-container mx-auto bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          {/* Logo */}
          <img src={logoPath} alt="VELY" className="w-20 h-20 mx-auto mb-6 opacity-50" />
          
          {/* Error Icon */}
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          
          {/* Error Message */}
          <h1 className="text-title-large font-bold text-gray-900 dark:text-white mb-2">
            Page Not Found
          </h1>
          <p className="text-body text-gray-600 dark:text-gray-300 mb-8 max-w-sm mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
            
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          {/* Help Text */}
          <p className="text-caption text-gray-500 dark:text-gray-400 mt-8">
            Need help? <Button variant="link" onClick={() => navigate('/contact')} className="p-0 h-auto text-purple-600">Contact support</Button>
          </p>
        </div>
      </div>
    </div>
  );
}
