import { Request, Response } from "express";
import { db } from "@lafineequipe/db";
import { tags } from "@lafineequipe/db/src/schema";
import { createTagRequestSchema } from "@lafineequipe/types";
import { eq, isNull } from "drizzle-orm";

export const createTag = async (req: Request, res: Response) => {
  try {
    const validatedData = createTagRequestSchema.parse(req.body);

    const { name } = validatedData;
    const [tag] = await db.insert(tags).values({ name }).returning().execute();

    res.status(201).json({ success: true, data: tag });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: "Failed to create tag" });
  }
};

export const getTags = async (req: Request, res: Response) => {
  try {
    const tagsList = await db
      .select()
      .from(tags)
      .where(isNull(tags.deletedAt))
      .execute();
    res.status(200).json({ success: true, data: tagsList });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch tags" });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [deletedTag] = await db
      .update(tags)
      .set({ deletedAt: new Date() })
      .where(eq(tags.id, Number(id)))
      .returning()
      .execute();

    if (!deletedTag) {
      return res.status(404).json({ success: false, error: "Tag not found" });
    }

    res.json({ success: true, data: deletedTag });
  } catch {
    res.status(500).json({ success: false, error: "Failed to delete tag" });
  }
};
