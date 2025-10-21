import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { getTags, postTag } from "../endpoints/TagsEndpoints";

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });
};

export const usePostTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => postTag(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
