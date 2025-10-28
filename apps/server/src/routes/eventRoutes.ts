import { Router } from "express";
import {
  getAllEvents,
  createEvents,
  getEventsBySlug,
  getLatestsEvents,
  editEvents,
  deleteEvent,
} from "../controllers/eventController";

import { verifyToken } from "../controllers/authController";
const router = Router();

router.get("/", getAllEvents);
router.get("/latests", getLatestsEvents);
router.get("/:slug", getEventsBySlug);

router.post("/", verifyToken, createEvents);
router.put("/:id", verifyToken, editEvents);
router.delete("/:id", verifyToken, deleteEvent);

export default router;
