import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Video, 
  MessageCircle, 
  Camera, 
  Mic, 
  MicOff, 
  VideoOff,
  Upload,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VirtualConsultationProps {
  stylistId: string;
  stylist?: any;
  onConsultationComplete?: (results: any) => void;
}

export default function VirtualConsultation({ stylistId, stylist, onConsultationComplete }: VirtualConsultationProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [consultationData, setConsultationData] = useState({
    photos: [] as File[],
    concerns: '',
    goals: '',
    lifestyle: '',
    budget: '',
    timeline: '',
    preferences: [] as string[]
  });

  const consultationSteps = [
    {
      id: 'photos',
      title: 'Hair Analysis Photos',
      description: 'Upload photos for professional hair analysis',
      component: <PhotoUploadStep />
    },
    {
      id: 'questionnaire',
      title: 'Style Questionnaire',
      description: 'Tell us about your hair goals and lifestyle',
      component: <QuestionnaireStep />
    },
    {
      id: 'video-chat',
      title: 'Live Consultation',
      description: 'Connect with your stylist for personalized advice',
      component: <VideoChatStep />
    },
    {
      id: 'recommendations',
      title: 'Professional Recommendations',
      description: 'Receive your personalized hair plan',
      component: <RecommendationsStep />
    }
  ];

  function PhotoUploadStep() {
    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      setConsultationData(prev => ({
        ...prev,
        photos: [...prev.photos, ...files]
      }));
    };

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">📸 Photo Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Front view of your hair (natural lighting)</li>
            <li>• Side profiles (left and right)</li>
            <li>• Back view showing length and texture</li>
            <li>• Close-up of any problem areas</li>
          </ul>
        </div>

        <Label htmlFor="consultation-photos" className="cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-medium mb-2">Upload Hair Photos</h3>
            <p className="text-sm text-gray-600">
              Take 4-6 photos for the most accurate analysis
            </p>
          </div>
        </Label>
        <Input
          id="consultation-photos"
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        {consultationData.photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {consultationData.photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Hair photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Badge className="absolute bottom-2 left-2 bg-green-600">
                  Photo {index + 1}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function QuestionnaireStep() {
    const lifestyleOptions = [
      'Low maintenance', 'Professional', 'Active/Athletic', 
      'Creative/Artistic', 'Social/Outgoing', 'Busy parent'
    ];

    const togglePreference = (pref: string) => {
      setConsultationData(prev => ({
        ...prev,
        preferences: prev.preferences.includes(pref)
          ? prev.preferences.filter(p => p !== pref)
          : [...prev.preferences, pref]
      }));
    };

    return (
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-2 block">
            What are your main hair concerns?
          </Label>
          <Textarea
            placeholder="e.g., Damaged ends, lack of volume, frizz, color fading..."
            value={consultationData.concerns}
            onChange={(e) => setConsultationData(prev => ({ ...prev, concerns: e.target.value }))}
            rows={3}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">
            What are your hair goals?
          </Label>
          <Textarea
            placeholder="e.g., Healthier hair, new color, easier styling routine..."
            value={consultationData.goals}
            onChange={(e) => setConsultationData(prev => ({ ...prev, goals: e.target.value }))}
            rows={3}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">
            Lifestyle & Preferences
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {lifestyleOptions.map(option => (
              <Button
                key={option}
                variant={consultationData.preferences.includes(option) ? "default" : "outline"}
                size="sm"
                onClick={() => togglePreference(option)}
                className="text-xs"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">
            Budget Range
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {['$50-100', '$100-200', '$200+'].map(budget => (
              <Button
                key={budget}
                variant={consultationData.budget === budget ? "default" : "outline"}
                size="sm"
                onClick={() => setConsultationData(prev => ({ ...prev, budget }))}
              >
                {budget}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function VideoChatStep() {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callStatus, setCallStatus] = useState<'waiting' | 'connecting' | 'connected' | 'ended'>('waiting');

    const startVideoCall = () => {
      setCallStatus('connecting');
      setTimeout(() => setCallStatus('connected'), 2000);
    };

    return (
      <div className="space-y-4">
        {callStatus === 'waiting' && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarImage src={stylist?.profileImageUrl} />
                <AvatarFallback>
                  {stylist?.firstName?.[0]}{stylist?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  {stylist?.firstName} {stylist?.lastName}
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {stylist?.rating || 4.9} • Hair Specialist
                </div>
                <Badge className="bg-green-100 text-green-800 mt-1">
                  Available Now
                </Badge>
              </div>
            </div>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <p className="text-sm text-purple-800">
                  <strong>Free 15-minute consultation</strong> to discuss your hair goals 
                  and get professional recommendations before booking.
                </p>
              </CardContent>
            </Card>

            <Button onClick={startVideoCall} className="btn-primary" size="lg">
              <Video className="w-4 h-4 mr-2" />
              Start Video Consultation
            </Button>
          </div>
        )}

        {callStatus === 'connecting' && (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p>Connecting to {stylist?.firstName}...</p>
          </div>
        )}

        {callStatus === 'connected' && (
          <div className="space-y-4">
            {/* Mock video interface */}
            <div className="bg-gray-900 rounded-lg aspect-video relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center">
                <div className="text-white text-center">
                  <Video className="w-12 h-12 mx-auto mb-2" />
                  <p>Video call with {stylist?.firstName}</p>
                </div>
              </div>
              
              {/* Call controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="rounded-full w-12 h-12"
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  variant={isVideoOff ? "destructive" : "secondary"}
                  size="sm"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className="rounded-full w-12 h-12"
                >
                  {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setCallStatus('ended')}
                  className="rounded-full w-12 h-12"
                >
                  ✕
                </Button>
              </div>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-3">
                <p className="text-sm text-green-800">
                  💬 Discussing your hair analysis and personalized recommendations...
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {callStatus === 'ended' && (
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h3 className="font-semibold">Consultation Complete</h3>
            <p className="text-sm text-gray-600">
              Your stylist will now prepare personalized recommendations based on your consultation.
            </p>
          </div>
        )}
      </div>
    );
  }

  function RecommendationsStep() {
    const recommendations = {
      primaryRecommendation: "Layered Bob with Balayage Highlights",
      reasoning: "Based on your hair analysis and lifestyle preferences, this style will complement your face shape while requiring minimal daily styling.",
      services: [
        { name: "Precision Cut & Style", price: 85, duration: "90 min" },
        { name: "Partial Balayage", price: 150, duration: "2.5 hours" },
        { name: "Deep Conditioning Treatment", price: 45, duration: "45 min" }
      ],
      maintenance: "6-8 weeks for cut touch-up, 12-16 weeks for color refresh",
      estimatedTotal: 280
    };

    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
              Your Personalized Hair Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {recommendations.primaryRecommendation}
              </h3>
              <p className="text-gray-700">{recommendations.reasoning}</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Recommended Services:</h4>
              {recommendations.services.map((service, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <span className="font-medium">{service.name}</span>
                    <div className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                  <span className="font-semibold">${service.price}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300 font-bold">
                <span>Total Investment</span>
                <span>${recommendations.estimatedTotal}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3">
              <h5 className="font-medium text-blue-900">Maintenance Schedule</h5>
              <p className="text-sm text-blue-800">{recommendations.maintenance}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button 
            onClick={() => onConsultationComplete?.(recommendations)}
            className="w-full btn-primary"
            size="lg"
          >
            Book This Service Plan
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setCurrentStep(1)}
          >
            Modify Preferences
          </Button>
        </div>
      </div>
    );
  }

  const nextStep = () => {
    if (currentStep < consultationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 0: return consultationData.photos.length >= 3;
      case 1: return consultationData.concerns && consultationData.goals;
      case 2: return true; // Video step is always "complete"
      default: return true;
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <div className="mb-6">
          <h1 className="text-title-large mb-2">Virtual Hair Consultation</h1>
          <div className="flex space-x-1">
            {consultationSteps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index <= currentStep ? 'bg-purple-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="ios-card mb-6">
          <CardHeader>
            <CardTitle>
              {consultationSteps[currentStep].title}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {consultationSteps[currentStep].description}
            </p>
          </CardHeader>
          <CardContent>
            {consultationSteps[currentStep].component}
          </CardContent>
        </Card>

        {currentStep < consultationSteps.length - 1 && (
          <Button
            onClick={nextStep}
            disabled={!isStepComplete()}
            className="w-full btn-primary"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}