import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerCompetitionRoutes } from "./competitionRoutes";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupRealTimeRoutes } from "./realTimeRoutes";
import { insertUserSchema, insertBookingSchema, insertReviewSchema, insertServiceSchema } from "@shared/schema";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes - simplified for demo
  app.get('/api/auth/user', async (req: any, res) => {
    // For demo purposes, return a mock user or null
    // In production, this would check the actual authentication state
    res.status(401).json({ message: "Not authenticated - demo mode" });
  });

  // User registration and profile setup
  app.post('/api/users/setup-profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const claims = req.user.claims;
      
      const userData = insertUserSchema.parse({
        ...req.body,
        email: claims.email,
        firstName: claims.first_name || req.body.firstName,
        lastName: claims.last_name || req.body.lastName,
        profileImageUrl: claims.profile_image_url,
      });

      // If user already exists, update their profile, otherwise create new
      const existingUser = await storage.getUser(userId);
      let user;
      
      if (existingUser) {
        user = await storage.upsertUser({ id: userId, ...userData });
      } else {
        user = await storage.upsertUser({ id: userId, ...userData });
      }

      res.json(user);
    } catch (error: any) {
      console.error("Error setting up profile:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Get stylists with search/filter - demo data for now
  app.get('/api/stylists', async (req, res) => {
    try {
      // Return sample stylists for demo
      const sampleStylists = [
        {
          id: "1",
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah@example.com",
          profileImageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=100&h=100&fit=crop&crop=face",
          userType: "stylist",
          bio: "Professional hair stylist with 8+ years of experience specializing in cuts and color.",
          yearsExperience: 8,
          specializations: ["Haircuts", "Color", "Highlights"],
          rating: "4.9",
          totalReviews: 127,
          isAvailable: true,
          location: "Downtown"
        },
        {
          id: "2", 
          firstName: "Marcus",
          lastName: "Williams",
          email: "marcus@example.com",
          profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          userType: "stylist",
          bio: "Master barber and men's grooming specialist. Expert in modern cuts and traditional styles.",
          yearsExperience: 12,
          specializations: ["Men's Cuts", "Beard Trim", "Traditional Shaves"],
          rating: "4.8",
          totalReviews: 89,
          isAvailable: true,
          location: "Midtown"
        },
        {
          id: "3",
          firstName: "Emily",
          lastName: "Chen",
          email: "emily@example.com", 
          profileImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
          userType: "stylist",
          bio: "Curly hair specialist and natural hair care expert. Passionate about healthy hair.",
          yearsExperience: 6,
          specializations: ["Curly Hair", "Natural Hair", "Deep Conditioning"],
          rating: "4.9",
          totalReviews: 203,
          isAvailable: true,
          location: "Uptown"
        }
      ];
      
      res.json(sampleStylists);
    } catch (error: any) {
      console.error("Error fetching stylists:", error);
      res.status(500).json({ message: "Failed to fetch stylists" });
    }
  });

  // Get stylist by ID with services
  app.get('/api/stylists/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const stylist = await storage.getUser(id);
      if (!stylist || stylist.userType !== 'stylist') {
        return res.status(404).json({ message: "Stylist not found" });
      }
      
      const services = await storage.getServicesByStylisId(id);
      const reviews = await storage.getReviewsByStylistId(id);
      
      res.json({ ...stylist, services, reviews });
    } catch (error: any) {
      console.error("Error fetching stylist:", error);
      res.status(500).json({ message: "Failed to fetch stylist" });
    }
  });

  // Services management
  app.get('/api/services/stylist/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const services = await storage.getServicesByStylisId(id);
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post('/api/services', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.userType !== 'stylist') {
        return res.status(403).json({ message: "Only stylists can create services" });
      }

      const serviceData = insertServiceSchema.parse({
        ...req.body,
        stylistId: userId,
      });

      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Bookings
  app.get('/api/bookings/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookings = await storage.getBookingsByUserId(userId);
      
      // Enhance bookings with related data
      const enhancedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const stylist = await storage.getUser(booking.stylistId);
          const client = await storage.getUser(booking.clientId);
          const service = await storage.getServicesByStylisId(booking.stylistId);
          const selectedService = service.find(s => s.id === booking.serviceId);
          
          return {
            ...booking,
            stylist,
            client,
            service: selectedService,
          };
        })
      );
      
      res.json(enhancedBookings);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.post('/api/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.userType !== 'client') {
        return res.status(403).json({ message: "Only clients can create bookings" });
      }

      const bookingData = insertBookingSchema.parse({
        ...req.body,
        clientId: userId,
      });

      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch('/api/bookings/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const booking = await storage.getBookingById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const userId = req.user.claims.sub;
      if (booking.stylistId !== userId && booking.clientId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updatedBooking = await storage.updateBookingStatus(id, status);
      res.json(updatedBooking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Reviews
  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.userType !== 'client') {
        return res.status(403).json({ message: "Only clients can create reviews" });
      }

      // Check if booking exists and belongs to user
      const booking = await storage.getBookingById(req.body.bookingId);
      if (!booking || booking.clientId !== userId) {
        return res.status(403).json({ message: "Invalid booking" });
      }

      // Check if review already exists
      const existingReview = await storage.getReviewByBookingId(req.body.bookingId);
      if (existingReview) {
        return res.status(400).json({ message: "Review already exists for this booking" });
      }

      const reviewData = insertReviewSchema.parse({
        ...req.body,
        clientId: userId,
        stylistId: booking.stylistId,
      });

      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Stylist availability
  app.patch('/api/stylists/availability', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.userType !== 'stylist') {
        return res.status(403).json({ message: "Only stylists can update availability" });
      }

      const { isAvailable } = req.body;
      const updatedUser = await storage.updateUserAvailability(userId, isAvailable);
      res.json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get stylist's weekly schedule
  app.get('/api/stylist/schedule', async (req: any, res) => {
    try {
      // For demo mode, use default stylist ID
      const userId = "stylist-1";
      
      const availability = await storage.getStylistAvailability(userId);
      const timeOff = await storage.getStylistTimeOff(userId);
      
      res.json({ availability, timeOff });
    } catch (error: any) {
      console.error("Error fetching schedule:", error);
      res.status(500).json({ message: "Failed to fetch schedule" });
    }
  });

  // Update stylist's weekly schedule
  app.post('/api/stylist/schedule', async (req: any, res) => {
    try {
      // For demo mode, use default stylist ID
      const userId = "stylist-1";

      const { availability } = req.body;
      
      // Validate availability data
      if (!Array.isArray(availability)) {
        return res.status(400).json({ message: "Availability must be an array" });
      }

      // Add stylistId to each availability entry
      const availabilityWithStylistId = availability.map(avail => ({
        ...avail,
        stylistId: userId,
      }));

      const updatedAvailability = await storage.updateStylistAvailability(userId, availabilityWithStylistId);
      
      res.json({ availability: updatedAvailability });
    } catch (error: any) {
      console.error("Error updating schedule:", error);
      res.status(500).json({ message: "Failed to update schedule" });
    }
  });

  // Add time off
  app.post('/api/stylist/time-off', async (req: any, res) => {
    try {
      // For demo mode, use default stylist ID
      const userId = "stylist-1";

      const timeOffData = {
        ...req.body,
        stylistId: userId,
      };

      const timeOff = await storage.createTimeOff(timeOffData);
      
      res.json(timeOff);
    } catch (error: any) {
      console.error("Error adding time off:", error);
      res.status(500).json({ message: "Failed to add time off" });
    }
  });

  // Delete time off
  app.delete('/api/stylist/time-off/:id', async (req: any, res) => {
    try {
      // For demo mode, use default stylist ID
      const userId = "stylist-1";

      const { id } = req.params;
      
      // Verify the time off belongs to this stylist
      const timeOffList = await storage.getStylistTimeOff(userId);
      const timeOff = timeOffList.find(t => t.id === id);
      
      if (!timeOff) {
        return res.status(404).json({ message: "Time off not found" });
      }

      await storage.deleteTimeOff(id);
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting time off:", error);
      res.status(500).json({ message: "Failed to delete time off" });
    }
  });

  // Stripe Connect routes for stylist payouts
  app.post('/api/stylist/create-stripe-account', async (req, res) => {
    try {
      // For demo purposes, simulate account creation
      // In production, this would create a real Stripe Connect account
      const mockAccount = {
        id: 'acct_demo_' + Math.random().toString(36).substr(2, 9),
        status: 'pending'
      };

      const accountLinkUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=demo&state=demo&scope=read_write`;

      res.json({
        accountId: mockAccount.id,
        accountLinkUrl: accountLinkUrl,
        status: 'pending'
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to create Stripe account: ' + error.message });
    }
  });

  app.get('/api/stylist/stripe-status', async (req, res) => {
    try {
      // For demo purposes, return mock status
      // In production, this would check actual Stripe account status
      const mockStatus = {
        status: 'pending',
        onboardingCompleted: false,
        accountLinkUrl: 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=demo&state=demo&scope=read_write'
      };

      res.json(mockStatus);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to get Stripe status: ' + error.message });
    }
  });

  app.post('/api/stylist/refresh-stripe-status', async (req, res) => {
    try {
      // For demo purposes, simulate status refresh
      // In production, this would refresh actual Stripe account status
      res.json({ message: 'Status refreshed successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to refresh status: ' + error.message });
    }
  });

  app.get('/api/stylist/earnings', async (req, res) => {
    try {
      // For demo purposes, return mock earnings data
      const mockEarnings = {
        totalEarnings: 1250.75,
        thisMonth: 485.50,
        pendingPayouts: 125.00,
        completedBookings: 23,
        recentPayouts: [
          {
            id: '1',
            amount: 85.00,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            bookingId: 'booking_1'
          },
          {
            id: '2', 
            amount: 125.50,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            bookingId: 'booking_2'
          },
          {
            id: '3',
            amount: 67.25,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
            bookingId: 'booking_3'
          }
        ]
      };

      res.json(mockEarnings);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to get earnings: ' + error.message });
    }
  });

  // Stripe payment routes
  if (stripe) {
    app.post("/api/create-payment-intent", isAuthenticated, async (req, res) => {
      try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
        });
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        res.status(500).json({ message: "Error creating payment intent: " + error.message });
      }
    });
  } else {
    app.post("/api/create-payment-intent", async (req, res) => {
      res.status(500).json({ message: "Stripe not configured. Please set STRIPE_SECRET_KEY environment variable." });
    });
  }

  // Register competition routes
  registerCompetitionRoutes(app);

  const httpServer = createServer(app);

  // Setup real-time features
  setupRealTimeRoutes(app, httpServer);

  return httpServer;
}
