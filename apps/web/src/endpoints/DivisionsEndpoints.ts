import type {
  Division,
  CreateDivisionRequest,
  ReorderDivisionsRequest,
  EditDivisionRequest,
} from "@lafineequipe/types";

import {
  createDivisionRequestSchema,
  reorderDivisionsRequestSchema,
  editDivisionRequestSchema,
} from "@lafineequipe/types";

import getAuthHeaders from "../utils/getAuthHeadears";
import { handleApiError, formatZodError } from "../utils/apiError";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getAllDivisions(): Promise<Division[]> {
  const response = await fetch(`${API_URL}/api/divisions`);
  if (!response.ok) {
    await handleApiError(response);
  }
  const result = await response.json();
  return result.data;
}

export async function postDivision(
  division: CreateDivisionRequest
): Promise<Division> {
  const result = createDivisionRequestSchema.safeParse(division);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }

  const response = await fetch(`${API_URL}/api/divisions`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });
  if (!response.ok) {
    await handleApiError(response);
  }
  const divisionCreated = await response.json();
  return divisionCreated.data;
}

export async function editDivision(
  divisionData: EditDivisionRequest
): Promise<Division> {
  const result = editDivisionRequestSchema.safeParse(divisionData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/divisions/${divisionData.id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });
  if (!response.ok) {
    await handleApiError(response);
  }
  const divisionUpdated = await response.json();
  return divisionUpdated.data;
}

export async function reorderDivisions(
  reorderData: ReorderDivisionsRequest
): Promise<Division[]> {
  const result = reorderDivisionsRequestSchema.safeParse(reorderData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/divisions/reorder`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });
  if (!response.ok) {
    await handleApiError(response);
  }
  const divisionsReordered = await response.json();
  return divisionsReordered.data;
}

export async function deleteDivision(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/divisions/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    await handleApiError(response);
  }
}
