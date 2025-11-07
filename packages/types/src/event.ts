import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { events } from "@lafineequipe/db/src/schema";
import { Tag, tagSchema } from "./tag";

export type Events = InferSelectModel<typeof events>;

export interface EventsWithTags extends Events {
  tags: Tag[];
}

export const createEventsRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
  endDate: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  tags: z.array(tagSchema).optional().default([]),
  location: z.string().min(1, "Location is required"),
  maxAttendees: z
    .number()
    .min(1, "Max attendees must be at least 1")
    .optional(),
  thumbnailUrl: z.string().url().optional(),
  reservationUrl: z.string().url().optional(),
});

export const editEventsRequestSchema = createEventsRequestSchema.extend({
  id: z.number().min(1, "ID is required"),
});

export type CreateEventsRequest = z.infer<typeof createEventsRequestSchema>;
export type EditEventsRequest = z.infer<typeof editEventsRequestSchema>;
