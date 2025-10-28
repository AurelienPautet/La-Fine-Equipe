import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  updateActifMembersSettings,
  updateSimpleMembersSettings,
  getMembersSettings,
} from "../endpoints/MemberSettingsEndpoints";
import type {
  ActifMembersSettings,
  SimpleMembersSettings,
} from "@lafineequipe/types";
import type {
  EditActifMembersSettingsRequest,
  EditSimpleMembersSettingsRequest,
} from "@lafineequipe/types";

export const useMembersSettings = () => {
  return useQuery<
    {
      actifSettings: ActifMembersSettings;
      simpleSettings: SimpleMembersSettings;
    },
    Error
  >({
    queryKey: ["members-settings"],
    queryFn: () => getMembersSettings(),
  });
};

export const useUpdateActifMembersSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: EditActifMembersSettingsRequest) =>
      updateActifMembersSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members-settings"] });
    },
  });
};

export const useUpdateSimpleMembersSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: EditSimpleMembersSettingsRequest) =>
      updateSimpleMembersSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members-settings"] });
    },
  });
};
