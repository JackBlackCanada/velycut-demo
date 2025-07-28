import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Bell, MapPin, CreditCard, Shield, Moon, Sun, Smartphone, Mail, MessageSquare, LogOut, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get user type from localStorage for demo
  const userType = localStorage.getItem('selectedUserType') || 'client';
  const isClient = userType === 'client';
  
  const [settings, setSettings] = useState({
    // Notification settings
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    bookingReminders: true,
    promotionalEmails: false,
    
    // Privacy settings
    locationSharing: true,
    profileVisibility: true,
    showRatings: true,
    
    // App preferences
    darkMode: false,
    language: 'English',
    currency: 'CAD',
    
    // Stylist-specific settings
    ...(isClient ? {} : {
      availabilityNotifications: true,
      autoAcceptBookings: false,
      instantBooking: true,
      weekendAvailability: true,
    })
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('selectedUserType');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setTimeout(() => navigate('/'), 500);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast({
        title: "Account Deletion",
        description: "Your account deletion request has been submitted.",
        variant: "destructive",
      });
      setTimeout(() => navigate('/'), 1000);
    }
  };

  return (
    <div className="app-container mx-auto bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(isClient ? '/client-dashboard' : '/stylist-dashboard')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-headline font-bold text-gray-900 dark:text-white">Settings</h1>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* Notifications */}
        <div className="ios-card mb-6 mt-6">
          <div className="ios-card-content">
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-purple-500 mr-3" />
              <h3 className="text-headline font-bold text-gray-900 dark:text-white">
                Notifications
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-body font-medium text-gray-900 dark:text-white">Push Notifications</Label>
                  <p className="text-caption text-gray-600 dark:text-gray-300">Receive notifications on your device</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(value) => handleSettingChange('pushNotifications', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-body font-medium text-gray-900 dark:text-white">Email Notifications</Label>
                  <p className="text-caption text-gray-600 dark:text-gray-300">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-body font-medium text-gray-900 dark:text-white">SMS Notifications</Label>
                  <p className="text-caption text-gray-600 dark:text-gray-300">Receive text message updates</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(value) => handleSettingChange('smsNotifications', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-body font-medium text-gray-900 dark:text-white">Booking Reminders</Label>
                  <p className="text-caption text-gray-600 dark:text-gray-300">Get reminded about upcoming appointments</p>
                </div>
                <Switch
                  checked={settings.bookingReminders}
                  onCheckedChange={(value) => handleSettingChange('bookingReminders', value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="ios-card mb-6">
          <div className="ios-card-content">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-green-500 mr-3" />
              <h3 className="text-headline font-bold text-gray-900 dark:text-white">
                Privacy & Security
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-body font-medium text-gray-900 dark:text-white">Location Sharing</Label>
                  <p className="text-caption text-gray-600 dark:text-gray-300">Share location for better service matching</p>
                </div>
                <Switch
                  checked={settings.locationSharing}
                  onCheckedChange={(value) => handleSettingChange('locationSharing', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-body font-medium text-gray-900 dark:text-white">Profile Visibility</Label>
                  <p className="text-caption text-gray-600 dark:text-gray-300">Make your profile visible to others</p>
                </div>
                <Switch
                  checked={settings.profileVisibility}
                  onCheckedChange={(value) => handleSettingChange('profileVisibility', value)}
                />
              </div>
              
              {!isClient && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-body font-medium text-gray-900 dark:text-white">Show Ratings</Label>
                      <p className="text-caption text-gray-600 dark:text-gray-300">Display your ratings publicly</p>
                    </div>
                    <Switch
                      checked={settings.showRatings}
                      onCheckedChange={(value) => handleSettingChange('showRatings', value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stylist-specific settings */}
        {!isClient && (
          <div className="ios-card mb-6">
            <div className="ios-card-content">
              <div className="flex items-center mb-4">
                <MessageSquare className="w-5 h-5 text-blue-500 mr-3" />
                <h3 className="text-headline font-bold text-gray-900 dark:text-white">
                  Business Settings
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-body font-medium text-gray-900 dark:text-white">Availability Notifications</Label>
                    <p className="text-caption text-gray-600 dark:text-gray-300">Get notified about booking requests</p>
                  </div>
                  <Switch
                    checked={settings.availabilityNotifications}
                    onCheckedChange={(value) => handleSettingChange('availabilityNotifications', value)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-body font-medium text-gray-900 dark:text-white">Instant Booking</Label>
                    <p className="text-caption text-gray-600 dark:text-gray-300">Allow clients to book without approval</p>
                  </div>
                  <Switch
                    checked={settings.instantBooking}
                    onCheckedChange={(value) => handleSettingChange('instantBooking', value)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-body font-medium text-gray-900 dark:text-white">Weekend Availability</Label>
                    <p className="text-caption text-gray-600 dark:text-gray-300">Accept bookings on weekends</p>
                  </div>
                  <Switch
                    checked={settings.weekendAvailability}
                    onCheckedChange={(value) => handleSettingChange('weekendAvailability', value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* App Preferences */}
        <div className="ios-card mb-6">
          <div className="ios-card-content">
            <div className="flex items-center mb-4">
              <Smartphone className="w-5 h-5 text-gray-500 mr-3" />
              <h3 className="text-headline font-bold text-gray-900 dark:text-white">
                App Preferences
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-body font-medium text-gray-900 dark:text-white">Dark Mode</Label>
                  <p className="text-caption text-gray-600 dark:text-gray-300">Use dark theme for the app</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(value) => handleSettingChange('darkMode', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-body font-medium text-gray-900 dark:text-white">Language</Label>
                  <p className="text-caption text-gray-600 dark:text-gray-300">Choose your preferred language</p>
                </div>
                <span className="text-body text-gray-600">{settings.language}</span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-body font-medium text-gray-900 dark:text-white">Currency</Label>
                  <p className="text-caption text-gray-600 dark:text-gray-300">Display prices in your currency</p>
                </div>
                <span className="text-body text-gray-600">{settings.currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="ios-card mb-6">
          <div className="ios-card-content">
            <h3 className="text-headline font-bold text-gray-900 dark:text-white mb-4">
              Account Management
            </h3>
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/profile')}
                variant="outline"
                className="w-full justify-start"
              >
                <Shield className="w-4 h-4 mr-3" />
                Edit Profile
              </Button>
              
              <Button
                onClick={() => navigate('/refer-earn')}
                variant="outline"
                className="w-full justify-start"
              >
                <CreditCard className="w-4 h-4 mr-3" />
                Payment Methods
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Log Out
              </Button>
              
              <Button
                onClick={handleDeleteAccount}
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-3" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center text-caption text-gray-500 dark:text-gray-400 mt-8">
          VELY Version 1.0.0
        </div>
      </div>
    </div>
  );
}