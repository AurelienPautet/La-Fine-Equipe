import { Request, Response } from "express";
import { db } from "@lafineequipe/db";
import { eq, asc, isNull, sql } from "drizzle-orm";
import {
  createDivisionRequestSchema,
  editDivisionRequestSchema,
  reorderDivisionsRequestSchema,
} from "@lafineequipe/types";

import { divisions } from "@lafineequipe/db/src/schema";

export const createDivision = async (req: Request, res: Response) => {
  try {
    const validatedData = createDivisionRequestSchema.parse(req.body);
    const { name, color, titleSchema } = validatedData;
    const result = await db.execute(sql`
      INSERT INTO ${divisions} (name, color, title_schema, "order")
      VALUES (${name}, ${color}, ${titleSchema}, (SELECT COALESCE(MAX("order"), 0) + 1 FROM ${divisions}))
      RETURNING *
    `);
    const division = result.rows[0];
    res.status(201).json({ success: true, data: division });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res
      .status(500)
      .json({ success: false, error: "Failed to create division" });
  }
};

export const editDivision = async (req: Request, res: Response) => {
  try {
    const validatedData = editDivisionRequestSchema.parse(req.body);
    const { id, name, color, titleSchema } = validatedData;
    const [division] = await db
      .update(divisions)
      .set({ name, color, titleSchema })
      .where(eq(divisions.id, id))
      .returning();
    res.status(200).json({ success: true, data: division });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res.status(500).json({ success: false, error: "Failed to edit division" });
  }
};

export const reorderDivisions = async (req: Request, res: Response) => {
  try {
    const validatedData = reorderDivisionsRequestSchema.parse(req.body);
    const array: { id: number; order: number }[] = validatedData;
    for (const { id, order } of array) {
      await db
        .update(divisions)
        .set({ order })
        .where(eq(divisions.id, id))
        .returning();
    }
    res.status(200).json({ success: true });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res
      .status(500)
      .json({ success: false, error: "Failed to reorder divisions" });
  }
};

export const getDivisions = async (_req: Request, res: Response) => {
  try {
    const divisionsList = await db
      .select()
      .from(divisions)
      .where(isNull(divisions.deletedAt))
      .orderBy(asc(divisions.order))
      .execute();
    res.status(200).json({ success: true, data: divisionsList });
  } catch (error) {
    console.error("Error fetching divisions:", error);
    res.status(500).json({ success: false, error: error });
  }
};

export const deleteDivision = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const divisionId = parseInt(id, 10);
    if (isNaN(divisionId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid division ID" });
    }
    await db
      .update(divisions)
      .set({ deletedAt: new Date() })
      .where(eq(divisions.id, divisionId))
      .returning();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting division:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to delete division" });
  }
};
