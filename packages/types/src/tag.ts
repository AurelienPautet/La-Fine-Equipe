import { InferSelectModel } from "drizzle-orm";
import { tags } from "@lafineequipe/db/src/schema";
import { z } from "zod";

export type Tag = InferSelectModel<typeof tags>;

export const tagSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const createTagRequestSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50, "Tag name too long"),
});

export type CreateTagRequest = z.infer<typeof createTagRequestSchema>;
