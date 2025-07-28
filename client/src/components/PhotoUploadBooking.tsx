import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Camera, Star } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadBookingProps {
  onBookingSubmit: (bookingData: any) => void;
  stylistId: string;
  selectedServices: any[];
}

export default function PhotoUploadBooking({ onBookingSubmit, stylistId, selectedServices }: PhotoUploadBookingProps) {
  const { toast } = useToast();
  const [inspirationPhotos, setInspirationPhotos] = useState<File[]>([]);
  const [customRequest, setCustomRequest] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [hairType, setHairType] = useState("");
  const [allergies, setAllergies] = useState("");

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + inspirationPhotos.length > 5) {
      toast({ 
        title: "Too many photos", 
        description: "Maximum 5 photos allowed",
        variant: "destructive" 
      });
      return;
    }
    
    // Check file sizes (max 5MB each)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });
    
    setInspirationPhotos(prev => [...prev, ...validFiles]);
  };

  const removePhoto = (index: number) => {
    setInspirationPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const bookingData = {
      stylistId,
      services: selectedServices.map(s => s.id),
      inspirationPhotos: inspirationPhotos.map(photo => ({
        name: photo.name,
        size: photo.size,
        type: photo.type,
        url: URL.createObjectURL(photo) // In production, upload to cloud storage
      })),
      customRequest,
      specialInstructions,
      hairType,
      allergies,
      hasPhotos: inspirationPhotos.length > 0
    };

    onBookingSubmit(bookingData);
  };

  return (
    <div className="app-container">
      <div className="app-content space-y-6">
        {/* Photo Upload Section */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2 text-purple-600" />
              Show Your Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Upload Inspiration Photos (Optional)
              </Label>
              <p className="text-xs text-gray-600 mb-3">
                Share photos of styles you love. Maximum 5 photos, 5MB each.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="photo-upload" className="cursor-pointer flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Tap to upload photos
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        JPEG, PNG up to 5MB each
                      </p>
                    </div>
                  </Label>
                  <Input
                    id="photo-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                {inspirationPhotos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {inspirationPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Inspiration ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <Badge className="absolute bottom-2 left-2 text-xs bg-black/50 text-white">
                          {Math.round(photo.size / 1024)}KB
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Request */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-purple-600" />
              Tell Us More
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Describe Your Desired Look
              </Label>
              <Textarea
                placeholder="Example: I want a layered bob with face-framing highlights, similar to the photos I uploaded..."
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Hair Type & Texture
              </Label>
              <Input
                placeholder="Example: Fine, straight hair / Thick, curly hair"
                value={hairType}
                onChange={(e) => setHairType(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Special Instructions
              </Label>
              <Textarea
                placeholder="Any specific preferences, concerns, or requirements..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Allergies or Sensitivities
              </Label>
              <Input
                placeholder="List any product allergies or scalp sensitivities"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Ready to book?</h3>
                <p className="text-sm text-gray-600">
                  {inspirationPhotos.length > 0 && `${inspirationPhotos.length} photo(s) uploaded`}
                  {customRequest && ", Custom description added"}
                </p>
              </div>
              <Button
                onClick={handleSubmit}
                className="btn-primary"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}