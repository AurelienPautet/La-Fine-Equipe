import { Request, Response } from "express";
import { db } from "@lafineequipe/db";
import { eq, isNull, asc, sql } from "drizzle-orm";

import {
  createHomeSectionRequestSchema,
  editHomeSectionRequestSchema,
  reorderHomeSectionsRequestSchema,
} from "@lafineequipe/types";
import { homeSections } from "@lafineequipe/db/src/schema";

export const createHomeSection = async (req: Request, res: Response) => {
  try {
    const validatedData = createHomeSectionRequestSchema.parse(req.body);
    const { title, content, buttonLabel, buttonLink, imageUrl, isVisible } =
      validatedData;

    const maxOrderResult = await db
      .select({ maxOrder: sql<number>`COALESCE(MAX("order"), 0)` })
      .from(homeSections);
    const nextOrder = (maxOrderResult[0]?.maxOrder ?? 0) + 1;

    const [homeSectionData] = await db
      .insert(homeSections)
      .values({
        title,
        content,
        buttonLabel: buttonLabel || null,
        buttonLink: buttonLink || null,
        imageUrl: imageUrl || null,
        isVisible,
        order: nextOrder,
      })
      .returning();

    res.status(201).json({ success: true, data: homeSectionData });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    console.error("Error creating home section:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to create home section" });
  }
};

export const editHomeSection = async (req: Request, res: Response) => {
  try {
    const validatedData = editHomeSectionRequestSchema.parse(req.body);
    const { id, title, content, buttonLabel, buttonLink, imageUrl, isVisible } =
      validatedData;

    const updateData = {
      title,
      content,
      buttonLabel: buttonLabel || null,
      buttonLink: buttonLink || null,
      imageUrl: imageUrl || null,
      isVisible,
    };

    const [homeSectionData] = await db
      .update(homeSections)
      .set(updateData)
      .where(eq(homeSections.id, id))
      .returning();

    res.status(200).json({ success: true, data: homeSectionData });
  } catch (error: unknown) {
    console.error("Error editing home section:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res
      .status(500)
      .json({ success: false, error: "Failed to edit home section" });
  }
};

export const reorderHomeSections = async (req: Request, res: Response) => {
  try {
    const validatedData = reorderHomeSectionsRequestSchema.parse(req.body);
    const array: { id: number; order: number }[] = validatedData;
    for (const { id, order } of array) {
      await db
        .update(homeSections)
        .set({ order })
        .where(eq(homeSections.id, id))
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
      .json({ success: false, error: "Failed to reorder home sections" });
  }
};

export const getHomeSections = async (_req: Request, res: Response) => {
  try {
    const homeSectionsData = await db
      .select()
      .from(homeSections)
      .where(isNull(homeSections.deletedAt))
      .orderBy(asc(homeSections.order))
      .execute();

    res.status(200).json({ success: true, data: homeSectionsData });
  } catch (error) {
    console.error("Error fetching home sections:", error);
    res.status(500).json({ success: false, error: error });
  }
};

export const getVisibleHomeSections = async (_req: Request, res: Response) => {
  try {
    const homeSectionsData = await db
      .select()
      .from(homeSections)
      .where(eq(homeSections.isVisible, true))
      .orderBy(asc(homeSections.order))
      .execute();

    res.status(200).json({ success: true, data: homeSectionsData });
  } catch (error) {
    console.error("Error fetching visible home sections:", error);
    res.status(500).json({ success: false, error: error });
  }
};

export const deleteHomeSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const homeSectionId = parseInt(id, 10);

    if (isNaN(homeSectionId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid home section ID" });
    }

    await db
      .delete(homeSections)
      .where(eq(homeSections.id, homeSectionId))
      .execute();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting home section:", error);
    res.status(500).json({ success: false, error: error });
  }
};
