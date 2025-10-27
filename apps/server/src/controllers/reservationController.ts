import { Request, Response } from "express";
import { db } from "@lafineequipe/db";
import { eq } from "drizzle-orm";
import { events, eventsReservations } from "@lafineequipe/db/src/schema";

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
  const { slug } = req.params;
  if (!slug) {
    return res.status(400).json({ error: "Invalid event slug" });
  }
  try {
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.slug, slug))
      .limit(1);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    const eventId = event.id;
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
