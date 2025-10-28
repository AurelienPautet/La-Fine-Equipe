export default function getAuthHeaders(
  contentType: string = "application/json"
): HeadersInit {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": contentType,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}
