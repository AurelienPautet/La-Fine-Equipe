import type {
  HomeSection,
  CreateHomeSectionRequest,
  EditHomeSectionRequest,
  ReorderHomeSectionsRequest,
} from "@lafineequipe/types";
import {
  createHomeSectionRequestSchema,
  editHomeSectionRequestSchema,
  reorderHomeSectionsRequestSchema,
} from "@lafineequipe/types";

import getAuthHeaders from "../utils/getAuthHeadears";
import { handleApiError, formatZodError } from "../utils/apiError";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function postHomeSection(
  homeSection: CreateHomeSectionRequest
): Promise<HomeSection> {
  const result = createHomeSectionRequestSchema.safeParse(homeSection);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/home-sections`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });
  if (!response.ok) {
    await handleApiError(response);
  }
  const homeSectionCreated = await response.json();
  return homeSectionCreated.data;
}

export async function editHomeSection(
  homeSectionData: EditHomeSectionRequest
): Promise<HomeSection> {
  const result = editHomeSectionRequestSchema.safeParse(homeSectionData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(
    `${API_URL}/api/home-sections/${homeSectionData.id}`,
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
  const homeSectionEdited = await response.json();
  return homeSectionEdited.data;
}

export async function reorderHomeSections(
  reorderData: ReorderHomeSectionsRequest
): Promise<void> {
  const result = reorderHomeSectionsRequestSchema.safeParse(reorderData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/home-sections/reorder`, {
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

export async function getAllHomeSections(): Promise<HomeSection[]> {
  const response = await fetch(`${API_URL}/api/home-sections`);
  if (!response.ok) {
    await handleApiError(response);
  }
  const result = await response.json();
  return result.data;
}

export async function getVisibleHomeSections(): Promise<HomeSection[]> {
  const response = await fetch(`${API_URL}/api/home-sections/visible`);
  if (!response.ok) {
    await handleApiError(response);
  }
  const result = await response.json();
  return result.data;
}

export async function deleteHomeSection(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/home-sections/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    await handleApiError(response);
  }
}
