const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

import {
  editActifMembersSettingsRequestSchema,
  editSimpleMembersSettingsRequestSchema,
} from "@lafineequipe/types";

import type {
  ActifMembersSettings,
  SimpleMembersSettings,
} from "@lafineequipe/types";

import type {
  EditActifMembersSettingsRequest,
  EditSimpleMembersSettingsRequest,
} from "@lafineequipe/types";
import getAuthHeaders from "../utils/getAuthHeadears";
import { handleApiError, formatZodError } from "../utils/apiError";

export const getMembersSettings = async (): Promise<{
  actifSettings: ActifMembersSettings;
  simpleSettings: SimpleMembersSettings;
}> => {
  const response = await fetch(`${API_URL}/api/members-settings`);
  if (!response.ok) {
    await handleApiError(response);
  }
  const data = await response.json();

  return data.data;
};

export const updateActifMembersSettings = async (
  settings: EditActifMembersSettingsRequest
): Promise<void> => {
  const result = editActifMembersSettingsRequestSchema.safeParse(settings);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/members-settings/actif`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });
  if (!response.ok) {
    await handleApiError(response);
  }
  const data = await response.json();
  return data;
};

export const updateSimpleMembersSettings = async (
  settings: EditSimpleMembersSettingsRequest
): Promise<void> => {
  const result = editSimpleMembersSettingsRequestSchema.safeParse(settings);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  const response = await fetch(`${API_URL}/api/members-settings/simple`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(result.data),
  });
  if (!response.ok) {
    await handleApiError(response);
  }
  const data = await response.json();
  return data;
};
