import { ZodError } from "zod";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function handleApiError(response: Response): Promise<never> {
  let message = `Erreur ${response.status}: ${response.statusText}`;

  try {
    const body = await response.json();

    if (body.error && typeof body.error === "string") {
      message = body.error;
    } else if (body.errors && Array.isArray(body.errors)) {
      message = body.errors
        .map(
          (e: { path?: string[]; message?: string }) =>
            `${e.path?.join(".") || "champ"}: ${e.message || "invalide"}`,
        )
        .join("\n");
    }
  } catch {}

  throw new ApiError(message, response.status);
}

export function formatZodError(error: ZodError): string {
  return error.errors
    .map(
      (e) => `${e.path.length > 0 ? e.path.join(".") + ": " : ""}${e.message}`,
    )
    .join("\n");
}
