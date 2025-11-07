import Router from "express";

import {
  createHomeSection,
  editHomeSection,
  reorderHomeSections,
  deleteHomeSection,
  getHomeSections,
  getVisibleHomeSections,
} from "../controllers/homeSectionController.js";

import { authMiddleware } from "src/middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createHomeSection);
router.put("/reorder", authMiddleware, reorderHomeSections);
router.put("/:id", authMiddleware, editHomeSection);
router.delete("/:id", authMiddleware, deleteHomeSection);
router.get("/", getHomeSections);
router.get("/visible", getVisibleHomeSections);

export default router;
