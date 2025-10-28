import Router from "express";

import {
  createReservation,
  getReservationsForEvent,
  deleteReservation,
} from "../controllers/reservationController";
import { verifyToken } from "../controllers/authController";
const router = Router();

router.post("/", createReservation);
router.get("/event/:slug", getReservationsForEvent);

router.delete("/:id", verifyToken, deleteReservation);

export default router;
