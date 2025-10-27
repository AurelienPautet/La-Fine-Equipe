import { Router } from "express";
import {
  getAllEvents,
  createEvents,
  getEventsBySlug,
  getLatestsEvents,
  editEvents,
  deleteEvent,
} from "../controllers/eventController";

const router = Router();

router.get("/", getAllEvents);
router.get("/latests", getLatestsEvents);
router.post("/", createEvents);
router.get("/:slug", getEventsBySlug);
router.put("/:id", editEvents);
router.delete("/:id", deleteEvent);

export default router;
