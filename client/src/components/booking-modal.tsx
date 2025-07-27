import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin } from "lucide-react";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  stylist?: any;
}

export default function BookingModal({ open, onClose, stylist }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');

  const handleBooking = () => {
    // TODO: Implement booking logic
    console.log('Booking:', { stylist, selectedDate, selectedTime, address });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="app-container max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-title text-center mb-6">
            Book Appointment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {stylist && (
            <div className="text-center">
              <h3 className="text-headline mb-1">
                {stylist.firstName} {stylist.lastName}
              </h3>
              <p className="text-body text-gray-600">
                {stylist.bio || 'Professional Stylist'}
              </p>
            </div>
          )}

          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Select Date
            </Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="ios-input"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Select Time
            </Label>
            <Input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="ios-input"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Your Address
            </Label>
            <Input
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="ios-input"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBooking}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={!selectedDate || !selectedTime || !address}
            >
              Book Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}