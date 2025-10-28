import Router from "express";

import {
  createReservation,
  getReservationsForEvent,
  deleteReservation,
} from "../controllers/reservationController";
import { authMiddleware } from "../middleware/authMiddleware";
const router = Router();

router.post("/", createReservation);
router.get("/event/:slug", getReservationsForEvent);

router.delete("/:id", authMiddleware, deleteReservation);

export default router;
