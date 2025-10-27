import type {
  CreateEventsRequest,
  EventsWithTags,
  EditEventsRequest,
} from "@lafineequipe/types";

import {
  createEventsRequestSchema,
  editEventsRequestSchema,
} from "@lafineequipe/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getEvents(): Promise<EventsWithTags[]> {
  const response = await fetch(`${API_URL}/api/events`);

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const events = await response.json();
  return events.data;
}

export async function getEvent(slug: string): Promise<EventsWithTags> {
  const response = await fetch(`${API_URL}/api/events/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const events = await response.json();
  return events.data;
}

export async function getLatestsEvents(): Promise<EventsWithTags[]> {
  const response = await fetch(`${API_URL}/api/events/latests`);

  if (!response.ok) {
    throw new Error("Failed to fetch latests events");
  }

  const events = await response.json();
  return events.data;
}

export async function postEventsMutation(
  eventsData: CreateEventsRequest
): Promise<EventsWithTags> {
  const validateData = createEventsRequestSchema.parse(eventsData);
  const response = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validateData),
  });

  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to create events" + response, { cause: response });
  }

  const events = await response.json();
  return events;
}

export async function editEventsMutation({
  eventsData,
}: {
  eventsData: EditEventsRequest;
}): Promise<EventsWithTags> {
  const validateData = editEventsRequestSchema.parse(eventsData);
  const response = await fetch(`${API_URL}/api/events/${eventsData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validateData),
  });

  if (!response.ok) {
    throw new Error("Failed to edit events");
  }

  const events = await response.json();
  return events.data;
}

export async function deleteEventMutation(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/events/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete event");
  }
}
