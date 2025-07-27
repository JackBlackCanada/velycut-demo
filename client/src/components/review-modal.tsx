import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  professionalismRating: z.number().min(1).max(5),
  qualityRating: z.number().min(1).max(5),
  punctualityRating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  booking: {
    id: string;
    stylistId: string;
    stylist?: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function ReviewModal({ open, onClose, booking }: ReviewModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [ratings, setRatings] = useState({
    overall: 0,
    professionalism: 0,
    quality: 0,
    punctuality: 0,
  });

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      professionalismRating: 0,
      qualityRating: 0,
      punctualityRating: 0,
      comment: "",
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      return await apiRequest("POST", "/api/reviews", {
        ...data,
        bookingId: booking.id,
        stylistId: booking.stylistId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stylists", booking.stylistId] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    reviewMutation.mutate(data);
  };

  const handleRatingClick = (category: keyof typeof ratings, rating: number) => {
    const newRatings = { ...ratings, [category]: rating };
    setRatings(newRatings);
    
    // Update form values
    if (category === 'overall') {
      form.setValue('rating', rating);
    } else if (category === 'professionalism') {
      form.setValue('professionalismRating', rating);
    } else if (category === 'quality') {
      form.setValue('qualityRating', rating);
    } else if (category === 'punctuality') {
      form.setValue('punctualityRating', rating);
    }
  };

  const renderStars = (category: keyof typeof ratings, label: string) => {
    const currentRating = ratings[category];
    
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(category, star)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= currentRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                } hover:scale-110 transition-transform`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const stylistName = booking.stylist 
    ? `${booking.stylist.firstName} ${booking.stylist.lastName}`
    : "Your stylist";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl mb-2">
            Rate Your Experience
          </DialogTitle>
          <p className="text-center text-gray-600 text-sm">
            How was your service with {stylistName}?
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="space-y-4">
              {renderStars('overall', 'Overall Experience')}
              {renderStars('professionalism', 'Professionalism')}
              {renderStars('quality', 'Service Quality')}
              {renderStars('punctuality', 'Punctuality')}
            </div>

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share more details about your experience..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={reviewMutation.isPending || ratings.overall === 0}
              >
                {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}