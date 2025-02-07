import { pgTable, text, serial, integer, boolean, date, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isHotelOwner: boolean("is_hotel_owner").default(false).notNull(),
  trialEndsAt: timestamp("trial_ends_at"),
  subscriptionStatus: text("subscription_status").default('inactive'),
  preferences: text("preferences").array(),
});

export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  mainImage: text("main_image").notNull(),
  virtualTourUrl: text("virtual_tour_url"),
  amenities: text("amenities").array(),
  pricePerNight: doublePrecision("price_per_night").notNull(),
  rating: doublePrecision("rating").default(0),
  ownerId: integer("owner_id").references(() => users.id),
  category: text("category"),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  hotelId: integer("hotel_id").references(() => hotels.id),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  hotelId: integer("hotel_id").references(() => hotels.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  isHotelOwner: true,
});

export const insertHotelSchema = createInsertSchema(hotels).extend({
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
  virtualTourUrl: z.string().url("Please provide a valid URL for the virtual tour"),
});

export const insertBookingSchema = createInsertSchema(bookings);

export const insertReviewSchema = createInsertSchema(reviews).omit({
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type User = typeof users.$inferSelect;
export type Hotel = typeof hotels.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Review = typeof reviews.$inferSelect;

export const loginSchema = insertUserSchema.pick({
  username: true,
  password: true,
});

export type LoginData = z.infer<typeof loginSchema>;