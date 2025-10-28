import { Router } from "express";
import {
  getAllRegulations,
  createRegulation,
  getRegulationBySlug,
  getLatestRegulations,
  editRegulation,
  deleteRegulation,
} from "../controllers/regulationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllRegulations);
router.get("/latest", getLatestRegulations);
router.get("/:slug", getRegulationBySlug);

router.post("/", authMiddleware, createRegulation);
router.put("/:id", authMiddleware, editRegulation);
router.delete("/:id", authMiddleware, deleteRegulation);

export default router;
