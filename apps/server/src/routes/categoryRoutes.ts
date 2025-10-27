import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  reorderCategories,
  editCategory,
  deleteCategory,
} from "../controllers/categoryController";

const router = Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.put("/reorder", reorderCategories);
router.get("/:id", getCategoryById);
router.put("/:id", editCategory);
router.delete("/:id", deleteCategory);

export default router;
