import type { Message } from "@lafineequipe/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function postChatMessage(
  messages: Message[],
  onChunk: (chunk: string, type: string) => void
): Promise<boolean> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to send chat message");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  let done = false;
  while (!done) {
    const chunk = await reader.read();
    done = chunk.done;
    if (done) break;

    buffer += decoder.decode(chunk.value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue; // Skip empty lines

      try {
        const data = JSON.parse(trimmedLine);
        if (data.error) {
          throw new Error(data.error);
        }
        if (data.chunk) onChunk(data.chunk, data.type || "content");
        if (data.done) done = true;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message !== "Unexpected end of JSON input"
        ) {
          console.error("Error parsing SSE data:", error, "Line:", trimmedLine);
          throw error;
        }
      }
    }
  }

  return true;
}
