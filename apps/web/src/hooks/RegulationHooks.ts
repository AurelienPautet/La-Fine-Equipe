import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  postRegulationMutation,
  getRegulation,
  getLatestRegulations,
  getRegulations,
  editRegulationMutation,
  deleteRegulationMutation,
} from "../endpoints/RegulationEndpoints";
import type { Regulation } from "@lafineequipe/types";

export const useRegulations = () => {
  return useQuery<Regulation[], Error>({
    queryKey: ["regulations"],
    queryFn: () => getRegulations(),
  });
};

export const useRegulation = (slug: string) => {
  return useQuery<Regulation, Error>({
    queryKey: ["regulations", slug],
    queryFn: () => getRegulation(slug),
  });
};

export const useLatestRegulations = () => {
  return useQuery<Regulation[], Error>({
    queryKey: ["latest-regulations"],
    queryFn: () => getLatestRegulations(),
  });
};

export const usePostRegulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postRegulationMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["regulations"],
      });
    },
  });
};

export const useEditRegulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editRegulationMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["regulations"],
      });
    },
  });
};

export const useDeleteRegulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRegulationMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["regulations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["latest-regulations"],
      });
    },
  });
};
