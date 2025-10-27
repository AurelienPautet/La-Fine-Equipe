import { Router } from "express";
import {
  getAllRegulations,
  createRegulation,
  getRegulationBySlug,
  getLatestRegulations,
  editRegulation,
} from "../controllers/regulationController";

const router = Router();

router.get("/", getAllRegulations);
router.get("/latest", getLatestRegulations);
router.post("/", createRegulation);
router.get("/:slug", getRegulationBySlug);
router.put("/:id", editRegulation);

export default router;
