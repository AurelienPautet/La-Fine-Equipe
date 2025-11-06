import Router from "express";

import {
  createFigure,
  editFigure,
  reorderFigures,
  deleteFigure,
  getFigures,
} from "../controllers/figureController.js";

import { authMiddleware } from "src/middleware/authMiddleware.js";
const router = Router();
router.post("/", authMiddleware, createFigure);
router.put("/reorder", authMiddleware, reorderFigures);
router.put("/:id", authMiddleware, editFigure);
router.delete("/:id", authMiddleware, deleteFigure);
router.get("/", getFigures);

export default router;
