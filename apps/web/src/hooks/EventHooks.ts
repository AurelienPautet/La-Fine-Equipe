import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  postEventsMutation,
  getEvent,
  getLatestsEvents,
  getEvents,
  editEventsMutation,
} from "../endpoints/EventsEnpoints";
import type { EventsWithTags } from "@lafineequipe/types";

export const useEvents = () => {
  return useQuery<EventsWithTags[], Error>({
    queryKey: ["events"],
    queryFn: () => getEvents(),
  });
};

export const useEvent = (slug: string) => {
  return useQuery<EventsWithTags, Error>({
    queryKey: ["events", slug],
    queryFn: () => getEvent(slug),
  });
};

export const useLatestsEvents = () => {
  return useQuery<EventsWithTags[], Error>({
    queryKey: ["latests-events"],
    queryFn: () => getLatestsEvents(),
  });
};

export const usePostEvents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postEventsMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
  });
};

export const useEditEvents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editEventsMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
  });
};
