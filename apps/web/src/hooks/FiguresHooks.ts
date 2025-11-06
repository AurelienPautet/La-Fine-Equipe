import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
  getAllFigures,
  postFigure,
  deleteFigure,
  editFigure,
  reorderFigures,
} from "../endpoints/FiguresEndpoints";
import type {
  CreateFigureRequest,
  EditFigureRequest,
  ReorderFiguresRequest,
} from "@lafineequipe/types";

export const useFigures = () => {
  return useQuery({
    queryKey: ["figures"],
    queryFn: () => getAllFigures(),
  });
};

export const usePostFigure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (figureData: CreateFigureRequest) => postFigure(figureData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["figures"] });
    },
  });
};

export const useEditFigure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (figureData: EditFigureRequest) => editFigure(figureData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["figures"] });
    },
  });
};

export const useDeleteFigure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (figureId: number) => deleteFigure(figureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["figures"] });
    },
  });
};

export const useReorderFigures = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reorderData: ReorderFiguresRequest) =>
      reorderFigures(reorderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["figures"] });
    },
  });
};
