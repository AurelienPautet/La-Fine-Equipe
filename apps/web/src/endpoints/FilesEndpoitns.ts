import type { FileWithPath } from "react-dropzone";
import getAuthHeaders from "../utils/getAuthHeadears";
import { handleApiError } from "../utils/apiError";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function uploadFile(
  file: FileWithPath,
  folder: string = ""
): Promise<{ success: boolean; url: string; name: string; type: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_URL}/api/files/upload/${folder}`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(null),
    },
    body: formData,
  });
  if (!response.ok) {
    await handleApiError(response);
  }
  const result = await response.json();
  return result;
}

export async function deleteFile(
  fileName: string
): Promise<{ success: boolean }> {
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
    await handleApiError(response);
  }
  const result = await response.json();
  return result;
}
