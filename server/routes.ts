import { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertHotelSchema, insertBookingSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Hotel routes
  app.get("/api/hotels", async (_req, res) => {
    const hotels = await storage.getHotels();
    res.json(hotels);
  });

  app.get("/api/hotels/:id", async (req, res) => {
    const hotel = await storage.getHotel(Number(req.params.id));
    if (!hotel) return res.sendStatus(404);
    res.json(hotel);
  });

  app.post("/api/hotels", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.user.isHotelOwner) return res.sendStatus(403);

    const parseResult = insertHotelSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(parseResult.error);
    }

    const hotel = await storage.createHotel({
      ...parseResult.data,
      ownerId: req.user.id,
    });
    res.status(201).json(hotel);
  });

  // Booking routes
  app.get("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const bookings = await storage.getBookings(req.user.id);
    res.json(bookings);
  });

  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parseResult = insertBookingSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(parseResult.error);
    }

    const booking = await storage.createBooking({
      ...parseResult.data,
      userId: req.user.id,
    });
    res.status(201).json(booking);
  });

  const httpServer = createServer(app);
  return httpServer;
}
