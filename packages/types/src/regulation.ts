import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { regulations } from "@lafineequipe/db/src/schema";

export type Regulation = InferSelectModel<typeof regulations>;

export const createRegulationRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  date: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
  content: z.string().min(1, "Content is required"),
});

export const editRegulationRequestSchema = createRegulationRequestSchema.extend(
  {
    id: z.number().min(1, "ID is required"),
  }
);

export type CreateRegulationRequest = z.infer<
  typeof createRegulationRequestSchema
>;
export type EditRegulationRequest = z.infer<typeof editRegulationRequestSchema>;
