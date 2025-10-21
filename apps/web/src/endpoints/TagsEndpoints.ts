const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

import type { Tag } from "@lafineequipe/types";

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
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to create tag");
  }

  const tag = await response.json();
  return tag.data;
}
