import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  reorderCategories,
  editCategory,
  deleteCategory,
} from "../controllers/categoryController";

import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);

router.post("/", authMiddleware, createCategory);
router.put("/reorder", authMiddleware, reorderCategories);
router.put("/:id", authMiddleware, editCategory);
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
