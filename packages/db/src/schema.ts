import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

export const tags = pgTable("LaFineEquipe-tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const events = pgTable("LaFineEquipe-events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location").notNull(),
  maxAttendees: integer("max_attendees"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const eventsTags = pgTable("LaFineEquipe-events_tags", {
  eventsId: integer("events_id")
    .references(() => events.id)
    .notNull(),
  tagId: integer("tag_id")
    .references(() => tags.id)
    .notNull(),
});
