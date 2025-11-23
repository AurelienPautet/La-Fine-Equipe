import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { homeSections, homeSectionButtons } from "@lafineequipe/db/src/schema";

export type HomeSection = InferSelectModel<typeof homeSections>;
export type HomeSectionButton = InferSelectModel<typeof homeSectionButtons>;

export interface HomeSectionWithButtons extends HomeSection {
  buttons?: HomeSectionButton[];
}

export const homeSectionButtonSchema = z.object({
  id: z.number().optional(),
  label: z.string().min(1, "Button label is required"),
  link: z.string().url("Button link must be a valid URL"),
  order: z.number().int().default(0),
});

export const createHomeSectionRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  buttons: z.array(homeSectionButtonSchema).optional(),
  imageUrl: z.string().optional(),
  isVisible: z.boolean().default(true),
});

export const editHomeSectionRequestSchema =
  createHomeSectionRequestSchema.extend({
    id: z.number().min(1, "ID is required"),
  });

export const reorderHomeSectionsRequestSchema = z.array(
  z.object({
    id: z.number().min(1, "ID is required"),
    order: z.number().int(),
  })
);

export type HomeSectionButtonInput = z.infer<typeof homeSectionButtonSchema>;
export type CreateHomeSectionRequest = z.infer<
  typeof createHomeSectionRequestSchema
>;
export type EditHomeSectionRequest = z.infer<
  typeof editHomeSectionRequestSchema
>;
export type ReorderHomeSectionsRequest = z.infer<
  typeof reorderHomeSectionsRequestSchema
>;
