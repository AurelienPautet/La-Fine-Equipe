import type {
  CreateRegulationRequest,
  Regulation,
  EditRegulationRequest,
} from "@lafineequipe/types";

import {
  createRegulationRequestSchema,
  editRegulationRequestSchema,
} from "@lafineequipe/types";
import getAuthHeaders from "../utils/getAuthHeadears";
import { handleApiError, formatZodError } from "../utils/apiError";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getRegulations(): Promise<Regulation[]> {
  const response = await fetch(`${API_URL}/api/regulations`);

  if (!response.ok) {
    await handleApiError(response);
  }

  const regulations = await response.json();
  return regulations.data;
}

export async function getRegulation(slug: string): Promise<Regulation> {
  const response = await fetch(`${API_URL}/api/regulations/${slug}`);

  if (!response.ok) {
    await handleApiError(response);
  }

  const regulation = await response.json();
  return regulation.data;
}

export async function getLatestRegulations(): Promise<Regulation[]> {
  const response = await fetch(`${API_URL}/api/regulations/latest`);

  if (!response.ok) {
    await handleApiError(response);
  }

  const regulations = await response.json();
  return regulations.data;
}

export async function postRegulationMutation(
  regulationData: CreateRegulationRequest
): Promise<Regulation> {
  const result = createRegulationRequestSchema.safeParse(regulationData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/regulations`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  const regulation = await response.json();
  return regulation;
}

export async function editRegulationMutation({
  regulationData,
}: {
  regulationData: EditRegulationRequest;
}): Promise<Regulation> {
  const result = editRegulationRequestSchema.safeParse(regulationData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(
    `${API_URL}/api/regulations/${regulationData.id}`,
    {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
      },
      body: JSON.stringify(result.data),
    }
  );

  if (!response.ok) {
    await handleApiError(response);
  }

  const regulation = await response.json();
  return regulation.data;
}

export async function deleteRegulationMutation(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/regulations/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
    method: "DELETE",
  });

  if (!response.ok) {
    await handleApiError(response);
  }
}
