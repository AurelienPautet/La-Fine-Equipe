import type {
  Categories,
  CreateCategoryRequest,
  ReorderCategoriesRequest,
} from "@lafineequipe/types";

import {
  createCategoryRequestSchema,
  reorderCategoriesRequestSchema,
} from "@lafineequipe/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getAllCategories(): Promise<Categories[]> {
  const response = await fetch(`${API_URL}/api/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const categories = await response.json();
  return categories.data;
}

export async function getCategoriesFromId(id: number): Promise<Categories> {
  const response = await fetch(`${API_URL}/api/categories/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }

  const category = await response.json();
  return category.data;
}

export async function postCategories(
  categoryData: CreateCategoryRequest
): Promise<Categories> {
  const validateData = createCategoryRequestSchema.parse(categoryData);
  const response = await fetch(`${API_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validateData),
  });

  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to create category", {
      cause: response,
    });
  }

  const category = await response.json();
  return category.data;
}

export async function editCategories(
  id: number,
  categoryData: CreateCategoryRequest
): Promise<Categories> {
  const validateData = createCategoryRequestSchema.parse(categoryData);
  const response = await fetch(`${API_URL}/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validateData),
  });

  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to edit category", {
      cause: response,
    });
  }

  const category = await response.json();
  return category.data;
}

export async function reorderCategories(
  reorderData: ReorderCategoriesRequest[]
): Promise<Categories[]> {
  const validateData = reorderData.map((item) =>
    reorderCategoriesRequestSchema.parse(item)
  );
  const response = await fetch(`${API_URL}/api/categories/reorder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validateData),
  });

  if (!response.ok) {
    throw new Error("Failed to reorder categories");
  }

  const categories = await response.json();
  return categories.data;
}
