import {
  users,
  services,
  bookings,
  reviews,
  availability,
  timeOff,
  type User,
  type UpsertUser,
  type Service,
  type InsertService,
  type Booking,
  type InsertBooking,
  type Review,
  type InsertReview,
  type Availability,
  type InsertAvailability,
  type TimeOff,
  type InsertTimeOff,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Additional user operations
  getUsersByType(userType: 'client' | 'stylist'): Promise<User[]>;
  searchStylists(location?: string, specialization?: string): Promise<User[]>;
  updateUserAvailability(userId: string, isAvailable: boolean): Promise<User>;
  
  // Service operations
  getServicesByStylisId(stylistId: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, updates: Partial<Service>): Promise<Service>;
  deleteService(id: string): Promise<void>;
  
  // Booking operations
  getBookingsByUserId(userId: string): Promise<Booking[]>;
  getBookingById(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking>;
  getUpcomingBookings(stylistId: string): Promise<Booking[]>;
  
  // Review operations
  getReviewsByStylistId(stylistId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  getReviewByBookingId(bookingId: string): Promise<Review | undefined>;

  // Availability operations
  getStylistAvailability(stylistId: string): Promise<Availability[]>;
  updateStylistAvailability(stylistId: string, availabilityData: InsertAvailability[]): Promise<Availability[]>;
  getStylistTimeOff(stylistId: string): Promise<TimeOff[]>;
  createTimeOff(timeOffData: InsertTimeOff): Promise<TimeOff>;
  deleteTimeOff(timeOffId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private services: Map<string, Service>;
  private bookings: Map<string, Booking>;
  private reviews: Map<string, Review>;
  private availability: Map<string, Availability>;
  private timeOff: Map<string, TimeOff>;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.availability = new Map();
    this.timeOff = new Map();
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample stylists
    const stylist1: User = {
      id: "stylist-1",
      email: "maria@example.com",
      firstName: "Maria",
      lastName: "Rodriguez",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      phone: "(555) 123-4567",
      userType: "stylist",
      address: "Toronto, ON",
      bio: "Specializing in curly hair textures and natural styles. 8+ years experience with color-safe techniques.",
      yearsExperience: 8,
      specializations: ["Haircuts", "Coloring", "Natural Hair"],
      serviceArea: "Toronto",
      licenseNumber: "ST123456",
      travelRadius: 15,
      isAvailable: true,
      rating: "4.8",
      totalReviews: 127,
      totalEarnings: "12450.00",
      stripeCustomerId: null,
      stripeAccountId: null,
      stripeAccountStatus: "pending",
      stripeOnboardingCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const stylist2: User = {
      id: "stylist-2",
      email: "james@example.com",
      firstName: "James",
      lastName: "Thompson",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      phone: "(555) 234-5678",
      userType: "stylist",
      address: "Los Angeles, CA",
      bio: "Expert in men's grooming and beard styling. Modern cuts with classic techniques.",
      yearsExperience: 6,
      specializations: ["Men's Cuts", "Beard Grooming", "Hair Styling"],
      serviceArea: "Los Angeles",
      licenseNumber: "ST789012",
      travelRadius: 10,
      isAvailable: true,
      rating: "4.9",
      totalReviews: 89,
      totalEarnings: "8970.00",
      stripeCustomerId: null,
      stripeAccountId: null,
      stripeAccountStatus: "pending",
      stripeOnboardingCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Sample client
    const client1: User = {
      id: "client-1",
      email: "sarah@example.com",
      firstName: "Sarah",
      lastName: "Johnson",
      profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      phone: "(555) 345-6789",
      userType: "client",
      address: "123 Oak Street, Toronto, ON",
      bio: null,
      yearsExperience: null,
      specializations: null,
      serviceArea: null,
      licenseNumber: null,
      travelRadius: null,
      isAvailable: true,
      rating: "0.00",
      totalReviews: 0,
      totalEarnings: "0.00",
      stripeCustomerId: null,
      stripeAccountId: null,
      stripeAccountStatus: "pending",
      stripeOnboardingCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(stylist1.id, stylist1);
    this.users.set(stylist2.id, stylist2);
    this.users.set(client1.id, client1);

    // Sample services
    const service1: Service = {
      id: "service-1",
      stylistId: "stylist-1",
      name: "Haircut & Wash",
      description: "Basic cut with shampoo and styling",
      price: "45.00",
      duration: 60,
      isActive: true,
      createdAt: new Date(),
    };

    const service2: Service = {
      id: "service-2",
      stylistId: "stylist-1",
      name: "Cut, Color & Style",
      description: "Full service with professional color",
      price: "120.00",
      duration: 150,
      isActive: true,
      createdAt: new Date(),
    };

    this.services.set(service1.id, service1);
    this.services.set(service2.id, service2);

    // Sample booking
    const booking1: Booking = {
      id: "booking-1",
      clientId: "client-1",
      stylistId: "stylist-1",
      serviceId: "service-1",
      scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      duration: 60,
      status: "completed",
      totalAmount: "45.00",
      clientAddress: "123 Oak Street, Toronto, ON",
      clientPhone: "(555) 345-6789",
      specialRequests: null,
      paymentIntentId: null,
      stripeTransferStatus: "completed",
      stylistPayout: "38.25",
      platformFee: "6.75",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.bookings.set(booking1.id, booking1);

    // Sample review
    const review1: Review = {
      id: "review-1",
      bookingId: "booking-1",
      clientId: "client-1",
      stylistId: "stylist-1",
      rating: 5,
      comment: "Amazing work! Maria is so professional and talented. Will definitely book again.",
      professionalismRating: 5,
      qualityRating: 5,
      punctualityRating: 5,
      createdAt: new Date(),
    };

    this.reviews.set(review1.id, review1);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = Array.from(this.users.values()).find(u => u.email === userData.email);
    
    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: new Date(),
      };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    } else {
      const id = randomUUID();
      const user: User = {
        id,
        email: userData.email ?? null,
        firstName: userData.firstName ?? null,
        lastName: userData.lastName ?? null,
        profileImageUrl: userData.profileImageUrl ?? null,
        phone: userData.phone ?? null,
        userType: userData.userType,
        address: userData.address ?? null,
        bio: userData.bio ?? null,
        yearsExperience: userData.yearsExperience ?? null,
        specializations: userData.specializations ?? null,
        serviceArea: userData.serviceArea ?? null,
        licenseNumber: userData.licenseNumber ?? null,
        travelRadius: userData.travelRadius ?? null,
        isAvailable: userData.isAvailable ?? true,
        rating: userData.rating ?? "0.00",
        totalReviews: userData.totalReviews ?? 0,
        totalEarnings: userData.totalEarnings ?? "0.00",
        stripeCustomerId: userData.stripeCustomerId ?? null,
        stripeAccountId: userData.stripeAccountId ?? null,
        stripeAccountStatus: userData.stripeAccountStatus ?? "pending",
        stripeOnboardingCompleted: userData.stripeOnboardingCompleted ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(id, user);
      return user;
    }
  }

  async getUsersByType(userType: 'client' | 'stylist'): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.userType === userType);
  }

  async searchStylists(location?: string, specialization?: string): Promise<User[]> {
    let stylists = Array.from(this.users.values()).filter(user => user.userType === 'stylist');
    
    if (location) {
      stylists = stylists.filter(stylist => 
        stylist.serviceArea?.toLowerCase().includes(location.toLowerCase()) ||
        stylist.address?.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (specialization) {
      stylists = stylists.filter(stylist => 
        stylist.specializations?.some(spec => 
          spec.toLowerCase().includes(specialization.toLowerCase())
        )
      );
    }
    
    return stylists;
  }

  async updateUserAvailability(userId: string, isAvailable: boolean): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, isAvailable, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Service operations
  async getServicesByStylisId(stylistId: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.stylistId === stylistId);
  }

  async createService(serviceData: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = {
      id,
      stylistId: serviceData.stylistId,
      name: serviceData.name,
      description: serviceData.description ?? null,
      price: serviceData.price,
      duration: serviceData.duration,
      isActive: serviceData.isActive ?? true,
      createdAt: new Date(),
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    const service = this.services.get(id);
    if (!service) throw new Error("Service not found");
    
    const updatedService = { ...service, ...updates };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: string): Promise<void> {
    this.services.delete(id);
  }

  // Booking operations
  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.clientId === userId || booking.stylistId === userId
    );
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      id,
      clientId: bookingData.clientId,
      stylistId: bookingData.stylistId,
      serviceId: bookingData.serviceId,
      scheduledAt: bookingData.scheduledAt,
      duration: bookingData.duration,
      status: bookingData.status ?? "pending",
      totalAmount: bookingData.totalAmount,
      clientAddress: bookingData.clientAddress,
      clientPhone: bookingData.clientPhone ?? null,
      specialRequests: bookingData.specialRequests ?? null,
      paymentIntentId: bookingData.paymentIntentId ?? null,
      stripeTransferStatus: bookingData.stripeTransferStatus ?? "pending",
      stylistPayout: bookingData.stylistPayout ?? null,
      platformFee: bookingData.platformFee ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const booking = this.bookings.get(id);
    if (!booking) throw new Error("Booking not found");
    
    const updatedBooking = { ...booking, status, updatedAt: new Date() };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async getUpcomingBookings(stylistId: string): Promise<Booking[]> {
    const now = new Date();
    return Array.from(this.bookings.values()).filter(
      booking => booking.stylistId === stylistId && 
                 booking.scheduledAt > now &&
                 ['pending', 'confirmed'].includes(booking.status)
    );
  }

  // Review operations
  async getReviewsByStylistId(stylistId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.stylistId === stylistId);
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      id,
      bookingId: reviewData.bookingId,
      clientId: reviewData.clientId,
      stylistId: reviewData.stylistId,
      rating: reviewData.rating,
      comment: reviewData.comment ?? null,
      professionalismRating: reviewData.professionalismRating ?? null,
      qualityRating: reviewData.qualityRating ?? null,
      punctualityRating: reviewData.punctualityRating ?? null,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    
    // Update stylist rating
    await this.updateStylistRating(reviewData.stylistId);
    
    return review;
  }

  async getReviewByBookingId(bookingId: string): Promise<Review | undefined> {
    return Array.from(this.reviews.values()).find(review => review.bookingId === bookingId);
  }

  private async updateStylistRating(stylistId: string): Promise<void> {
    const reviews = await this.getReviewsByStylistId(stylistId);
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : "0.00";
    
    const stylist = this.users.get(stylistId);
    if (stylist) {
      const updatedStylist = {
        ...stylist,
        rating: avgRating,
        totalReviews: reviews.length,
        updatedAt: new Date(),
      };
      this.users.set(stylistId, updatedStylist);
    }
  }

  // Availability operations
  async getStylistAvailability(stylistId: string): Promise<Availability[]> {
    return Array.from(this.availability.values()).filter(avail => avail.stylistId === stylistId && avail.isActive);
  }

  async updateStylistAvailability(stylistId: string, availabilityData: InsertAvailability[]): Promise<Availability[]> {
    // Remove existing availability for the stylist
    const existingKeys = Array.from(this.availability.keys()).filter(key => {
      const avail = this.availability.get(key);
      return avail?.stylistId === stylistId;
    });
    existingKeys.forEach(key => this.availability.delete(key));

    // Add new availability entries
    const newAvailability: Availability[] = [];
    for (const data of availabilityData) {
      const id = randomUUID();
      const availability: Availability = {
        id,
        stylistId: data.stylistId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        isActive: data.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.availability.set(id, availability);
      newAvailability.push(availability);
    }
    
    return newAvailability;
  }

  async getStylistTimeOff(stylistId: string): Promise<TimeOff[]> {
    return Array.from(this.timeOff.values()).filter(time => time.stylistId === stylistId);
  }

  async createTimeOff(timeOffData: InsertTimeOff): Promise<TimeOff> {
    const id = randomUUID();
    const timeOff: TimeOff = {
      id,
      stylistId: timeOffData.stylistId,
      startDate: timeOffData.startDate,
      endDate: timeOffData.endDate,
      reason: timeOffData.reason ?? null,
      createdAt: new Date(),
    };
    this.timeOff.set(id, timeOff);
    return timeOff;
  }

  async deleteTimeOff(timeOffId: string): Promise<void> {
    this.timeOff.delete(timeOffId);
  }
}

export const storage = new MemStorage();
