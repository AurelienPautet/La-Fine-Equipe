import React, { useState, useEffect } from "react";
import { usePostFigure, useEditFigure } from "../hooks/FiguresHooks";
import type {
  Figure,
  CreateFigureRequest,
  EditFigureRequest,
} from "@lafineequipe/types";
import { useAuth } from "../components/AuthProvider";
import Popover from "./Popover";
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

const ICON_OPTIONS = [
  { value: "FaHandshake", label: "Accord", icon: <FaHandshake /> },
  { value: "FaLightbulb", label: "Idée", icon: <FaLightbulb /> },
  { value: "FaHeart", label: "Cœur", icon: <FaHeart /> },
  { value: "FaUsers", label: "Utilisateurs", icon: <FaUsers /> },
  { value: "FaBook", label: "Livre", icon: <FaBook /> },
  { value: "FaStar", label: "Étoile", icon: <FaStar /> },
  { value: "FaTrophy", label: "Trophée", icon: <FaTrophy /> },
  {
    value: "FaGraduationCap",
    label: "Diplôme",
    icon: <FaGraduationCap />,
  },
  { value: "FaRocket", label: "Fusée", icon: <FaRocket /> },
  { value: "FaChartLine", label: "Graphique", icon: <FaChartLine /> },
];

interface FiguresManagerProps {
  editingFigure?: Figure | null;
}

const FiguresManager: React.FC<FiguresManagerProps> = ({ editingFigure }) => {
  const { isAuthenticated } = useAuth();
  const postFigure = usePostFigure();
  const editFigure = useEditFigure();

  const [isModalOpen, setIsModalOpen] = useState(!!editingFigure);
  const [formData, setFormData] = useState<CreateFigureRequest>({
    figure: editingFigure?.figure || "",
    description: editingFigure?.description || "",
    icon: editingFigure?.icon || "FaHandshake",
  });

  useEffect(() => {
    if (editingFigure) {
      setFormData({
        figure: editingFigure.figure,
        description: editingFigure.description,
        icon: editingFigure.icon,
      });
      setIsModalOpen(true);
    }
  }, [editingFigure]);

  if (!isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFigure) {
        await editFigure.mutateAsync({
          ...formData,
          id: editingFigure.id,
        } as EditFigureRequest);
      } else {
        await postFigure.mutateAsync(formData);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving figure:", error);
    }
  };

  const resetForm = () => {
    setFormData({ figure: "", description: "", icon: "FaHandshake" });
  };

  return (
    <div className="mb-8">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          Ajouter un chiffre clé
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box max-h-[90vh]">
            <h3 className="font-bold text-lg mb-4">
              {editingFigure
                ? "Modifier le chiffre clé"
                : "Ajouter un chiffre clé"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">
                    Icône (cliquez pour changer)
                  </span>
                </label>
                <div className="flex gap-2">
                  <div></div>
                  <Popover
                    trigger={
                      <div className="btn btn-primary p-2">
                        {
                          ICON_OPTIONS.find(
                            (option) => option.value === formData.icon
                          )?.icon
                        }
                      </div>
                    }
                    dropdownClassName="menu bg-white rounded-box w-fit shadow-sm"
                    align="dropdown-start"
                  >
                    <div className="p-2 space-y-2">
                      {/* Icon list */}
                      <ul className="menu flex-nowrap bg-base-100  max-h-48 overflow-y-scroll overflow-x-hidden p-0">
                        {ICON_OPTIONS.map((option) => (
                          <li key={option.value}>
                            <button
                              type="button"
                              className={`flex items-center gap-3 ${
                                formData.icon === option.value
                                  ? "bg-primary text-primary-content"
                                  : ""
                              }`}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  icon: option.value,
                                });
                              }}
                            >
                              <span className="text-lg">{option.icon}</span>
                              <span>{option.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Popover>
                </div>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text pr-2">Chiffre</span>
                </label>
                <input
                  type="text"
                  value={formData.figure}
                  onChange={(e) =>
                    setFormData({ ...formData, figure: e.target.value })
                  }
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text pr-2">Description</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="textarea textarea-bordered"
                  rows={3}
                  required
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="btn"
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFigure ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              close
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default FiguresManager;
