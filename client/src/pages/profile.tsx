import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Star, MapPin, Phone, Mail, Calendar, Edit2, Save, X } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get user type from localStorage for demo
  const userType = localStorage.getItem('selectedUserType') || 'client';
  const isClient = userType === 'client';
  
  const [profile, setProfile] = useState({
    firstName: isClient ? 'Sarah' : 'Maria',
    lastName: isClient ? 'Johnson' : 'Rodriguez',
    email: isClient ? 'sarah.johnson@email.com' : 'maria@stylist.com',
    phone: '+1 (555) 123-4567',
    bio: isClient ? 'Busy mom who loves convenient styling services for the whole family.' : 'Professional hair stylist with 8+ years experience. Specializing in cuts, colors, and family styling.',
    location: 'Toronto, ON',
    profileImage: null,
    // Stylist-specific fields
    ...(isClient ? {} : {
      experience: '8 years',
      specializations: ['Haircuts', 'Hair Coloring', 'Family Styling', 'Beard Trimming'],
      hourlyRate: '$45',
      rating: 4.9,
      totalBookings: 342,
      certifications: ['Licensed Cosmetologist', 'Color Specialist'],
      portfolio: []
    })
  });

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, upload to server
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, profileImage: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
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
          <h1 className="text-headline font-bold text-gray-900 dark:text-white">Profile</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="p-2"
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* Profile Header */}
        <div className="ios-card mb-6 mt-6">
          <div className="ios-card-content text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={profile.profileImage || undefined} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {profile.firstName[0]}{profile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full p-2 cursor-pointer hover:bg-purple-600 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            
            <h2 className="text-title-large font-bold text-gray-900 dark:text-white mb-1">
              {profile.firstName} {profile.lastName}
            </h2>
            
            <div className="flex items-center justify-center space-x-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-body text-gray-600 dark:text-gray-300">{profile.location}</span>
            </div>

            {!isClient && (
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{profile.rating}</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">{profile.totalBookings} bookings</span>
              </div>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="ios-card mb-6">
          <div className="ios-card-content">
            <h3 className="text-headline font-bold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-body text-gray-900 dark:text-white">{profile.firstName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-body text-gray-900 dark:text-white">{profile.lastName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <div className="flex items-center mt-1">
                  <Mail className="w-4 h-4 text-gray-500 mr-2" />
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="flex-1"
                    />
                  ) : (
                    <span className="text-body text-gray-900 dark:text-white">{profile.email}</span>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                <div className="flex items-center mt-1">
                  <Phone className="w-4 h-4 text-gray-500 mr-2" />
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="flex-1"
                    />
                  ) : (
                    <span className="text-body text-gray-900 dark:text-white">{profile.phone}</span>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 text-body text-gray-600 dark:text-gray-300">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stylist-specific sections */}
        {!isClient && (
          <>
            {/* Professional Details */}
            <div className="ios-card mb-6">
              <div className="ios-card-content">
                <h3 className="text-headline font-bold text-gray-900 dark:text-white mb-4">
                  Professional Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Experience</Label>
                    <p className="mt-1 text-body text-gray-900 dark:text-white">{profile.experience}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Hourly Rate</Label>
                    <p className="mt-1 text-body text-gray-900 dark:text-white">{profile.hourlyRate}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Specializations</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.specializations?.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Certifications</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.certifications?.map((cert, index) => (
                        <Badge key={index} variant="outline" className="border-green-200 text-green-700">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="ios-card mb-6">
              <div className="ios-card-content">
                <h3 className="text-headline font-bold text-gray-900 dark:text-white mb-4">
                  Statistics
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">{profile.rating}</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{profile.totalBookings}</div>
                    <div className="text-sm text-gray-600">Total Bookings</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3">
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}