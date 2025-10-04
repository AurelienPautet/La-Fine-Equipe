import { InferSelectModel } from "drizzle-orm";
import { articles, tags } from "@lafineequipe/db/src/schema";
import { z } from "zod";

export type Article = InferSelectModel<typeof articles>;

export interface ArticleWithTags extends Article {
  tags: string[];
  tagsId?: number[];
}

export const createArticleRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  tagsId: z.array(z.number()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
});

export type CreateArticleRequest = z.infer<typeof createArticleRequestSchema>;
