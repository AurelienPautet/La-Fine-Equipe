import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { regulationsCategories } from "@lafineequipe/db/src/schema";

export type Categories = InferSelectModel<typeof regulationsCategories>;

export const createCategoryRequestSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  abbreviation: z.string().min(1, "Abbreviation is required"),
  titleSchema: z.string().min(1, "Title schema is required"),
  order: z.number().int().default(0),
});

export const editCategoryRequestSchema = createCategoryRequestSchema.extend({
  id: z.number().min(1, "ID is required"),
});

export const reorderCategoriesRequestSchema = z.object({
  id: z.number().min(1, "ID is required"),
  order: z.number().int(),
});

export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>;
export type EditCategoryRequest = z.infer<typeof editCategoryRequestSchema>;
export type ReorderCategoriesRequest = z.infer<
  typeof reorderCategoriesRequestSchema
>;
