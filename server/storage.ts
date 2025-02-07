import { users, hotels, bookings, type User, type InsertUser, type Hotel, type InsertHotel, type Booking, type InsertBooking } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getHotels(): Promise<Hotel[]>;
  getHotel(id: number): Promise<Hotel | undefined>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;

  getBookings(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });

    // Add sample hotels if none exist
    this.getHotels().then((existingHotels) => {
      if (existingHotels.length === 0) {
        this.createHotel({
          name: "Serengeti Lodge",
          description: "Luxury lodge overlooking the Serengeti plains",
          location: "Serengeti, Tanzania",
          mainImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
          pricePerNight: 350,
          rating: 4.8,
          ownerId: null
        });

        this.createHotel({
          name: "Cape Coast Resort",
          description: "Beachfront resort with historic charm",
          location: "Cape Coast, Ghana",
          mainImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
          pricePerNight: 250,
          rating: 4.5,
          ownerId: null
        });
      }
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, isHotelOwner: insertUser.isHotelOwner ?? false })
      .returning();
    return user;
  }

  async getHotels(): Promise<Hotel[]> {
    return await db.select().from(hotels);
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id));
    return hotel;
  }

  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    const [hotel] = await db
      .insert(hotels)
      .values({
        ...insertHotel,
        rating: insertHotel.rating ?? 0,
        ownerId: insertHotel.ownerId ?? null
      })
      .returning();
    return hotel;
  }

  async getBookings(userId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId));
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values({
        ...insertBooking,
        userId: insertBooking.userId ?? null,
        hotelId: insertBooking.hotelId ?? null,
        createdAt: insertBooking.createdAt ?? new Date()
      })
      .returning();
    return booking;
  }
}

export const storage = new DatabaseStorage();