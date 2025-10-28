import { real } from "drizzle-orm/pg-core";
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
  deletedAt: timestamp("deleted_at"),
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
  deletedAt: timestamp("deleted_at"),
});

export const regulationsCategories = pgTable(
  "LaFineEquipe-regulations_categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    abbreviation: text("abbreviation").notNull(),
    titleSchema: text("title_schema").notNull(),
    order: integer("order").notNull().default(0),
    deletedAt: timestamp("deleted_at"),
  }
);

export const regulations = pgTable("LaFineEquipe-regulations", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .references(() => regulationsCategories.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
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
  email: text("email").notNull(),
  isMember: boolean("is_member").notNull(),
  reservedAt: timestamp("reserved_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const actifMembersSettings = pgTable(
  "LaFineEquipe-actif_members_settings",
  {
    id: serial("id").primaryKey(),
    url: text("url").notNull(),
    price: real("price").notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  }
);

export const simpleMembersSettings = pgTable(
  "LaFineEquipe-simple_members_settings",
  {
    id: serial("id").primaryKey(),
    url: text("url").notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  }
);
