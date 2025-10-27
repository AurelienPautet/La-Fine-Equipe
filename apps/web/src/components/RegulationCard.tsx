import React from "react";
import { Link } from "react-router-dom";
import type { Regulation, Categories } from "@lafineequipe/types";
import { FaArrowRight } from "react-icons/fa";

interface RegulationCardProps {
  regulation: Regulation;
  category: Categories;
}

const RegulationCard: React.FC<RegulationCardProps> = ({
  regulation,
  category,
}) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const generateRegulationTitle = (): string => {
    return category.titleSchema
      .replace("[date]", formatDate(regulation.date))
      .replace("[title]", regulation.title);
  };

  return (
    <div
      key={regulation.id}
      className="bg-base-200 rounded-lg p-3 hover:bg-base-300 transition-colors"
    >
      <Link
        to={`/regulations/${regulation.slug}`}
        className="flex items-start justify-between gap-3 group"
      >
        <div className="flex-1">
          <h4 className="font-semibold text-base-content group-hover:text-primary transition-colors">
            {generateRegulationTitle()}
          </h4>
          <p>{regulation.description}</p>
        </div>
        <FaArrowRight className="w-5 h-5 text-base-content/50 group-hover:text-primary transition-colors mt-1" />
      </Link>
    </div>
  );
};

export default RegulationCard;
