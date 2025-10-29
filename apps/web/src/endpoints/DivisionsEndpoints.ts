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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getAllDivisions(): Promise<Division[]> {
  const response = await fetch(`${API_URL}/api/divisions`);
  if (!response.ok) {
    throw new Error("Failed to fetch divisions");
  }
  return response.json();
}

export async function postDivision(
  division: CreateDivisionRequest
): Promise<Division> {
  const validateData = createDivisionRequestSchema.parse(division);

  if (!validateData) {
    throw new Error("Invalid division data");
  }

  const response = await fetch(`${API_URL}/api/divisions`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(validateData),
  });
  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to create division", {
      cause: response,
    });
  }
  const divisionCreated = await response.json();
  return divisionCreated.data;
}

export async function editDivision(
  divisionData: EditDivisionRequest
): Promise<Division> {
  const validateData = editDivisionRequestSchema.parse(divisionData);
  const response = await fetch(`${API_URL}/api/divisions/${divisionData.id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(validateData),
  });
  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to update division", {
      cause: response,
    });
  }
  const divisionUpdated = await response.json();
  return divisionUpdated.data;
}

export async function reorderDivisions(
  reorderData: ReorderDivisionsRequest
): Promise<Division[]> {
  const validateData = reorderDivisionsRequestSchema.parse(reorderData);
  const response = await fetch(`${API_URL}/api/divisions/reorder`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(validateData),
  });
  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to reorder divisions", {
      cause: response,
    });
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
    console.error("Response:", response);
    throw new Error("Failed to delete division", {
      cause: response,
    });
  }
  return;
}
