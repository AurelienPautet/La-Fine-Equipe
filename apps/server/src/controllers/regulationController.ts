import { Request, Response } from "express";
import { db } from "@lafineequipe/db";
import { regulations } from "@lafineequipe/db/src/schema";
import { createRegulationRequestSchema } from "@lafineequipe/types";
import { eq, desc, and, not } from "drizzle-orm";

export const getAllRegulations = async (_req: Request, res: Response) => {
  try {
    const allRegulations = await db
      .select()
      .from(regulations)
      .orderBy(desc(regulations.date))
      .execute();
    res.status(200).json({ success: true, data: allRegulations });
  } catch (error) {
    console.error("Error fetching regulations:", error);
    res.status(500).json({ success: false, error: error });
  }
};

export const getRegulationBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const [regulation] = await db
      .select()
      .from(regulations)
      .where(eq(regulations.slug, slug))
      .execute();

    if (!regulation) {
      return res
        .status(404)
        .json({ success: false, error: "Regulation not found" });
    }

    res.json({ success: true, data: regulation });
  } catch {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch regulation" });
  }
};

export const getLatestRegulations = async (req: Request, res: Response) => {
  try {
    const latestRegulations = await db
      .select()
      .from(regulations)
      .orderBy(desc(regulations.date))
      .limit(2)
      .execute();

    if (latestRegulations.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No regulations found" });
    }

    res.json({ success: true, data: latestRegulations });
  } catch {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch latest regulations" });
  }
};

export const createRegulation = async (req: Request, res: Response) => {
  try {
    const validatedData = createRegulationRequestSchema.parse(req.body);
    const { categoryId, title, content, description, date } = validatedData;
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    if (slug.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Titre invalide. Un titre doit contenir des caractères valides.",
      });
    }

    const existingRegulation = await db
      .select()
      .from(regulations)
      .where(eq(regulations.slug, slug))
      .execute();
    if (existingRegulation.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Slug already exists. Please choose a different title.",
      });
    }

    const [newRegulation] = await db
      .insert(regulations)
      .values({
        categoryId,
        title,
        content,
        description,
        slug,
        date,
      })
      .returning()
      .execute();

    res.status(201).json({ success: true, data: newRegulation });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create regulation",
      stack: error.stack,
    });
  }
};

export const editRegulation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = createRegulationRequestSchema.parse(req.body);
    const { categoryId, title, content, description, date } = validatedData;
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const existingRegulation = await db
      .select()
      .from(regulations)
      .where(
        and(eq(regulations.slug, slug), not(eq(regulations.id, Number(id))))
      )
      .execute();
    if (existingRegulation.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Slug already exists. Please choose a different title.",
      });
    }

    const [updatedRegulation] = await db
      .update(regulations)
      .set({
        categoryId,
        title,
        content,
        description,
        slug,
        date,
      })
      .where(eq(regulations.id, Number(id)))
      .returning()
      .execute();

    res.json({ success: true, data: updatedRegulation });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res
      .status(500)
      .json({ success: false, error: "Failed to edit regulation" });
  }
};
