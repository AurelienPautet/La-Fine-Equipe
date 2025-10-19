import type { FileWithPath } from "react-dropzone";

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
