import { Router } from "express";
import {
  getAllEvents,
  createEvents,
  getEventsBySlug,
  getLatestsEvents,
  editEvents,
  deleteEvent,
  getMemorableEvents,
  changeEventMemorability,
} from "../controllers/eventController";

import { authMiddleware } from "../middleware/authMiddleware";
const router = Router();

router.get("/", getAllEvents);
router.get("/latests", getLatestsEvents);
router.get("/memorable", getMemorableEvents);
router.get("/:slug", getEventsBySlug);

router.post("/", authMiddleware, createEvents);
router.put("/:id", authMiddleware, editEvents);
router.delete("/:id", authMiddleware, deleteEvent);
router.put("/:id/memorable", authMiddleware, changeEventMemorability);

export default router;
