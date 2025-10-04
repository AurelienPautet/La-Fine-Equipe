import { pgTable, text, serial, timestamp,integer } from "drizzle-orm/pg-core";


export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(()=>new Date()),
});

export const articleTags = pgTable("article_tags", {
  articleId: integer('article_id')
            .references(() => articles.id),
  tagId: integer("tag_id")
            .references(() => tags.id),
});

