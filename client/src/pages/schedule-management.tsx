import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { Calendar, Clock, Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { format } from "date-fns";

type AvailabilitySlot = {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

type TimeOff = {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  createdAt: string;
};

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default function ScheduleManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  const [weeklySchedule, setWeeklySchedule] = useState<AvailabilitySlot[]>([]);
  const [isTimeOffDialogOpen, setIsTimeOffDialogOpen] = useState(false);
  const [timeOffForm, setTimeOffForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ["/api/stylist/schedule"],
    enabled: !!user && user.userType === 'stylist',
  });

  const saveScheduleMutation = useMutation({
    mutationFn: async (availability: AvailabilitySlot[]) => {
      await apiRequest("POST", "/api/stylist/schedule", { availability });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stylist/schedule"] });
      toast({ title: "Schedule updated successfully!" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to update schedule",
        variant: "destructive"
      });
    }
  });

  const addTimeOffMutation = useMutation({
    mutationFn: async (timeOffData: any) => {
      await apiRequest("POST", "/api/stylist/time-off", timeOffData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stylist/schedule"] });
      setIsTimeOffDialogOpen(false);
      setTimeOffForm({ startDate: '', endDate: '', reason: '' });
      toast({ title: "Time off added successfully!" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to add time off",
        variant: "destructive"
      });
    }
  });

  const deleteTimeOffMutation = useMutation({
    mutationFn: async (timeOffId: string) => {
      await apiRequest("DELETE", `/api/stylist/time-off/${timeOffId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stylist/schedule"] });
      toast({ title: "Time off removed successfully!" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to remove time off",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (scheduleData?.availability) {
      setWeeklySchedule(scheduleData.availability);
    } else {
      // Initialize with default empty schedule
      const defaultSchedule: AvailabilitySlot[] = [];
      for (let day = 0; day < 7; day++) {
        defaultSchedule.push({
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          isActive: day >= 1 && day <= 5 // Monday to Friday by default
        });
      }
      setWeeklySchedule(defaultSchedule);
    }
  }, [scheduleData]);

  const updateDaySchedule = (dayIndex: number, field: keyof AvailabilitySlot, value: any) => {
    setWeeklySchedule(prev => 
      prev.map((slot, index) => 
        index === dayIndex ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleSaveSchedule = () => {
    const activeSlots = weeklySchedule.filter(slot => slot.isActive);
    saveScheduleMutation.mutate(activeSlots);
  };

  const handleAddTimeOff = () => {
    if (!timeOffForm.startDate || !timeOffForm.endDate) {
      toast({ 
        title: "Error", 
        description: "Please select start and end dates",
        variant: "destructive"
      });
      return;
    }

    addTimeOffMutation.mutate({
      startDate: new Date(timeOffForm.startDate).toISOString(),
      endDate: new Date(timeOffForm.endDate).toISOString(),
      reason: timeOffForm.reason || 'Personal'
    });
  };

  if (!user || user.userType !== 'stylist') {
    return (
      <div className="app-container">
        <div className="min-h-screen flex items-center justify-center">
          <Card className="ios-card p-6 text-center">
            <h2 className="text-title-large mb-2">Access Denied</h2>
            <p className="text-body text-gray-600 mb-4">Only stylists can access schedule management.</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </Card>
        </div>
      </div>
    );
  }

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
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-title-large">Schedule Management</h1>
          </div>
          <Button 
            onClick={handleSaveSchedule}
            disabled={saveScheduleMutation.isPending}
            className="btn-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveScheduleMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="app-content space-y-6">
        {/* Weekly Schedule */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="text-headline flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="ios-card-content space-y-4">
            {weeklySchedule.map((slot, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={slot.isActive}
                    onChange={(e) => updateDaySchedule(index, 'isActive', e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-body font-medium w-20">
                    {DAYS_OF_WEEK[slot.dayOfWeek]}
                  </span>
                </div>
                
                {slot.isActive && (
                  <div className="flex items-center space-x-2 flex-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateDaySchedule(index, 'startTime', e.target.value)}
                      className="w-24"
                    />
                    <span className="text-caption text-gray-500">to</span>
                    <Input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateDaySchedule(index, 'endTime', e.target.value)}
                      className="w-24"
                    />
                  </div>
                )}
                
                {!slot.isActive && (
                  <div className="flex-1">
                    <Badge variant="secondary" className="text-caption">
                      Unavailable
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Time Off Management */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="text-headline flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Time Off
              </div>
              <Dialog open={isTimeOffDialogOpen} onOpenChange={setIsTimeOffDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Time Off
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Time Off</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={timeOffForm.startDate}
                        onChange={(e) => setTimeOffForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={timeOffForm.endDate}
                        onChange={(e) => setTimeOffForm(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason (Optional)</Label>
                      <Textarea
                        id="reason"
                        value={timeOffForm.reason}
                        onChange={(e) => setTimeOffForm(prev => ({ ...prev, reason: e.target.value }))}
                        placeholder="Vacation, sick leave, etc."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsTimeOffDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddTimeOff}
                      disabled={addTimeOffMutation.isPending}
                      className="btn-primary"
                    >
                      {addTimeOffMutation.isPending ? 'Adding...' : 'Add Time Off'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="ios-card-content">
            {scheduleData?.timeOff?.length > 0 ? (
              <div className="space-y-3">
                {scheduleData.timeOff.map((timeOff: TimeOff) => (
                  <div key={timeOff.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex-1">
                      <div className="text-body font-medium">
                        {format(new Date(timeOff.startDate), 'MMM dd')} - {format(new Date(timeOff.endDate), 'MMM dd, yyyy')}
                      </div>
                      {timeOff.reason && (
                        <div className="text-caption text-gray-600 mt-1">
                          {timeOff.reason}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTimeOffMutation.mutate(timeOff.id)}
                      disabled={deleteTimeOffMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-body">No time off scheduled</p>
                <p className="text-caption">Add time off to block unavailable dates</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}