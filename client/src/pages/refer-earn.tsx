import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Share2, Gift, Users, DollarSign, Award } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
// No need for logo import in this component

export default function ReferEarn() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [referralCode] = useState("VELY2024ABC"); // In production, this would come from user data
  const [referralStats] = useState({
    totalReferred: 12,
    totalEarned: 240,
    pendingRewards: 50,
    completedBookings: 8
  });

  const userType = localStorage.getItem('selectedUserType') || 'client';
  const isClient = userType === 'client';

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareReferral = async () => {
    const shareText = `Join me on VELY and get $10 off your first haircut! Use my referral code: ${referralCode}`;
    const shareUrl = `https://vely.app?ref=${referralCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VELY - On-Demand Hair Services',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing: ', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyReferralCode();
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(isClient ? '/client-dashboard' : '/stylist-dashboard')}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-headline">Refer & Earn</h1>
        </div>
      </div>

      <div className="app-content">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-title-large mb-2">
            {isClient ? 'Earn $10 for Every Friend' : 'Grow Your Business'}
          </h1>
          <p className="text-body text-gray-600">
            {isClient 
              ? 'Share VELY with friends and both of you get $10 off your next booking!'
              : 'Refer new stylists and earn 5% commission on their first month earnings!'
            }
          </p>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{referralStats.totalReferred}</div>
              <div className="text-caption text-gray-600">Friends Referred</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">${referralStats.totalEarned}</div>
              <div className="text-caption text-gray-600">Total Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Code Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Your Referral Code</CardTitle>
            <CardDescription>
              Share this code with friends to start earning rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Input 
                value={referralCode} 
                readOnly 
                className="flex-1 font-mono text-center text-lg font-bold"
              />
              <Button onClick={copyReferralCode} variant="outline" size="icon">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            <Button onClick={shareReferral} className="w-full btn-primary">
              <Share2 className="w-4 h-4 mr-2" />
              Share with Friends
            </Button>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Share Your Code</h3>
                  <p className="text-caption text-gray-600">
                    Send your referral code to friends via text, email, or social media
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Friend Signs Up</h3>
                  <p className="text-caption text-gray-600">
                    {isClient 
                      ? 'Your friend downloads VELY and enters your code during signup'
                      : 'New stylists join VELY using your referral code'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Both Get Rewards</h3>
                  <p className="text-caption text-gray-600">
                    {isClient 
                      ? 'You both get $10 off your next booking once they complete their first service'
                      : 'Earn 5% of their earnings for their first month on the platform'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Jessica M.</p>
                    <p className="text-caption text-gray-600">Completed first booking</p>
                  </div>
                </div>
                <span className="text-green-600 font-semibold">+$10</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Mike R.</p>
                    <p className="text-caption text-gray-600">Signed up today</p>
                  </div>
                </div>
                <span className="text-yellow-600 font-semibold">Pending</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah L.</p>
                    <p className="text-caption text-gray-600">Completed first booking</p>
                  </div>
                </div>
                <span className="text-green-600 font-semibold">+$10</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}