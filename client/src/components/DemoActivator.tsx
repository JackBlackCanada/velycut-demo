import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Users, 
  Calendar, 
  MessageSquare, 
  Trophy,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { enableDemoMode } from "@/lib/demoData";

export default function DemoActivator() {
  const [isActivating, setIsActivating] = useState(false);

  const handleActivateDemo = () => {
    setIsActivating(true);
    enableDemoMode();
    
    // Add demo=true to URL for immediate activation
    const url = new URL(window.location.href);
    url.searchParams.set('demo', 'true');
    window.location.href = url.toString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-purple-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Activate Demo Mode
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Experience VELY with realistic data and active scenarios
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Demo Features */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900">Included Demo Features:</div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-sm">
                <Users className="w-4 h-4 text-purple-600" />
                <span>3 Verified Stylists</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Active Bookings</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span>Live Messages</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span>Competition</span>
              </div>
            </div>
          </div>

          {/* Demo Scenarios */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900">Live Demo Scenarios:</div>
            
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                <span>Appointment with Sarah in 2 hours</span>
                <Badge variant="secondary" className="text-xs">Confirmed</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span>Marcus en route (15 min ETA)</span>
                <Badge className="text-xs bg-blue-600">En Route</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span>Recent booking to review</span>
                <Badge variant="outline" className="text-xs">Complete</Badge>
              </div>
            </div>
          </div>

          {/* Add-On Services Highlight */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg border border-purple-200">
            <div className="text-sm font-medium text-purple-900 mb-1">
              ✨ Includes New Add-On Services System
            </div>
            <div className="text-xs text-purple-700">
              See upselling workflow with 15+ premium services, smart pricing, and multi-service discounts
            </div>
          </div>

          {/* Activation Button */}
          <Button
            onClick={handleActivateDemo}
            disabled={isActivating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            size="lg"
          >
            {isActivating ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Activating Demo...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Activate Demo Mode</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>

          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
              Continue without demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}