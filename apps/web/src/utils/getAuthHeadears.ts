export default function getAuthHeaders(
  contentType: string | null = "application/json"
): HeadersInit {
  const token = localStorage.getItem("adminToken");
  return {
    ...(contentType != null && { "Content-Type": contentType }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}
