import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, Phone, MessageCircle, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import logoPath from "@assets/logo_1753651837767.png";

export default function Contact() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    // Reset form after showing success
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '', category: 'general' });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
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
            <h1 className="text-headline font-bold text-gray-900 dark:text-white">Contact Us</h1>
            <div className="w-9"></div>
          </div>
        </div>

        {/* Success State */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-title-large font-bold text-gray-900 dark:text-white mb-2">
              Message Sent Successfully!
            </h2>
            <p className="text-body text-gray-600 dark:text-gray-300 mb-6">
              Thank you for contacting VELY. We'll get back to you within 24 hours.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-headline font-bold text-gray-900 dark:text-white">Contact Us</h1>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* Header Section */}
        <div className="text-center py-6">
          <img src={logoPath} alt="VELY" className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
          <h2 className="text-title-large font-bold text-gray-900 dark:text-white mb-2">
            Get in Touch
          </h2>
          <p className="text-body text-gray-600 dark:text-gray-300">
            We're here to help with any questions or concerns
          </p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="ios-card">
            <div className="ios-card-content">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Email Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">support@vely.app</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ios-card">
            <div className="ios-card-content">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Phone Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">+1 (555) VELY-APP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ios-card">
            <div className="ios-card-content">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Live Chat</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Available 9 AM - 9 PM EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Office Locations */}
        <div className="ios-card mb-8">
          <div className="ios-card-content">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-purple-500 mr-3" />
              <h3 className="text-headline font-bold text-gray-900 dark:text-white">
                Our Locations
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <span className="text-2xl leading-none">🇨🇦</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Toronto, ON</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">123 Queen Street West, Suite 456</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Toronto, ON M5H 2M9</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <span className="text-2xl leading-none">🇺🇸</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Los Angeles, CA</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">456 Sunset Boulevard, Floor 3</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Los Angeles, CA 90028</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="ios-card mb-8">
          <div className="ios-card-content">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-blue-500 mr-3" />
              <h3 className="text-headline font-bold text-gray-900 dark:text-white">
                Support Hours
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-body text-gray-600 dark:text-gray-300">Monday - Friday</span>
                <span className="text-body font-medium text-gray-900 dark:text-white">9:00 AM - 9:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body text-gray-600 dark:text-gray-300">Saturday</span>
                <span className="text-body font-medium text-gray-900 dark:text-white">10:00 AM - 6:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body text-gray-600 dark:text-gray-300">Sunday</span>
                <span className="text-body font-medium text-gray-900 dark:text-white">12:00 PM - 5:00 PM EST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="ios-card mb-8">
          <div className="ios-card-content">
            <h3 className="text-headline font-bold text-gray-900 dark:text-white mb-4">
              Send us a Message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="mt-1"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="stylist">Stylist Application</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Brief description of your inquiry"
                />
              </div>
              
              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  required
                  className="mt-1"
                  rows={4}
                  placeholder="Please provide details about your inquiry..."
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="text-center">
          <p className="text-body text-gray-600 dark:text-gray-300 mb-2">
            Looking for quick answers?
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/about')}
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            Check our FAQ
          </Button>
        </div>
      </div>
    </div>
  );
}