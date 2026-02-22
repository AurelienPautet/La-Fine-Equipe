import type {
  TeamMember,
  CreateTeamMemberRequest,
  EditTeamMemberRequest,
  ReorderTeamMembersRequest,
} from "@lafineequipe/types";
import {
  createTeamMemberRequestSchema,
  editTeamMemberRequestSchema,
  reorderTeamMembersRequestSchema,
} from "@lafineequipe/types";

import getAuthHeaders from "../utils/getAuthHeadears";
import { handleApiError, formatZodError } from "../utils/apiError";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function postTeamMember(
  teamMember: CreateTeamMemberRequest
): Promise<TeamMember> {
  const result = createTeamMemberRequestSchema.safeParse(teamMember);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/team-members`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });
  if (!response.ok) {
    await handleApiError(response);
  }
  const teamMemberCreated = await response.json();
  return teamMemberCreated.data;
}

export async function editTeamMember(
  teamMemberData: EditTeamMemberRequest
): Promise<TeamMember> {
  const result = editTeamMemberRequestSchema.safeParse(teamMemberData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(
    `${API_URL}/api/team-members/${teamMemberData.id}`,
    {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
      },
      body: JSON.stringify(result.data),
    }
  );
  if (!response.ok) {
    await handleApiError(response);
  }
  const teamMemberEdited = await response.json();
  return teamMemberEdited.data;
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const response = await fetch(`${API_URL}/api/team-members`);
  if (!response.ok) {
    await handleApiError(response);
  }
  const result = await response.json();
  return result.data;
}

export async function reorderTeamMembers(
  reorderData: ReorderTeamMembersRequest
): Promise<void> {
  const result = reorderTeamMembersRequestSchema.safeParse(reorderData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/team-members/reorder`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });
  if (!response.ok) {
    await handleApiError(response);
  }
}

export async function deleteTeamMember(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/team-members/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    await handleApiError(response);
  }
}
