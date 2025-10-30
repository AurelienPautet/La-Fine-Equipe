import React from "react";
import { FaEdit, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import type { Division, TeamMember } from "@lafineequipe/types";
import Tie from "./Tie";
import DeleteButton from "./DeleteButton";

interface MemberCardProps {
  member: TeamMember;
  isAdmin?: boolean;
  division: Division;
  onEdit?: (m: TeamMember) => void;
  onDelete?: (id: number) => Promise<void>;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  isAdmin = false,
  division,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const title = division.titleSchema
    ?.replace("[role]", member.role)
    .replace("[pole]", division.name);

  return (
    <div className="flex p-8 items-center w-64 card bg-base-100 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-primary transition-all duration-300">
      <img
        className="w-20 h-20 rounded-full object-contain "
        src={member.photoUrl ?? "/logo.png"}
        alt={member.firstName}
      />
      <div className="card-body p-0 items-center text-center">
        <div className="flex w-full items-start mt-2 flex-row">
          <Tie className="flex-none w-12 h-32" color={division.color} />
          <div className="flex items-start flex-col">
            <h3 className="text-xl flex font-bold text-left text-base-content mt-2 uppercase ">
              {member.firstName} <br /> {member.lastName}
            </h3>
            <p className="text-primary font-semibold text-left text-base">
              {title}
            </p>
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="link no-underline text-sm opacity-70"
              >
                {member.email}
              </a>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="flex gap-2 mt-2">
            <button
              className="btn btn-sm btn-outline btn-info"
              onClick={() => onEdit?.(member)}
              title="Éditer"
            >
              <FaEdit />
            </button>
            <DeleteButton
              id={member.id}
              entityName={`${member.firstName} ${member.lastName}`}
              deleteMutation={onDelete ? onDelete : () => Promise.resolve()}
              className="btn-sm"
              confirmMessage={`Êtes-vous sûr de vouloir supprimer le membre "${member.firstName} ${member.lastName}" ? Cette action est irréversible.`}
            />
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => onMoveUp?.()}
              title="Monter"
            >
              <FaArrowLeft />
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => onMoveDown?.()}
              title="Descendre"
            >
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
