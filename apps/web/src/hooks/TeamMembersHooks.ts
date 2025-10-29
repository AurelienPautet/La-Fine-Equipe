import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
  getAllTeamMembers,
  postTeamMember,
  deleteTeamMember,
  editTeamMember,
  reorderTeamMembers,
} from "../endpoints/TeamMembersEndpoints";
import type {
  CreateTeamMemberRequest,
  EditTeamMemberRequest,
  ReorderTeamMembersRequest,
} from "../../../../packages/types/src/teamMember";

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: () => getAllTeamMembers(),
  });
};

export const usePostTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamMemberData: CreateTeamMemberRequest) =>
      postTeamMember(teamMemberData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
};

export const useEditTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamMemberData: EditTeamMemberRequest) =>
      editTeamMember(teamMemberData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
};
export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamMemberId: number) => deleteTeamMember(teamMemberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
};

export const useReorderTeamMembers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reorderData: ReorderTeamMembersRequest) =>
      reorderTeamMembers(reorderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
};
