import type {
  Figure,
  CreateFigureRequest,
  EditFigureRequest,
  ReorderFiguresRequest,
} from "@lafineequipe/types";
import {
  createFigureRequestSchema,
  editFigureRequestSchema,
  reorderFiguresRequestSchema,
} from "@lafineequipe/types";

import getAuthHeaders from "../utils/getAuthHeadears";
import { handleApiError, formatZodError } from "../utils/apiError";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function postFigure(figure: CreateFigureRequest): Promise<Figure> {
  const result = createFigureRequestSchema.safeParse(figure);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/figures`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });
  if (!response.ok) {
    await handleApiError(response);
  }
  const figureCreated = await response.json();
  return figureCreated.data;
}

export async function editFigure(
  figureData: EditFigureRequest
): Promise<Figure> {
  const result = editFigureRequestSchema.safeParse(figureData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/figures/${figureData.id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });
  if (!response.ok) {
    await handleApiError(response);
  }
  const figureEdited = await response.json();
  return figureEdited.data;
}

export async function getAllFigures(): Promise<Figure[]> {
  const response = await fetch(`${API_URL}/api/figures`);
  if (!response.ok) {
    await handleApiError(response);
  }
  const result = await response.json();
  return result.data;
}

export async function reorderFigures(
  reorderData: ReorderFiguresRequest
): Promise<void> {
  const result = reorderFiguresRequestSchema.safeParse(reorderData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/figures/reorder`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });
  if (!response.ok) {
    await handleApiError(response);
  }
}

export async function deleteFigure(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/figures/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    await handleApiError(response);
  }
}
