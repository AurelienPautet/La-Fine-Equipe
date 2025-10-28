import getAuthHeaders from "../utils/getAuthHeadears";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function login(
  password: string
): Promise<{ token: string; message: string }> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  return response.json();
}

export async function verifyToken(): Promise<{ valid: boolean }> {
  const response = await fetch(`${API_URL}/api/auth/verify`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });
  console.log("Verify token response status:", response.status);
  if (!response.ok) {
    throw new Error("Token verification failed");
  }
  return response.json();
}
