import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  reorderCategories,
  editCategory,
  deleteCategory,
} from "../controllers/categoryController";

import { verifyToken } from "../controllers/authController";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);

router.post("/", verifyToken, createCategory);
router.put("/reorder", verifyToken, reorderCategories);
router.put("/:id", verifyToken, editCategory);
router.delete("/:id", verifyToken, deleteCategory);

export default router;
