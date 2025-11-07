import {
  pgTable,
  text,
  serial,
  timestamp,
  integer,
  boolean,
  real,
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
  reservationUrl: text("reservation_url"),
  memorable: boolean("memorable").notNull().default(false),
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

export const divisions = pgTable("LaFineEquipe-divisions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
  order: integer("order").notNull().default(0),
  titleSchema: text("title_schema").notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const teamMembers = pgTable("LaFineEquipe-team_members", {
  id: serial("id").primaryKey(),
  divisionId: integer("division_id")
    .references(() => divisions.id)
    .notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull(),
  email: text("email"),
  photoUrl: text("photo_url"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  deletedAt: timestamp("deleted_at"),
});

export const figures = pgTable("LaFineEquipe-figures", {
  id: serial("id").primaryKey(),
  figure: text("figure").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
  deletedAt: timestamp("deleted_at"),
});

export const homeSections = pgTable("LaFineEquipe-home_sections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  buttonLabel: text("button_label"),
  buttonLink: text("button_link"),
  imageUrl: text("image_url"),
  isVisible: boolean("is_visible").notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});
