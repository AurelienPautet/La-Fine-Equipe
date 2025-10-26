import { InferSelectModel } from "drizzle-orm";
import { events } from "@lafineequipe/db/src/schema";
import { z } from "zod";
import { Tag, tagSchema } from "./tag";

export type Events = InferSelectModel<typeof events>;

export interface EventsWithTags extends Events {
  tags: Tag[];
}

export const createEventsRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  tags: z.array(tagSchema).optional().default([]),
});

export const editEventsRequestSchema = createEventsRequestSchema.extend({
  id: z.number().min(1, "ID is required"),
});

export type CreateEventsRequest = z.infer<typeof createEventsRequestSchema>;
export type EditEventsRequest = z.infer<typeof editEventsRequestSchema>;
