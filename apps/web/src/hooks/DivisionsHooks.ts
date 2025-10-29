import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
  getAllDivisions,
  postDivision,
  deleteDivision,
  editDivision,
  reorderDivisions,
} from "../endpoints/DivisionsEndpoints";
import type {
  CreateDivisionRequest,
  EditDivisionRequest,
  ReorderDivisionsRequest,
} from "../../../../packages/types/src/division";

export const useDivisions = () => {
  return useQuery({
    queryKey: ["divisions"],
    queryFn: () => getAllDivisions(),
  });
};
export const usePostDivision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (divisionData: CreateDivisionRequest) =>
      postDivision(divisionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
    },
  });
};
export const useEditDivision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (divisionData: EditDivisionRequest) =>
      editDivision(divisionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
    },
  });
};

export const useReorderDivisions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reorderData: ReorderDivisionsRequest) =>
      reorderDivisions(reorderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
    },
  });
};

export const useDeleteDivision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (divisionId: number) => deleteDivision(divisionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
    },
  });
};
