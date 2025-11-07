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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function postHomeSection(
  homeSection: CreateHomeSectionRequest
): Promise<HomeSection> {
  const validateData = createHomeSectionRequestSchema.parse(homeSection);
  if (!validateData) {
    throw new Error("Invalid home section data");
  }
  const response = await fetch(`${API_URL}/api/home-sections`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(validateData),
  });
  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to create home section", {
      cause: response,
    });
  }
  const homeSectionCreated = await response.json();
  return homeSectionCreated.data;
}

export async function editHomeSection(
  homeSectionData: EditHomeSectionRequest
): Promise<HomeSection> {
  const validateData = editHomeSectionRequestSchema.parse(homeSectionData);
  const response = await fetch(
    `${API_URL}/api/home-sections/${homeSectionData.id}`,
    {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
      },
      body: JSON.stringify(validateData),
    }
  );
  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to edit home section", {
      cause: response,
    });
  }
  const homeSectionEdited = await response.json();
  return homeSectionEdited.data;
}

export async function reorderHomeSections(
  reorderData: ReorderHomeSectionsRequest
): Promise<void> {
  const validateData = reorderHomeSectionsRequestSchema.parse(reorderData);
  const response = await fetch(`${API_URL}/api/home-sections/reorder`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(validateData),
  });
  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to reorder home sections", {
      cause: response,
    });
  }
}

export async function getAllHomeSections(): Promise<HomeSection[]> {
  const response = await fetch(`${API_URL}/api/home-sections`);
  if (!response.ok) {
    throw new Error("Failed to fetch home sections");
  }
  const result = await response.json();
  return result.data;
}

export async function getVisibleHomeSections(): Promise<HomeSection[]> {
  const response = await fetch(`${API_URL}/api/home-sections/visible`);
  if (!response.ok) {
    throw new Error("Failed to fetch visible home sections");
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
    throw new Error("Failed to delete home section");
  }
}
