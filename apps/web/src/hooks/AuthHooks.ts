import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { login, verifyToken } from "../endpoints/AuthEndpoints";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (password: string) => login(password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useVerifyToken = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: () => verifyToken(),
  });
};
