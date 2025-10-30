import { Request, Response } from "express";
import { db } from "@lafineequipe/db";
import { eq, asc, isNull, sql } from "drizzle-orm";

import {
  createTeamMemberRequestSchema,
  editTeamMemberRequestSchema,
  reorderTeamMembersRequestSchema,
} from "@lafineequipe/types";
import { teamMembers } from "@lafineequipe/db/src/schema";

export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const validatedData = createTeamMemberRequestSchema.parse(req.body);
    const { firstName, lastName, role, photoUrl, divisionId, isActive } =
      validatedData;
    const email = validatedData.email ?? null;
    const result = await db.execute(sql`
        INSERT INTO ${teamMembers} (first_name, last_name, role, email, photo_url, division_id, "order", is_active)
        VALUES (${firstName}, ${lastName}, ${role}, ${email}, ${photoUrl}, ${divisionId}, (SELECT COALESCE(MAX("order"), 0) + 1 FROM ${teamMembers}), ${isActive})
        RETURNING *
      `);
    const teamMember = result.rows[0];
    res.status(201).json({ success: true, data: teamMember });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res
      .status(500)
      .json({ success: false, error: "Failed to create team member" });
  }
};

export const editTeamMember = async (req: Request, res: Response) => {
  try {
    const validatedData = editTeamMemberRequestSchema.parse(req.body);
    const {
      id,
      firstName,
      lastName,
      role,
      email,
      photoUrl,
      divisionId,
      isActive,
    } = validatedData;

    const updateData = {
      firstName,
      lastName,
      role,
      email: email ?? null,
      photoUrl,
      divisionId,
      isActive,
    };
    const [teamMember] = await db
      .update(teamMembers)
      .set(updateData)
      .where(eq(teamMembers.id, id))
      .returning();
    res.status(200).json({ success: true, data: teamMember });
  } catch (error: unknown) {
    console.error("Error editing team member:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res
      .status(500)
      .json({ success: false, error: "Failed to edit team member" });
  }
};
export const reorderTeamMembers = async (req: Request, res: Response) => {
  try {
    const validatedData = reorderTeamMembersRequestSchema.parse(req.body);
    const array: { id: number; order: number }[] = validatedData;
    for (const { id, order } of array) {
      await db
        .update(teamMembers)
        .set({ order })
        .where(eq(teamMembers.id, id))
        .execute();
    }
    res.status(200).json({ success: true });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res
      .status(500)
      .json({ success: false, error: "Failed to reorder team members" });
  }
};

export const getTeamMembers = async (_req: Request, res: Response) => {
  try {
    const members = await db
      .select()
      .from(teamMembers)
      .where(isNull(teamMembers.deletedAt))
      .orderBy(asc(teamMembers.order))
      .execute();
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ success: false, error: error });
  }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teamMemberId = parseInt(id, 10);
    if (isNaN(teamMemberId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid team member ID" });
    }
    await db
      .delete(teamMembers)
      .where(eq(teamMembers.id, teamMemberId))
      .execute();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ success: false, error: error });
  }
};
