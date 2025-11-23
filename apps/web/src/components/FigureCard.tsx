import React from "react";
import type { Figure } from "@lafineequipe/types";
import { FaEdit, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  FaHandshake,
  FaLightbulb,
  FaHeart,
  FaUsers,
  FaBook,
  FaStar,
  FaTrophy,
  FaGraduationCap,
  FaRocket,
  FaChartLine,
} from "react-icons/fa";
import DeleteButton from "./DeleteButton";

interface FigureCardProps {
  figure: Figure;
  bgColor: "bg-primary" | "bg-secondary" | "bg-warning" | "bg-error";

  isAdmin?: boolean;
  onEdit?: (figure: Figure) => void;
  onDelete?: (id: number) => Promise<void>;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  FaHandshake: <FaHandshake className="w-12 h-12" />,
  FaLightbulb: <FaLightbulb className="w-12 h-12" />,
  FaHeart: <FaHeart className="w-12 h-12" />,
  FaUsers: <FaUsers className="w-12 h-12" />,
  FaBook: <FaBook className="w-12 h-12" />,
  FaStar: <FaStar className="w-12 h-12" />,
  FaTrophy: <FaTrophy className="w-12 h-12" />,
  FaGraduationCap: <FaGraduationCap className="w-12 h-12" />,
  FaRocket: <FaRocket className="w-12 h-12" />,
  FaChartLine: <FaChartLine className="w-12 h-12" />,
};

const FigureCard: React.FC<FigureCardProps> = ({
  figure,
  bgColor,
  isAdmin = false,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const icon = iconMap[figure.icon] || <FaChartLine className="w-12 h-12" />;

  return (
    <div
      className={`card ${bgColor}  md:w-full text-primary-content shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
    >
      <div className="card-body text-center">
        <div className="text-4xl mb-4 flex justify-center">{icon}</div>
        <h3 className="card-title justify-center text-5xl mb-3">
          {figure.figure}
        </h3>
        <p className="text-2xl whitespace-pre-line">{figure.description}</p>

        {isAdmin && (
          <div className="flex gap-2 mt-4 justify-center">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => onMoveUp?.()}
              title="Précédent"
            >
              <FaArrowLeft />
            </button>
            <button
              className="btn btn-sm btn-outline btn-info"
              onClick={() => onEdit?.(figure)}
              title="Éditer"
            >
              <FaEdit />
            </button>
            <DeleteButton
              id={figure.id}
              entityName={`le chiffre clé "${figure.figure}"`}
              deleteMutation={onDelete ? onDelete : () => Promise.resolve()}
              className="btn-sm"
              confirmMessage={`Êtes-vous sûr de vouloir supprimer le chiffre clé "${figure.figure}" ? Cette action est irréversible.`}
            />
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => onMoveDown?.()}
              title="Suivant"
            >
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FigureCard;
