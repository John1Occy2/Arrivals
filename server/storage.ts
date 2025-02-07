import createMemoryStore from "memorystore";
import session from "express-session";
import { InsertUser, User, InsertHotel, Hotel, InsertBooking, Booking } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private hotels: Map<number, Hotel>;
  private bookings: Map<number, Booking>;
  sessionStore: session.Store;
  private currentUserId: number;
  private currentHotelId: number;
  private currentBookingId: number;

  constructor() {
    this.users = new Map();
    this.hotels = new Map();
    this.bookings = new Map();
    this.currentUserId = 1;
    this.currentHotelId = 1;
    this.currentBookingId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Add some sample hotels
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

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { id, ...insertUser, isHotelOwner: insertUser.isHotelOwner ?? false };
    this.users.set(id, user);
    return user;
  }

  async getHotels(): Promise<Hotel[]> {
    return Array.from(this.hotels.values());
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }

  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    const id = this.currentHotelId++;
    const hotel: Hotel = {
      id,
      ...insertHotel,
      rating: insertHotel.rating ?? 0,
      ownerId: insertHotel.ownerId ?? null
    };
    this.hotels.set(id, hotel);
    return hotel;
  }

  async getBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId,
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = {
      id,
      ...insertBooking,
      userId: insertBooking.userId ?? null,
      hotelId: insertBooking.hotelId ?? null,
      createdAt: insertBooking.createdAt ?? new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }
}

export const storage = new MemStorage();