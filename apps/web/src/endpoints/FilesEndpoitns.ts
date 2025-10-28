import type { FileWithPath } from "react-dropzone";
import getAuthHeaders from "../utils/getAuthHeadears";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function uploadFile(
  file: FileWithPath,
  folder: string = ""
): Promise<{ success: boolean; url: string; name: string; type: string }> {
  console.log("Uploading file to folder:", folder);
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_URL}/api/files/upload/${folder}`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(null),
    },
    body: formData,
  });
  console.log("Upload response:", response);
  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
  const result = await response.json();
  console.log("Upload response:", result);
  return result;
}

export async function deleteFile(
  fileName: string
): Promise<{ success: boolean }> {
  console.log("Deleting file:", fileName);
  console.log(
    "DELETE URL:",
    `${API_URL}/api/files/delete?url=${encodeURIComponent(fileName)}`
  );
  const response = await fetch(
    `${API_URL}/api/files/delete?url=${encodeURIComponent(fileName)}`,
    {
      headers: {
        ...getAuthHeaders(),
      },
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete file");
  }
  const result = await response.json();
  return result;
}
