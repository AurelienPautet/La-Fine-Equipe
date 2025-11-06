import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { figures } from "@lafineequipe/db/src/schema";

export type Figure = InferSelectModel<typeof figures>;

export const createFigureRequestSchema = z.object({
  figure: z.string().min(1, "Figure is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
});

export const editFigureRequestSchema = createFigureRequestSchema.extend({
  id: z.number().min(1, "ID is required"),
});

export const reorderFiguresRequestSchema = z.array(
  z.object({
    id: z.number().min(1, "ID is required"),
    order: z.number().int(),
  })
);

export type CreateFigureRequest = z.infer<typeof createFigureRequestSchema>;
export type EditFigureRequest = z.infer<typeof editFigureRequestSchema>;
export type ReorderFiguresRequest = z.infer<typeof reorderFiguresRequestSchema>;
