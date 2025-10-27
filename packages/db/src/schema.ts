import {
  pgTable,
  text,
  serial,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

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

export const regulations = pgTable("LaFineEquipe-regulations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  author: text("author").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").notNull(),
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

export const eventsReservations = pgTable("LaFineEquipe-events_reservations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .references(() => events.id)
    .notNull(),
  lastName: text("last_name").notNull(),
  firstName: text("first_name").notNull(),
  phone: text("phone").notNull(),
  isMember: boolean("is_member").notNull(),
  reservedAt: timestamp("reserved_at").defaultNow(),
});
