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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function postFigure(figure: CreateFigureRequest): Promise<Figure> {
  const validateData = createFigureRequestSchema.parse(figure);
  if (!validateData) {
    throw new Error("Invalid figure data");
  }
  const response = await fetch(`${API_URL}/api/figures`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(validateData),
  });
  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to create figure", {
      cause: response,
    });
  }
  const figureCreated = await response.json();
  return figureCreated.data;
}

export async function editFigure(
  figureData: EditFigureRequest
): Promise<Figure> {
  const validateData = editFigureRequestSchema.parse(figureData);
  const response = await fetch(`${API_URL}/api/figures/${figureData.id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(validateData),
  });
  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to edit figure", {
      cause: response,
    });
  }
  const figureEdited = await response.json();
  return figureEdited.data;
}

export async function getAllFigures(): Promise<Figure[]> {
  const response = await fetch(`${API_URL}/api/figures`);
  if (!response.ok) {
    throw new Error("Failed to fetch figures");
  }
  const result = await response.json();
  return result.data;
}

export async function reorderFigures(
  reorderData: ReorderFiguresRequest
): Promise<void> {
  const validateData = reorderFiguresRequestSchema.parse(reorderData);
  const response = await fetch(`${API_URL}/api/figures/reorder`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(validateData),
  });
  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to reorder figures", {
      cause: response,
    });
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
    throw new Error("Failed to delete figure");
  }
}
