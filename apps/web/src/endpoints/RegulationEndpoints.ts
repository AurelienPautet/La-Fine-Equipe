import type {
  CreateRegulationRequest,
  Regulation,
  EditRegulationRequest,
} from "@lafineequipe/types";

import {
  createRegulationRequestSchema,
  editRegulationRequestSchema,
} from "@lafineequipe/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getRegulations(): Promise<Regulation[]> {
  const response = await fetch(`${API_URL}/api/regulations`);

  if (!response.ok) {
    throw new Error("Failed to fetch regulations");
  }

  const regulations = await response.json();
  return regulations.data;
}

export async function getRegulation(slug: string): Promise<Regulation> {
  const response = await fetch(`${API_URL}/api/regulations/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch regulation");
  }

  const regulation = await response.json();
  return regulation.data;
}

export async function getLatestRegulations(): Promise<Regulation[]> {
  const response = await fetch(`${API_URL}/api/regulations/latest`);

  if (!response.ok) {
    throw new Error("Failed to fetch latest regulations");
  }

  const regulations = await response.json();
  return regulations.data;
}

export async function postRegulationMutation(
  regulationData: CreateRegulationRequest
): Promise<Regulation> {
  const validateData = createRegulationRequestSchema.parse(regulationData);
  const response = await fetch(`${API_URL}/api/regulations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validateData),
  });

  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to create regulation" + response, {
      cause: response,
    });
  }

  const regulation = await response.json();
  return regulation;
}

export async function editRegulationMutation({
  regulationData,
}: {
  regulationData: EditRegulationRequest;
}): Promise<Regulation> {
  const validateData = editRegulationRequestSchema.parse(regulationData);
  const response = await fetch(
    `${API_URL}/api/regulations/${regulationData.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validateData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to edit regulation");
  }

  const regulation = await response.json();
  return regulation.data;
}

export async function deleteRegulationMutation(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/regulations/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete regulation");
  }
}
