const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

import type {
  Reservation,
  CreateReservationRequest,
} from "@lafineequipe/types";

import { createReservationSchema } from "@lafineequipe/types";
import getAuthHeaders from "../utils/getAuthHeadears";

export async function postReservation(
  data: CreateReservationRequest
): Promise<Reservation> {
  const validateData = createReservationSchema.parse(data);
  const response = await fetch(`${API_URL}/api/reservations`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(validateData),
  });
  if (!response.ok) {
    throw new Error("Failed to create reservation");
  }
  const reservation = await response.json();
  return reservation;
}

export async function getReservationsForEvent(
  slug: string
): Promise<Reservation[]> {
  const response = await fetch(`${API_URL}/api/reservations/event/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch reservations");
  }
  const reservations = await response.json();
  return reservations;
}

export async function deleteReservationMutation(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/reservations/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete reservation");
  }
}
