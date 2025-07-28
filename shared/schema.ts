import { sql, relations } from "drizzle-orm";
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
  
  // Verification and onboarding fields
  verificationStatus: varchar("verification_status").default("pending"), // pending, in-progress, approved, rejected
  backgroundCheckStatus: varchar("background_check_status").default("pending"),
  identityVerified: boolean("identity_verified").default(false),
  backgroundCheckCompleted: boolean("background_check_completed").default(false),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  
  // VELY Count - total cuts completed on platform
  velyCount: integer("vely_count").default(0),
  monthlyVelyCount: integer("monthly_vely_count").default(0),
  
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

// Stylist availability schedules
export const availability = pgTable("availability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stylistId: varchar("stylist_id").notNull().references(() => users.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: varchar("start_time").notNull(), // HH:MM format
  endTime: varchar("end_time").notNull(), // HH:MM format
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stylist time off / unavailable periods
export const timeOff = pgTable("time_off", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stylistId: varchar("stylist_id").notNull().references(() => users.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: varchar("reason"), // vacation, sick, personal, etc.
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

export const insertAvailabilitySchema = createInsertSchema(availability).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTimeOffSchema = createInsertSchema(timeOff).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Competition tables for "Cut of the Month" feature
export const competitions = pgTable("competitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: varchar("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: varchar("status").notNull().default("active"), // active, ended, archived
  customerPrize: varchar("customer_prize").default("$100"),
  stylistPrize: varchar("stylist_prize").default("$1000"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const competitionEntries = pgTable("competition_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  competitionId: varchar("competition_id").references(() => competitions.id).notNull(),
  customerName: varchar("customer_name"),
  stylistName: varchar("stylist_name").notNull(),
  city: varchar("city").notNull(),
  imageUrl: varchar("image_url").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  description: varchar("description"),
  status: varchar("status").notNull().default("pending"), // pending, approved, rejected, featured
  voteCount: varchar("vote_count").notNull().default("0"),
  isWinner: varchar("is_winner").notNull().default("false"),
  submittedBy: varchar("submitted_by"), // user ID if logged in
  moderatedBy: varchar("moderated_by"), // admin user ID
  moderatedAt: timestamp("moderated_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const competitionVotes = pgTable("competition_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entryId: varchar("entry_id").references(() => competitionEntries.id).notNull(),
  competitionId: varchar("competition_id").references(() => competitions.id).notNull(),
  voterIdentifier: varchar("voter_identifier").notNull(), // IP hash or user ID
  voterType: varchar("voter_type").notNull().default("anonymous"), // anonymous, registered
  votedAt: timestamp("voted_at").defaultNow(),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
});

// Competition relations
export const competitionsRelations = relations(competitions, ({ many }) => ({
  entries: many(competitionEntries),
}));

export const competitionEntriesRelations = relations(competitionEntries, ({ one, many }) => ({
  competition: one(competitions, {
    fields: [competitionEntries.competitionId],
    references: [competitions.id],
  }),
  votes: many(competitionVotes),
}));

export const competitionVotesRelations = relations(competitionVotes, ({ one }) => ({
  entry: one(competitionEntries, {
    fields: [competitionVotes.entryId],
    references: [competitionEntries.id],
  }),
  competition: one(competitions, {
    fields: [competitionVotes.competitionId],
    references: [competitions.id],
  }),
}));

// Competition types
export type Competition = typeof competitions.$inferSelect;
export type InsertCompetition = typeof competitions.$inferInsert;
export type CompetitionEntry = typeof competitionEntries.$inferSelect;
export type InsertCompetitionEntry = typeof competitionEntries.$inferInsert;
export type CompetitionVote = typeof competitionVotes.$inferSelect;
export type InsertCompetitionVote = typeof competitionVotes.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Availability = typeof availability.$inferSelect;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;
export type TimeOff = typeof timeOff.$inferSelect;
export type InsertTimeOff = z.infer<typeof insertTimeOffSchema>;
