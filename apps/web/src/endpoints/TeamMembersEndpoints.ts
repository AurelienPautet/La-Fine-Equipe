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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function postTeamMember(
  teamMember: CreateTeamMemberRequest
): Promise<TeamMember> {
  const validateData = createTeamMemberRequestSchema.parse(teamMember);
  if (!validateData) {
    throw new Error("Invalid team member data");
  }
  const response = await fetch(`${API_URL}/api/team-members`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(validateData),
  });
  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to create team member", {
      cause: response,
    });
  }
  const teamMemberCreated = await response.json();
  return teamMemberCreated.data;
}

export async function editTeamMember(
  teamMemberData: EditTeamMemberRequest
): Promise<TeamMember> {
  const validateData = editTeamMemberRequestSchema.parse(teamMemberData);
  const response = await fetch(
    `${API_URL}/api/team-members/${teamMemberData.id}`,
    {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
      },
      body: JSON.stringify(validateData),
    }
  );
  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to edit team member", {
      cause: response,
    });
  }
  const teamMemberEdited = await response.json();
  return teamMemberEdited.data;
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const response = await fetch(`${API_URL}/api/team-members`);
  if (!response.ok) {
    throw new Error("Failed to fetch team members");
  }
  const result = await response.json();
  return result.data;
}

export async function reorderTeamMembers(
  reorderData: ReorderTeamMembersRequest
): Promise<void> {
  const validateData = reorderTeamMembersRequestSchema.parse(reorderData);
  const response = await fetch(`${API_URL}/api/team-members/reorder`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(validateData),
  });
  if (!response.ok) {
    console.error("Response:", response);
    throw new Error("Failed to reorder team members", {
      cause: response,
    });
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
    throw new Error("Failed to delete team member");
  }
}
