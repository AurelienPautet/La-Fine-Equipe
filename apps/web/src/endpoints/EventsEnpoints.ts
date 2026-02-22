import type {
  CreateEventsRequest,
  EventsWithTags,
  EditEventsRequest,
} from "@lafineequipe/types";

import {
  createEventsRequestSchema,
  editEventsRequestSchema,
} from "@lafineequipe/types";
import getAuthHeaders from "../utils/getAuthHeadears";
import { handleApiError, formatZodError } from "../utils/apiError";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getEvents(): Promise<EventsWithTags[]> {
  const response = await fetch(`${API_URL}/api/events`);

  if (!response.ok) {
    await handleApiError(response);
  }

  const events = await response.json();
  return events.data;
}

export async function getEvent(slug: string): Promise<EventsWithTags> {
  const response = await fetch(`${API_URL}/api/events/${slug}`);

  if (!response.ok) {
    await handleApiError(response);
  }

  const events = await response.json();
  return events.data;
}

export async function getLatestsEvents(): Promise<EventsWithTags[]> {
  const response = await fetch(`${API_URL}/api/events/latests`);

  if (!response.ok) {
    await handleApiError(response);
  }

  const events = await response.json();
  return events.data;
}

export async function getMemorableEvents(): Promise<EventsWithTags[]> {
  const response = await fetch(`${API_URL}/api/events/memorable`);
  if (!response.ok) {
    await handleApiError(response);
  }
  const events = await response.json();
  return events.data;
}

export async function changeEventMemorabilityMutation({
  id,
  memorable,
}: {
  id: number;
  memorable: boolean;
}): Promise<EventsWithTags> {
  const response = await fetch(`${API_URL}/api/events/${id}/memorable`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ memorable }),
  });
  if (!response.ok) {
    await handleApiError(response);
  }
  const events = await response.json();
  return events.data;
}

export async function postEventsMutation(
  eventsData: CreateEventsRequest
): Promise<EventsWithTags> {
  const result = createEventsRequestSchema.safeParse(eventsData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  const events = await response.json();
  return events;
}

export async function editEventsMutation({
  eventsData,
}: {
  eventsData: EditEventsRequest;
}): Promise<EventsWithTags> {
  const result = editEventsRequestSchema.safeParse(eventsData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/events/${eventsData.id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  const events = await response.json();
  return events.data;
}

export async function deleteEventMutation(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/events/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    await handleApiError(response);
  }
}

