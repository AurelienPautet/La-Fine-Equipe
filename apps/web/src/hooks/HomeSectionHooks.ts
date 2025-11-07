import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
  getAllHomeSections,
  getVisibleHomeSections,
  postHomeSection,
  deleteHomeSection,
  editHomeSection,
  reorderHomeSections,
} from "../endpoints/HomeSectionEndpoints";
import type {
  CreateHomeSectionRequest,
  EditHomeSectionRequest,
  ReorderHomeSectionsRequest,
} from "@lafineequipe/types";

export const useHomeSections = () => {
  return useQuery({
    queryKey: ["homeSections"],
    queryFn: () => getAllHomeSections(),
  });
};

export const useVisibleHomeSections = () => {
  return useQuery({
    queryKey: ["visibleHomeSections"],
    queryFn: () => getVisibleHomeSections(),
  });
};

export const usePostHomeSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (homeSectionData: CreateHomeSectionRequest) =>
      postHomeSection(homeSectionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeSections"] });
      queryClient.invalidateQueries({ queryKey: ["visibleHomeSections"] });
    },
  });
};

export const useEditHomeSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (homeSectionData: EditHomeSectionRequest) =>
      editHomeSection(homeSectionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeSections"] });
      queryClient.invalidateQueries({ queryKey: ["visibleHomeSections"] });
    },
  });
};

export const useDeleteHomeSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (homeSectionId: number) => deleteHomeSection(homeSectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeSections"] });
      queryClient.invalidateQueries({ queryKey: ["visibleHomeSections"] });
    },
  });
};

export const useReorderHomeSections = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reorderData: ReorderHomeSectionsRequest) =>
      reorderHomeSections(reorderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeSections"] });
      queryClient.invalidateQueries({ queryKey: ["visibleHomeSections"] });
    },
  });
};
