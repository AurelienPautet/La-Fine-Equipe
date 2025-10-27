import Router from "express";

import {
  createReservation,
  getReservationsForEvent,
  deleteReservation,
} from "../controllers/reservationController";
const router = Router();
router.post("/", createReservation);
router.get("/event/:slug", getReservationsForEvent);
router.delete("/:id", deleteReservation);

export default router;
