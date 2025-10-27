import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteFile, uploadFile } from "../endpoints/FilesEndpoitns";

export const useUploadFile = (folder: string = "") => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadFile(file, folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", folder] });
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileName: string) => deleteFile(fileName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
};
