import type {
  Categories,
  CreateCategoryRequest,
  ReorderCategoriesRequest,
} from "@lafineequipe/types";

import {
  createCategoryRequestSchema,
  reorderCategoriesRequestSchema,
} from "@lafineequipe/types";
import getAuthHeaders from "../utils/getAuthHeadears";
import { handleApiError, formatZodError } from "../utils/apiError";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getAllCategories(): Promise<Categories[]> {
  const response = await fetch(`${API_URL}/api/categories`);

  if (!response.ok) {
    await handleApiError(response);
  }

  const categories = await response.json();
  return categories.data;
}

export async function getCategoriesFromId(id: number): Promise<Categories> {
  const response = await fetch(`${API_URL}/api/categories/${id}`);

  if (!response.ok) {
    await handleApiError(response);
  }

  const category = await response.json();
  return category.data;
}

export async function postCategories(
  categoryData: CreateCategoryRequest
): Promise<Categories> {
  const result = createCategoryRequestSchema.safeParse(categoryData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/categories`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  const category = await response.json();
  return category.data;
}

export async function editCategories(
  id: number,
  categoryData: CreateCategoryRequest
): Promise<Categories> {
  const result = createCategoryRequestSchema.safeParse(categoryData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/categories/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  const category = await response.json();
  return category.data;
}

export async function reorderCategories(
  reorderData: ReorderCategoriesRequest[]
): Promise<Categories[]> {
  const validated = reorderData.map((item) => {
    const result = reorderCategoriesRequestSchema.safeParse(item);
    if (!result.success) {
      throw new Error(formatZodError(result.error));
    }
    return result.data;
  });
  const response = await fetch(`${API_URL}/api/categories/reorder`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(validated),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  const categories = await response.json();
  return categories.data;
}

export async function deleteCategoryMutation(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/categories/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
    method: "DELETE",
  });

  if (!response.ok) {
    await handleApiError(response);
  }
}
