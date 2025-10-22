import { InferSelectModel } from "drizzle-orm";
import { articles } from "@lafineequipe/db/src/schema";
import { z } from "zod";
import { Tag, tagSchema } from "./tag";

export type Article = InferSelectModel<typeof articles>;

export interface ArticleWithTags extends Article {
  tags: Tag[];
}

export const createArticleRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  tags: z.array(tagSchema).optional().default([]),
});

export const editArticleRequestSchema = createArticleRequestSchema.extend({
  id: z.number().min(1, "ID is required"),
});

export type CreateArticleRequest = z.infer<typeof createArticleRequestSchema>;
export type EditArticleRequest = z.infer<typeof editArticleRequestSchema>;
