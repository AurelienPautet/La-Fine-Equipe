import { Router } from "express";
import {
  getAllRegulations,
  createRegulation,
  getRegulationBySlug,
  getLatestRegulations,
  editRegulation,
  deleteRegulation,
} from "../controllers/regulationController";

const router = Router();

router.get("/", getAllRegulations);
router.get("/latest", getLatestRegulations);
router.post("/", createRegulation);
router.get("/:slug", getRegulationBySlug);
router.put("/:id", editRegulation);
router.delete("/:id", deleteRegulation);

export default router;
