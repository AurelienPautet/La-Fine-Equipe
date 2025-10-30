import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import {
  useDivisions,
  usePostDivision,
  useEditDivision,
  useDeleteDivision,
  useReorderDivisions,
} from "../hooks/DivisionsHooks";
import {
  useTeamMembers,
  usePostTeamMember,
  useEditTeamMember,
  useDeleteTeamMember,
  useReorderTeamMembers,
} from "../hooks/TeamMembersHooks";
import MemberCard from "./MemberCard";
import DeleteButton from "./DeleteButton";
import DivisionForm from "./DivisionForm";
import MemberForm from "./MemberForm";
import ConfirmationModal from "./ConfirmationModal";
import { FaPlus, FaArrowUp, FaArrowDown, FaEdit } from "react-icons/fa";
import type {
  Division,
  CreateDivisionRequest,
  EditDivisionRequest,
} from "@lafineequipe/types";
import type {
  TeamMember,
  CreateTeamMemberRequest,
  EditTeamMemberRequest,
} from "@lafineequipe/types";

const DivisionsDisplay: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const [divisionModalOpen, setDivisionModalOpen] = useState(false);
  const [divisionEditingId, setDivisionEditingId] = useState<number | null>(
    null
  );
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberEditingId, setMemberEditingId] = useState<number | null>(null);
  const [memberDivisionId, setMemberDivisionId] = useState<number | null>(null);

  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({ open: false, title: "", message: "" });

  const {
    data: divisions,
    isLoading: isDivisionsLoading,
    isSuccess: isDivisionsSuccess,
    error: divisionsError,
  } = useDivisions();
  const postDivision = usePostDivision();
  const editDivision = useEditDivision();
  const deleteDivision = useDeleteDivision();
  const reorderDivisions = useReorderDivisions();

  const {
    data: teamMembers,
    isLoading: isTeamMembersLoading,
    isSuccess: isTeamMembersSuccess,
    error: teamMembersError,
  } = useTeamMembers();
  const postTeamMember = usePostTeamMember();
  const editTeamMember = useEditTeamMember();
  const deleteTeamMember = useDeleteTeamMember();
  const reorderTeamMembers = useReorderTeamMembers();

  const isSuccess = isDivisionsSuccess && isTeamMembersSuccess;
  const isLoading = isDivisionsLoading || isTeamMembersLoading;
  const isError = divisionsError || teamMembersError;

  const membersByDivision: Record<number, TeamMember[]> = {};
  if (teamMembers) {
    teamMembers.forEach((member) => {
      if (!membersByDivision[member.divisionId])
        membersByDivision[member.divisionId] = [];
      membersByDivision[member.divisionId].push(member);
    });
  }

  const handleAddDivision = () => {
    setDivisionEditingId(null);
    setDivisionModalOpen(true);
  };

  const handleEditDivision = (division: Division) => {
    setDivisionEditingId(division.id);
    setDivisionModalOpen(true);
  };

  const handleDivisionFormSubmit = (
    data: CreateDivisionRequest | EditDivisionRequest
  ) => {
    if ("id" in data) {
      editDivision.mutate(data as EditDivisionRequest, {
        onSuccess: () => {
          setDivisionModalOpen(false);
          setDivisionEditingId(null);
          setConfirmationModal({
            open: true,
            title: "Succès",
            message: "Pôle modifié avec succès",
          });
        },
      });
    } else {
      postDivision.mutate(data as CreateDivisionRequest, {
        onSuccess: () => {
          setDivisionModalOpen(false);
          setDivisionEditingId(null);
          setConfirmationModal({
            open: true,
            title: "Succès",
            message: "Pôle créé avec succès",
          });
        },
      });
    }
  };

  const handleDeleteDivision = async (divisionId: number) => {
    await deleteDivision.mutateAsync(divisionId);
  };

  const handleMoveDivision = (division: Division, dir: -1 | 1) => {
    if (!divisions) return;
    const sorted = [...divisions].sort((a, b) => a.order - b.order);
    const divisionIdx = sorted.findIndex((d) => d.id === division.id);
    if (divisionIdx < 0) return;
    const nextIdx = divisionIdx + dir;
    if (nextIdx < 0 || nextIdx >= sorted.length) return;
    const swapped = [...sorted];
    [swapped[divisionIdx].order, swapped[nextIdx].order] = [
      swapped[nextIdx].order,
      swapped[divisionIdx].order,
    ];
    const reorderData = swapped.map(({ id, order }) => ({ id, order }));
    reorderDivisions.mutate(reorderData);
  };

  const handleAddMember = (division: Division) => {
    setMemberDivisionId(division.id);
    setMemberEditingId(null);
    setMemberModalOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setMemberDivisionId(member.divisionId);
    setMemberEditingId(member.id);
    setMemberModalOpen(true);
  };

  const handleMemberFormSubmit = (
    data: CreateTeamMemberRequest | EditTeamMemberRequest
  ) => {
    if ("id" in data) {
      editTeamMember.mutate(data as EditTeamMemberRequest, {
        onSuccess: () => {
          setMemberModalOpen(false);
          setMemberEditingId(null);
          setMemberDivisionId(null);
          setConfirmationModal({
            open: true,
            title: "Succès",
            message: "Membre modifié avec succès",
          });
        },
      });
    } else {
      postTeamMember.mutate(data as CreateTeamMemberRequest, {
        onSuccess: () => {
          setMemberModalOpen(false);
          setMemberEditingId(null);
          setMemberDivisionId(null);
          setConfirmationModal({
            open: true,
            title: "Succès",
            message: "Membre créé avec succès",
          });
        },
      });
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    await deleteTeamMember.mutateAsync(memberId);
  };

  const handleMoveMember = (member: TeamMember, dir: -1 | 1) => {
    const arr = (membersByDivision[member.divisionId] || [])
      .slice()
      .sort((a, b) => a.order - b.order);
    const memberIdx = arr.findIndex((m) => m.id === member.id);
    if (memberIdx < 0) return;
    const nextIdx = memberIdx + dir;
    if (nextIdx < 0 || nextIdx >= arr.length) return;
    [arr[memberIdx].order, arr[nextIdx].order] = [
      arr[nextIdx].order,
      arr[memberIdx].order,
    ];
    const reorderData = arr.map(({ id, order }) => ({ id, order }));
    reorderTeamMembers.mutate(reorderData);
  };

  const editingDivision = divisions?.find((d) => d.id === divisionEditingId);
  const editingMember = teamMembers?.find((m) => m.id === memberEditingId);

  return (
    <div>
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="alert alert-error mt-8">
          <span>
            Erreur de chargement :{" "}
            {divisionsError?.message ||
              teamMembersError?.message ||
              "Erreur inconnue"}
          </span>
        </div>
      )}

      {/* Division Form Modal */}
      {divisionModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box flex items-center justify-center">
            <DivisionForm
              division={editingDivision}
              isLoading={postDivision.isPending || editDivision.isPending}
              onSubmit={handleDivisionFormSubmit}
              onCancel={() => setDivisionModalOpen(false)}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setDivisionModalOpen(false)}>close</button>
          </form>
        </dialog>
      )}

      {/* Member Form Modal */}
      {memberModalOpen && memberDivisionId !== null && (
        <dialog className="modal modal-open">
          <div className="modal-box flex items-center justify-center">
            <MemberForm
              member={editingMember}
              divisionId={memberDivisionId}
              isLoading={postTeamMember.isPending || editTeamMember.isPending}
              onSubmit={handleMemberFormSubmit}
              onCancel={() => setMemberModalOpen(false)}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setMemberModalOpen(false)}>close</button>
          </form>
        </dialog>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        title={confirmationModal.title}
        message={confirmationModal.message}
        open={confirmationModal.open}
        setOpen={(open) => setConfirmationModal({ ...confirmationModal, open })}
      />

      {/* Main Content */}
      {isSuccess && (
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-secondary flex-1 text-center">
              Notre Équipe
            </h2>
            {isAuthenticated && (
              <button
                className="btn btn-primary gap-2 ml-4"
                onClick={handleAddDivision}
              >
                <FaPlus className="w-4 h-4" />
                Ajouter un pôle
              </button>
            )}
          </div>

          {/* ADMIN VIEW - Full edit interface */}
          {isAuthenticated && (
            <div className="flex flex-col gap-8">
              {divisions
                ?.sort((a, b) => a.order - b.order)
                .map((division) => (
                  <div
                    key={division.id}
                    className="card bg-base-100 shadow-lg border border-base-300"
                  >
                    {/* Division Header */}
                    <div className="card-body pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-4 h-12 rounded-full"
                            style={{ background: division.color }}
                          />
                          <div>
                            <h3
                              className="card-title text-2xl"
                              style={{ color: division.color }}
                            >
                              {division.name}
                            </h3>
                            <p className="text-sm text-base-content/70">
                              {division.titleSchema}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            className="btn btn-xs btn-ghost"
                            onClick={() => handleMoveDivision(division, -1)}
                            disabled={reorderDivisions.isPending}
                            title="Monter"
                          >
                            <FaArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            className="btn btn-xs btn-ghost"
                            onClick={() => handleMoveDivision(division, 1)}
                            disabled={reorderDivisions.isPending}
                            title="Descendre"
                          >
                            <FaArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            className="btn btn-xs btn-outline btn-info gap-1"
                            onClick={() => handleEditDivision(division)}
                            title="Éditer"
                          >
                            <FaEdit />
                          </button>
                          <DeleteButton
                            id={division.id}
                            entityName={`le pôle "${division.name}"`}
                            deleteMutation={handleDeleteDivision}
                            className="btn-xs"
                            confirmMessage={`Êtes-vous sûr de vouloir supprimer le pôle "${division.name}" ? Cette action est irréversible.`}
                          />
                          <button
                            className="btn btn-xs btn-primary gap-1"
                            onClick={() => handleAddMember(division)}
                          >
                            <FaPlus className="w-3 h-3" />
                            Membre
                          </button>
                        </div>
                      </div>

                      <div className="divider my-0" />

                      {/* Members  */}
                      <div className="mt-4">
                        {(membersByDivision[division.id] || []).length === 0 ? (
                          <div className="bg-base-200 rounded-lg p-8 text-center">
                            <p className="text-base-content/70">
                              Aucun membre dans ce pôle
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-6 justify-center">
                            {(membersByDivision[division.id] || [])
                              .sort((a, b) => a.order - b.order)
                              .map((member) => (
                                <MemberCard
                                  key={member.id}
                                  member={member}
                                  isAdmin={true}
                                  division={division}
                                  onEdit={handleEditMember}
                                  onDelete={() => handleDeleteMember(member.id)}
                                  onMoveUp={() => handleMoveMember(member, -1)}
                                  onMoveDown={() => handleMoveMember(member, 1)}
                                />
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* PUBLIC VIEW - Simple list of all members */}
          {!isAuthenticated && (
            <div className="flex flex-wrap gap-6 justify-center">
              {divisions
                ?.sort((a, b) => a.order - b.order)
                .flatMap((division) =>
                  (membersByDivision[division.id] || [])
                    .sort((a, b) => a.order - b.order)
                    .map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        isAdmin={false}
                        division={division}
                      />
                    ))
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DivisionsDisplay;
