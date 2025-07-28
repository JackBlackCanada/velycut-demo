import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Eye, 
  EyeOff, 
  Users, 
  Calendar, 
  MessageSquare, 
  Trophy,
  Settings
} from "lucide-react";
import { isDemoMode, enableDemoMode, disableDemoMode } from "@/lib/demoData";

export default function DemoModeToggle() {
  const [isDemo, setIsDemo] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsDemo(isDemoMode());
    // Show toggle if demo mode is active or if in development
    setIsVisible(isDemoMode() || window.location.hostname === 'localhost');
  }, []);

  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      enableDemoMode();
    } else {
      disableDemoMode();
    }
    setIsDemo(enabled);
    
    // Refresh the page to apply demo mode
    window.location.reload();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2">
          <div className="app-container flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Demo Mode Active</span>
              <Badge variant="secondary" className="text-xs bg-white/20">
                Showcase Data
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggle(false)}
              className="text-white hover:bg-white/20 text-xs"
            >
              Exit Demo
            </Button>
          </div>
        </div>
      )}

      {/* Demo Control Panel (Development only) */}
      {window.location.hostname === 'localhost' && (
        <div className="fixed bottom-4 right-4 z-40">
          <Card className="w-80 shadow-lg border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Demo Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Demo Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isDemo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span className="text-sm font-medium">Demo Mode</span>
                </div>
                <Switch
                  checked={isDemo}
                  onCheckedChange={handleToggle}
                />
              </div>

              {/* Demo Features Overview */}
              {isDemo && (
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="font-medium text-gray-900">Active Demo Features:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>3 Stylists</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>3 Bookings</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>Live Messages</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-3 h-3" />
                      <span>Competition</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-xs text-purple-600 font-medium">
                      Perfect for showcasing all platform features!
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Demo Scenarios */}
              {isDemo && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-900">Demo Scenarios:</div>
                  <div className="space-y-1 text-xs">
                    <div>• Upcoming appointment with Sarah (2 hours)</div>
                    <div>• Marcus en route (15 min ETA)</div>
                    <div>• Recent completed booking to review</div>
                    <div>• Active competition with entries</div>
                    <div>• Unread messages and notifications</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}