import Router from "express";

import {
  createDivision,
  editDivision,
  reorderDivisions,
  getDivisions,
  deleteDivision,
} from "../controllers/divisionController";

import { authMiddleware } from "src/middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createDivision);
router.put("/:id", authMiddleware, editDivision);
router.put("/reorder", authMiddleware, reorderDivisions);
router.delete("/:id", authMiddleware, deleteDivision);
router.get("/", getDivisions);

export default router;
