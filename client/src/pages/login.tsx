import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useLocation } from "wouter";
// Using a simple text logo for now
const logoPath = null;

export default function Login() {
  const [, navigate] = useLocation();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    referralCode: ''
  });

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    // In production, this would redirect to the OAuth provider
    console.log(`Login with ${provider}`);
    
    // For demo, simulate successful login and redirect based on stored user type
    const userType = localStorage.getItem('selectedUserType');
    setTimeout(() => {
      if (userType === 'client') {
        navigate('/client-dashboard');
      } else {
        navigate('/stylist-dashboard');
      }
    }, 500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo, simulate successful login/signup
    const userType = localStorage.getItem('selectedUserType');
    setTimeout(() => {
      if (userType === 'client') {
        navigate('/client-dashboard');
      } else {
        navigate('/stylist-dashboard');
      }
    }, 500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loginMethod) {
    return (
      <div className="app-container">
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Header */}
          <div className="app-header bg-white">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setLoginMethod(null)}
                className="mr-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-headline">
                {isSignUp ? 'Sign up' : 'Sign in'} with {loginMethod}
              </h1>
            </div>
          </div>

          <div className="flex-1 p-4">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor={loginMethod}>
                  {loginMethod === 'email' ? 'Email' : 'Phone Number'}
                </Label>
                <Input
                  id={loginMethod}
                  type={loginMethod === 'email' ? 'email' : 'tel'}
                  value={loginMethod === 'email' ? formData.email : formData.phone}
                  onChange={(e) => handleInputChange(loginMethod, e.target.value)}
                  placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                  required
                />
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                  <Input
                    id="referralCode"
                    value={formData.referralCode}
                    onChange={(e) => handleInputChange('referralCode', e.target.value)}
                    placeholder="Enter referral code to earn rewards"
                  />
                  <p className="text-caption text-gray-600">
                    Get $10 off your first booking with a referral code!
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full btn-primary mt-6">
                {isSignUp ? 'Create Account' : 'Continue'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-600"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="app-header bg-white">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-xl font-bold text-purple-600">VELY</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center p-4">
          <div className="text-center mb-8">
            <h1 className="text-title-large mb-2">Welcome to VELY</h1>
            <p className="text-body text-gray-600">
              Choose how you'd like to sign in
            </p>
          </div>

          <div className="space-y-4">
            {/* Social Login Buttons */}
            <Button
              onClick={() => handleSocialLogin('google')}
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-3 border-gray-300"
            >
              <FaGoogle className="w-5 h-5 text-red-500" />
              <span>Continue with Google</span>
            </Button>

            <Button
              onClick={() => handleSocialLogin('apple')}
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-3 border-gray-300"
            >
              <FaApple className="w-5 h-5 text-black" />
              <span>Continue with Apple</span>
            </Button>

            <div className="flex items-center my-6">
              <Separator className="flex-1" />
              <span className="px-4 text-caption text-gray-500">or</span>
              <Separator className="flex-1" />
            </div>

            {/* Email/Phone Login Options */}
            <Button
              onClick={() => setLoginMethod('email')}
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-3 border-gray-300"
            >
              <Mail className="w-5 h-5 text-gray-600" />
              <span>Continue with Email</span>
            </Button>

            <Button
              onClick={() => setLoginMethod('phone')}
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-3 border-gray-300"
            >
              <Phone className="w-5 h-5 text-gray-600" />
              <span>Continue with Phone</span>
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-caption text-gray-500 leading-relaxed">
              By continuing, you agree to VELY's{" "}
              <span className="text-purple-600 underline">Terms of Service</span> and{" "}
              <span className="text-purple-600 underline">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}