import React, { useCallback } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import { useUploadFile } from "../hooks/FileHooks";
import { FaFileUpload } from "react-icons/fa";

interface UploadFileButtonProps {
  onFileUploaded: (url: string) => void;
  folder?: string;
  className?: string;
  buttonText?: string;
}

const UploadFileButton: React.FC<UploadFileButtonProps> = ({
  onFileUploaded,
  folder = "events",
  className = "",
  buttonText = "Télécharger un fichier",
}) => {
  const uploadMutation = useUploadFile(folder);

  const handleDrop = useCallback(
    async (acceptedFiles: readonly FileWithPath[]) => {
      if (acceptedFiles.length === 0) return;

      try {
        const result = await uploadMutation.mutateAsync(acceptedFiles[0]);
        if (result?.url) {
          onFileUploaded(result.url);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    },
    [uploadMutation, onFileUploaded]
  );

  const { getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
    noClick: true,
  });

  return (
    <label
      className={`btn btn-outline btn-primary flex items-center gap-2 cursor-pointer ${className} ${
        isDragActive ? "btn-active" : ""
      }`}
    >
      <input {...getInputProps()} />
      <FaFileUpload className="w-4 h-4" />
      {uploadMutation.isPending ? "Téléchargement..." : buttonText}
    </label>
  );
};

export default UploadFileButton;
