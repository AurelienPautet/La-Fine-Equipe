import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

import { eventsReservations } from "@lafineequipe/db/src/schema";

export type Reservation = InferSelectModel<typeof eventsReservations>;

export const createReservationSchema = z.object({
  eventId: z.number().min(1, "Event ID is required"),
  lastName: z.string().min(1, "Last name is required"),
  firstName: z.string().min(1, "First name is required"),
  email: z.string().min(1, "Email address is required"),
  isMember: z.boolean(),
});

export type CreateReservationRequest = z.infer<typeof createReservationSchema>;
