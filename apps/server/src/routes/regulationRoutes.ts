import { Router } from "express";
import {
  getAllRegulations,
  createRegulation,
  getRegulationBySlug,
  getLatestRegulations,
  editRegulation,
  deleteRegulation,
} from "../controllers/regulationController";
import { verifyToken } from "../controllers/authController";

const router = Router();

router.get("/", getAllRegulations);
router.get("/latest", getLatestRegulations);
router.get("/:slug", getRegulationBySlug);

router.post("/", verifyToken, createRegulation);
router.put("/:id", verifyToken, editRegulation);
router.delete("/:id", verifyToken, deleteRegulation);

export default router;
