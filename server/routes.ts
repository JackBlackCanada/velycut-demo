import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertUserSchema, insertBookingSchema, insertReviewSchema, insertServiceSchema } from "@shared/schema";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
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

  // Get stylists with search/filter
  app.get('/api/stylists', async (req, res) => {
    try {
      const { location, specialization } = req.query;
      const stylists = await storage.searchStylists(
        location as string, 
        specialization as string
      );
      res.json(stylists);
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

  const httpServer = createServer(app);
  return httpServer;
}
