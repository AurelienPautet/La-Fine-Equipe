import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import {
  actifMembersSettings,
  simpleMembersSettings,
} from "@lafineequipe/db/src/schema";

export type ActifMembersSettings = InferSelectModel<
  typeof actifMembersSettings
>;
export type SimpleMembersSettings = InferSelectModel<
  typeof simpleMembersSettings
>;

export const editActifMembersSettingsRequestSchema = z.object({
  url: z.string().url("Invalid URL"),
  price: z.number().nonnegative("Price must be non-negative"),
});

export const editSimpleMembersSettingsRequestSchema = z.object({
  url: z.string().url("Invalid URL"),
});

export type EditActifMembersSettingsRequest = z.infer<
  typeof editActifMembersSettingsRequestSchema
>;

export type EditSimpleMembersSettingsRequest = z.infer<
  typeof editSimpleMembersSettingsRequestSchema
>;
