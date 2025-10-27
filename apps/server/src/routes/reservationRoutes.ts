import Router from "express";

import {
  createReservation,
  getReservationsForEvent,
} from "../controllers/reservationController";
const router = Router();
router.post("/", createReservation);
router.get("/event/:slug", getReservationsForEvent);

export default router;
