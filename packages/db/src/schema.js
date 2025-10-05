"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleTags = exports.articles = exports.tags = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.tags = (0, pg_core_1.pgTable)("tags", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull().unique(),
});
exports.articles = (0, pg_core_1.pgTable)("articles", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    content: (0, pg_core_1.text)("content").notNull(),
    author: (0, pg_core_1.text)("author").notNull(),
    date: (0, pg_core_1.timestamp)("date").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});
exports.articleTags = (0, pg_core_1.pgTable)("article_tags", {
    articleId: (0, pg_core_1.integer)('article_id')
        .references(() => exports.articles.id).notNull(),
    tagId: (0, pg_core_1.integer)("tag_id")
        .references(() => exports.tags.id).notNull(),
});
