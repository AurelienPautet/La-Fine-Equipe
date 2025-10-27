import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
  getAllCategories,
  getCategoriesFromId,
  postCategories,
  editCategories,
  reorderCategories,
} from "../endpoints/CategoriesEndpoints";
import type {
  CreateCategoryRequest,
  ReorderCategoriesRequest,
} from "@lafineequipe/types";

export const useAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });
};

export const useCategoriesFromId = (id: number) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategoriesFromId(id),
  });
};

export const usePostCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryData: CreateCategoryRequest) =>
      postCategories(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useEditCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      categoryData,
    }: {
      id: number;
      categoryData: CreateCategoryRequest;
    }) => editCategories(id, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useReorderCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reorderData: ReorderCategoriesRequest[]) =>
      reorderCategories(reorderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
