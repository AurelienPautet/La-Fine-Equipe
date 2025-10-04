import { Request, Response } from "express";
import { db } from "@lafineequipe/db";
import { tags } from "@lafineequipe/db/src/schema";
import { createTagRequestSchema } from "@lafineequipe/types";

export const createTag = async (req: Request, res: Response) => {
  try {
    const validatedData = createTagRequestSchema.parse(req.body);
    
    const { name } = validatedData;
    const [tag] = await db.insert(tags).values({ name }).returning().execute();
    
    res.status(201).json({ success: true, data: tag });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: 'Failed to create tag' });
  }
};
