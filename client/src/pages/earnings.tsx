import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, DollarSign, TrendingUp, Clock, CheckCircle, Calendar, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Earnings() {
  const [, navigate] = useLocation();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('month');

  const { data: earnings, isLoading } = useQuery({
    queryKey: ["/api/stylist/earnings"],
  });

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/stylist-dashboard')}
              className="mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-headline">Earnings</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
          >
            <Home className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="app-content">
        {/* Time Filter */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={timeFilter === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('week')}
          >
            This Week
          </Button>
          <Button
            variant={timeFilter === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('month')}
          >
            This Month
          </Button>
          <Button
            variant={timeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('all')}
          >
            All Time
          </Button>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${(earnings as any)?.totalEarnings?.toFixed(2) || '0.00'}
              </div>
              <div className="text-caption text-gray-600">Total Earnings</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                ${(earnings as any)?.thisMonth?.toFixed(2) || '0.00'}
              </div>
              <div className="text-caption text-gray-600">This Month</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending & Completed Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                ${(earnings as any)?.pendingPayouts?.toFixed(2) || '0.00'}
              </div>
              <div className="text-caption text-gray-600">Pending</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {(earnings as any)?.completedBookings || 0}
              </div>
              <div className="text-caption text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Payout Setup Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Payout Account</h3>
                <p className="text-caption text-gray-600">
                  Set up direct deposit to receive earnings
                </p>
              </div>
              <Button 
                onClick={() => navigate('/stylist-onboarding')}
                variant="outline"
                size="sm"
              >
                Setup
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payouts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Payouts</CardTitle>
            <CardDescription>
              Your latest earnings and transfers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(earnings as any)?.recentPayouts?.map((payout: any) => (
                <div key={payout.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      payout.status === 'completed' 
                        ? 'bg-green-100' 
                        : 'bg-yellow-100'
                    }`}>
                      {payout.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">
                        ${payout.amount.toFixed(2)}
                      </div>
                      <div className="text-caption text-gray-600 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(payout.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant={payout.status === 'completed' ? 'default' : 'secondary'}>
                    {payout.status === 'completed' ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              ))}
              
              {(!(earnings as any)?.recentPayouts || (earnings as any).recentPayouts.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No payouts yet</p>
                  <p className="text-sm">Complete bookings to start earning</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Earnings Breakdown */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Earnings Breakdown</CardTitle>
            <CardDescription>
              How your earnings are calculated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Service Amount</span>
                <span>$100.00</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Platform Fee (15%)</span>
                <span>-$15.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>You Earn</span>
                <span className="text-green-600">$85.00</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700">
                <strong>💡 Tip:</strong> Complete your payout setup to receive earnings 
                directly to your bank account within 2 business days.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}