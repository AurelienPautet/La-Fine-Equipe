import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { teamMembers } from "@lafineequipe/db/src/schema";

export type TeamMember = InferSelectModel<typeof teamMembers>;

export const createTeamMemberRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  divisionId: z.number().min(1, "Division ID is required"),
  role: z.string().min(1, "Role is required"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  photoUrl: z.string().url("Invalid URL"),
  isActive: z.boolean().default(true),
});

export const editTeamMemberRequestSchema = createTeamMemberRequestSchema.extend(
  {
    id: z.number().min(1, "ID is required"),
  }
);

export const reorderTeamMembersRequestSchema = z.array(
  z.object({
    id: z.number().min(1, "ID is required"),
    order: z.number().int(),
  })
);

export type CreateTeamMemberRequest = z.infer<
  typeof createTeamMemberRequestSchema
>;
export type EditTeamMemberRequest = z.infer<typeof editTeamMemberRequestSchema>;
export type ReorderTeamMembersRequest = z.infer<
  typeof reorderTeamMembersRequestSchema
>;
