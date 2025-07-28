import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import AIStyleRecommendations from "@/components/AIStyleRecommendations";

export default function AIStyleRecommendationsPage() {
  const [, navigate] = useLocation();

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/client-dashboard')}
              className="mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="text-lg font-bold text-purple-600">AI Style Recommendations</div>
          </div>
        </div>
      </div>

      <div className="app-content">
        <AIStyleRecommendations userId="demo_client" />
      </div>
    </div>
  );
}