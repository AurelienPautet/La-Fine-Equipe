import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  postReservation,
  getReservationsForEvent,
  deleteReservationMutation,
} from "../endpoints/ReservationEndpoints";
import type { Reservation } from "../../../../packages/types/src/reservation";

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useReservationsForEvent(slug: string) {
  return useQuery<Reservation[], Error>({
    queryKey: ["reservations", slug],
    queryFn: () => getReservationsForEvent(slug),
  });
}

export function useDeleteReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReservationMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}
