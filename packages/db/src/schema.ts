import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

export const tags = pgTable("LaFineEquipe-tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const articles = pgTable("LaFineEquipe-articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const articleTags = pgTable("LaFineEquipe-article_tags", {
  articleId: integer("article_id")
    .references(() => articles.id)
    .notNull(),
  tagId: integer("tag_id")
    .references(() => tags.id)
    .notNull(),
});

export const markingEvents = pgTable("LaFineEquipe-marking_events", {
  id: serial("id").primaryKey(),
  articleUrl: text("article_url"),
  imageUrl: text("image_url").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
});
