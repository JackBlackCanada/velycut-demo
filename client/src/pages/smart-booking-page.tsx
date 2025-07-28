import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import SmartBookingWizard from "@/components/SmartBookingWizard";

interface StylistPageProps {
  params: {
    stylistId: string;
  };
}

export default function SmartBookingPage({ params }: StylistPageProps) {
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
              onClick={() => navigate('/search-stylists')}
              className="mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="text-lg font-bold text-purple-600">Smart Booking</div>
          </div>
        </div>
      </div>

      <div className="app-content">
        <SmartBookingWizard stylistId={params.stylistId} />
      </div>
    </div>
  );
}