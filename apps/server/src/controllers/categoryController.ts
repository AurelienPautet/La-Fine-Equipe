import { Request, Response } from "express";
import { db } from "@lafineequipe/db";
import { regulationsCategories } from "@lafineequipe/db/src/schema";
import {
  createCategoryRequestSchema,
  reorderCategoriesRequestSchema,
} from "@lafineequipe/types";
import { eq, max } from "drizzle-orm";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const validatedData = createCategoryRequestSchema.parse(req.body);

    const { name, titleSchema, abbreviation } = validatedData;

    const maxOrderResult = await db
      .select({ maxOrder: max(regulationsCategories.order) })
      .from(regulationsCategories)
      .execute();

    const maxOrder = maxOrderResult[0]?.maxOrder ?? 0;
    const newOrder = (maxOrder ?? 0) + 1;

    const [category] = await db
      .insert(regulationsCategories)
      .values({ name, titleSchema, abbreviation, order: newOrder })
      .returning()
      .execute();

    res.status(201).json({ success: true, data: category });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res
      .status(500)
      .json({ success: false, error: "Failed to create category" });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categoriesList = await db
      .select()
      .from(regulationsCategories)
      .orderBy(regulationsCategories.order)
      .execute();
    res.status(200).json({ success: true, data: categoriesList });
  } catch {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch categories" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category ID" });
    }

    const [category] = await db
      .select()
      .from(regulationsCategories)
      .where(eq(regulationsCategories.id, categoryId))
      .execute();

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    res.status(200).json({ success: true, data: category });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch category" });
  }
};

export const reorderCategories = async (req: Request, res: Response) => {
  try {
    const categoriesArray = req.body;

    console.log("Reorder request received:", JSON.stringify(categoriesArray));

    const updatedCategories = [];

    for (const item of categoriesArray) {
      try {
        reorderCategoriesRequestSchema.parse(item);
      } catch (validationError) {
        console.error("Validation error for item:", item, validationError);
        throw validationError;
      }

      console.log(`Updating category ${item.id} to order ${item.order}`);

      const [category] = await db
        .update(regulationsCategories)
        .set({ order: item.order })
        .where(eq(regulationsCategories.id, item.id))
        .returning()
        .execute();

      if (category) {
        updatedCategories.push(category);
      }
    }
    res.status(200).json({ success: true, data: updatedCategories });
  } catch (error: unknown) {
    console.error("Error in reorderCategories:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      console.error("ZodError details:", err.errors);
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res
      .status(500)
      .json({ success: false, error: "Failed to reorder categories" });
  }
};

export const editCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category ID" });
    }

    const validatedData = createCategoryRequestSchema.parse(req.body);
    const { name, titleSchema, abbreviation } = validatedData;

    const [category] = await db
      .update(regulationsCategories)
      .set({ name, titleSchema, abbreviation })
      .where(eq(regulationsCategories.id, categoryId))
      .returning()
      .execute();

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res.status(500).json({ success: false, error: "Failed to edit category" });
  }
};
