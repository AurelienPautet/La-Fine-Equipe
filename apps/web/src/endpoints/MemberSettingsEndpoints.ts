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

export const getMembersSettings = async (): Promise<{
  actifSettings: ActifMembersSettings;
  simpleSettings: SimpleMembersSettings;
}> => {
  const response = await fetch(`${API_URL}/api/members-settings`);
  const data = await response.json();

  return data.data;
};

export const updateActifMembersSettings = async (
  settings: EditActifMembersSettingsRequest
): Promise<void> => {
  const parsed = editActifMembersSettingsRequestSchema.parse(settings);
  const response = await fetch(`${API_URL}/api/members-settings/actif`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(parsed),
  });
  if (!response.ok) {
    throw new Error("Failed to update Actif members settings");
  }
  const data = await response.json();
  return data;
};

export const updateSimpleMembersSettings = async (
  settings: EditSimpleMembersSettingsRequest
): Promise<void> => {
  const parsed = editSimpleMembersSettingsRequestSchema.parse(settings);
  const response = await fetch(`${API_URL}/api/members-settings/simple`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(parsed),
  });
  if (!response.ok) {
    throw new Error("Failed to update Simple members settings");
  }
  const data = await response.json();
  return data;
};
