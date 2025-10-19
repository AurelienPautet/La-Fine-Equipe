import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { uploadFile } from "../endpoints/FilesEndpoitns";

export const useUploadFile = (folder: string = "") => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadFile(file, folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", folder] });
    },
  });
};
