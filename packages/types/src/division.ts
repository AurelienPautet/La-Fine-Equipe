import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { divisions } from "@lafineequipe/db/src/schema";

export type Division = InferSelectModel<typeof divisions>;

export const createDivisionRequestSchema = z.object({
  name: z.string().min(1, "Division name is required"),
  color: z.string().min(1, "Color is required"),
  titleSchema: z.string().min(1, "Title schema is required"),
});

export const editDivisionRequestSchema = createDivisionRequestSchema.extend({
  id: z.number().min(1, "ID is required"),
});

export const reorderDivisionsRequestSchema = z.array(
  z.object({
    id: z.number().min(1, "ID is required"),
    order: z.number().int(),
  })
);

export type CreateDivisionRequest = z.infer<typeof createDivisionRequestSchema>;
export type EditDivisionRequest = z.infer<typeof editDivisionRequestSchema>;
export type ReorderDivisionsRequest = z.infer<
  typeof reorderDivisionsRequestSchema
>;
