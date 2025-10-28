import { Router } from "express";
import {
  getAllEvents,
  createEvents,
  getEventsBySlug,
  getLatestsEvents,
  editEvents,
  deleteEvent,
} from "../controllers/eventController";

import { authMiddleware } from "../middleware/authMiddleware";
const router = Router();

router.get("/", getAllEvents);
router.get("/latests", getLatestsEvents);
router.get("/:slug", getEventsBySlug);

router.post("/", authMiddleware, createEvents);
router.put("/:id", authMiddleware, editEvents);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;
