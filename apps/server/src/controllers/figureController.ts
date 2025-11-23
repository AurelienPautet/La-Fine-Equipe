import { Request, Response } from "express";
import { db } from "@lafineequipe/db";
import { eq, asc, isNull, sql } from "drizzle-orm";

import {
  createFigureRequestSchema,
  editFigureRequestSchema,
  reorderFiguresRequestSchema,
} from "@lafineequipe/types";
import { figures } from "@lafineequipe/db/src/schema";
import {
  syncFigureToVectorStore,
  deleteFromVectorStore,
} from "../services/vectorDbService";

export const createFigure = async (req: Request, res: Response) => {
  try {
    const validatedData = createFigureRequestSchema.parse(req.body);
    const { figure, description, icon } = validatedData;
    const result = await db.execute(sql`
        INSERT INTO ${figures} (figure, description, icon, "order")
        VALUES (${figure}, ${description}, ${icon}, (SELECT COALESCE(MAX("order"), 0) + 1 FROM ${figures}))
        RETURNING *
      `);
    const figureData = result.rows[0] as any;

    await syncFigureToVectorStore({
      id: figureData.id,
      figure: figureData.figure,
      description: figureData.description,
    });

    res.status(201).json({ success: true, data: figureData });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res.status(500).json({ success: false, error: "Failed to create figure" });
  }
};

export const editFigure = async (req: Request, res: Response) => {
  try {
    const validatedData = editFigureRequestSchema.parse(req.body);
    const { id, figure, description, icon } = validatedData;

    const updateData = {
      figure,
      description,
      icon,
    };
    const [figureData] = await db
      .update(figures)
      .set(updateData)
      .where(eq(figures.id, id))
      .returning();

    await syncFigureToVectorStore({
      id: figureData.id,
      figure: figureData.figure,
      description: figureData.description,
    });

    res.status(200).json({ success: true, data: figureData });
  } catch (error: unknown) {
    console.error("Error editing figure:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res.status(500).json({ success: false, error: "Failed to edit figure" });
  }
};

export const reorderFigures = async (req: Request, res: Response) => {
  try {
    const validatedData = reorderFiguresRequestSchema.parse(req.body);
    const array: { id: number; order: number }[] = validatedData;
    for (const { id, order } of array) {
      await db
        .update(figures)
        .set({ order })
        .where(eq(figures.id, id))
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
      .json({ success: false, error: "Failed to reorder figures" });
  }
};

export const getFigures = async (_req: Request, res: Response) => {
  try {
    const figuresData = await db
      .select()
      .from(figures)
      .where(isNull(figures.deletedAt))
      .orderBy(asc(figures.order))
      .execute();
    res.status(200).json({ success: true, data: figuresData });
  } catch (error) {
    console.error("Error fetching figures:", error);
    res.status(500).json({ success: false, error: error });
  }
};

export const deleteFigure = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const figureId = parseInt(id, 10);
    if (isNaN(figureId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid figure ID" });
    }
    await db.delete(figures).where(eq(figures.id, figureId)).execute();

    await deleteFromVectorStore("figures", figureId);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting figure:", error);
    res.status(500).json({ success: false, error: error });
  }
};
