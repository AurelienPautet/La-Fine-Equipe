const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

import type { Tag } from "@lafineequipe/types";
import getAuthHeaders from "../utils/getAuthHeadears";

export async function getTags(): Promise<Tag[]> {
  const response = await fetch(`${API_URL}/api/tags`);

  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }

  const tags = await response.json();
  return tags.data;
}

export async function postTag(name: string): Promise<Tag> {
  const response = await fetch(`${API_URL}/api/tags`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to create tag");
  }

  const tag = await response.json();
  return tag.data;
}

export async function deleteTagMutation(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/tags/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete tag");
  }
}
