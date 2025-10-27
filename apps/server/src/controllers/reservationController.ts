import { Request, Response } from "express";
import { db } from "@lafineequipe/db";
import { eq } from "drizzle-orm";
import { eventsReservations } from "@lafineequipe/db/src/schema";

export const createReservation = async (req: Request, res: Response) => {
  const { eventId, lastName, firstName, phone, isMember } = req.body;
  try {
    const newReservation = await db.insert(eventsReservations).values({
      eventId: eventId,
      lastName: lastName,
      firstName: firstName,
      phone: phone,
      isMember: isMember,
    });
    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReservationsForEvent = async (req: Request, res: Response) => {
  const eventId = parseInt(req.query.eventId as string, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({ error: "Invalid event ID" });
  }
  try {
    const reservations = await db
      .select()
      .from(eventsReservations)
      .where(eq(eventsReservations.eventId, eventId));
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
