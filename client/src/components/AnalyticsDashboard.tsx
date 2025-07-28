import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  Star, 
  Clock,
  Target,
  Award,
  ChevronUp,
  ChevronDown
} from "lucide-react";

interface AnalyticsData {
  totalEarnings: number;
  monthlyEarnings: number;
  totalBookings: number;
  completedBookings: number;
  avgRating: number;
  totalReviews: number;
  responseTime: string;
  repeatClients: number;
  earningsGrowth: number;
  bookingsGrowth: number;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  userType: 'client' | 'stylist';
}

export default function AnalyticsDashboard({ data, userType }: AnalyticsDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', { 
      style: 'currency', 
      currency: 'CAD' 
    }).format(amount);
  };

  const getGrowthIndicator = (growth: number) => {
    if (growth > 0) {
      return (
        <span className="flex items-center text-green-600 text-sm">
          <ChevronUp className="w-4 h-4 mr-1" />
          +{growth.toFixed(1)}%
        </span>
      );
    } else if (growth < 0) {
      return (
        <span className="flex items-center text-red-600 text-sm">
          <ChevronDown className="w-4 h-4 mr-1" />
          {growth.toFixed(1)}%
        </span>
      );
    }
    return <span className="text-gray-500 text-sm">0%</span>;
  };

  if (userType === 'stylist') {
    return (
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="ios-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600">Total Earnings</p>
                  <p className="text-title-large font-bold text-gray-900">
                    {formatCurrency(data.totalEarnings)}
                  </p>
                  {getGrowthIndicator(data.earningsGrowth)}
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ios-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600">This Month</p>
                  <p className="text-title-large font-bold text-gray-900">
                    {formatCurrency(data.monthlyEarnings)}
                  </p>
                  {getGrowthIndicator(data.bookingsGrowth)}
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="ios-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-caption text-gray-600">Bookings</p>
                  <p className="text-headline font-bold">{data.completedBookings}/{data.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ios-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-caption text-gray-600">Rating</p>
                  <p className="text-headline font-bold">{data.avgRating.toFixed(1)}★</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ios-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-caption text-gray-600">Response Time</p>
                  <p className="text-headline font-bold">{data.responseTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ios-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-caption text-gray-600">Repeat Clients</p>
                  <p className="text-headline font-bold">{data.repeatClients}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Goals */}
        <Card className="ios-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-headline flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Performance Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Monthly Earnings Goal */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body">Monthly Earnings</span>
                  <span className="text-caption">{formatCurrency(data.monthlyEarnings)} / {formatCurrency(2500)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((data.monthlyEarnings / 2500) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Rating Goal */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body">Average Rating</span>
                  <span className="text-caption">{data.avgRating.toFixed(1)}★ / 4.8★</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((data.avgRating / 4.8) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Bookings Goal */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body">Monthly Bookings</span>
                  <span className="text-caption">{data.completedBookings} / 25</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((data.completedBookings / 25) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="ios-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-headline flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Star className="w-3 h-3 mr-1" />
                  5-Star Pro
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Clock className="w-3 h-3 mr-1" />
                  Quick Responder
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  <Users className="w-3 h-3 mr-1" />
                  Client Favorite
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Calendar className="w-3 h-3 mr-1" />
                  Reliable
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Client Analytics
  return (
    <div className="space-y-6">
      {/* Spending Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-gray-600">Total Spent</p>
                <p className="text-title-large font-bold text-gray-900">
                  {formatCurrency(data.totalEarnings)}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-gray-600">Appointments</p>
                <p className="text-title-large font-bold text-gray-900">
                  {data.totalBookings}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-caption text-gray-600">Avg Rating Given</p>
                <p className="text-headline font-bold">{data.avgRating.toFixed(1)}★</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-caption text-gray-600">Favorite Stylists</p>
                <p className="text-headline font-bold">{data.repeatClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings & Rewards */}
      <Card className="ios-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-headline flex items-center">
            <Award className="w-5 h-5 mr-2 text-purple-600" />
            Rewards & Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-body">Total Saved</span>
              <span className="text-headline font-bold text-green-600">
                {formatCurrency(87.50)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body">Loyalty Points</span>
              <span className="text-headline font-bold text-purple-600">1,240 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body">Referral Rewards</span>
              <span className="text-headline font-bold text-blue-600">{formatCurrency(25.00)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}