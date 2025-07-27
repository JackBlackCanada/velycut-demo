import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Users table for both clients and stylists
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  userType: varchar("user_type").notNull(), // 'client' or 'stylist'
  address: text("address"),
  bio: text("bio"),
  yearsExperience: integer("years_experience"),
  specializations: text("specializations").array(),
  serviceArea: varchar("service_area"),
  licenseNumber: varchar("license_number"),
  travelRadius: integer("travel_radius"), // in miles
  isAvailable: boolean("is_available").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalReviews: integer("total_reviews").default(0),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeAccountId: varchar("stripe_account_id"),
  stripeAccountStatus: varchar("stripe_account_status").default("pending"), // pending, active, restricted, inactive
  stripeOnboardingCompleted: boolean("stripe_onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services offered by stylists
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stylistId: varchar("stylist_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  duration: integer("duration").notNull(), // in minutes
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookings/appointments
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => users.id),
  stylistId: varchar("stylist_id").notNull().references(() => users.id),
  serviceId: varchar("service_id").notNull().references(() => services.id),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull(), // in minutes
  status: varchar("status").notNull().default("pending"), // pending, confirmed, in_progress, completed, cancelled
  totalAmount: decimal("total_amount", { precision: 8, scale: 2 }).notNull(),
  clientAddress: text("client_address").notNull(),
  clientPhone: varchar("client_phone"),
  specialRequests: text("special_requests"),
  paymentIntentId: varchar("payment_intent_id"),
  stripeTransferStatus: varchar("stripe_transfer_status").default("pending"), // pending, completed, failed
  stylistPayout: decimal("stylist_payout", { precision: 8, scale: 2 }),
  platformFee: decimal("platform_fee", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews and ratings
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id),
  clientId: varchar("client_id").notNull().references(() => users.id),
  stylistId: varchar("stylist_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  professionalismRating: integer("professionalism_rating"),
  qualityRating: integer("quality_rating"),
  punctualityRating: integer("punctuality_rating"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
