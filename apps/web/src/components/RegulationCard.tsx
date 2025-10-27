import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import type { Regulation } from "@lafineequipe/types";

interface RegulationCardProps {
  regulation: Regulation;
}

const RegulationCard: React.FC<RegulationCardProps> = ({ regulation }) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Link
      to={`/regulations/${regulation.slug}`}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-base-300 hover:border-primary"
    >
      <div className="card-body">
        {/* Title */}
        <h2 className="card-title text-2xl text-secondary mb-2">
          {regulation.title}
        </h2>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70 mb-4">
          {/* Author */}
          <div className="flex items-center gap-1">
            <FaUser className="w-3 h-3 text-primary" />
            <span>{regulation.author}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="w-3 h-3 text-primary" />
            <span>{formatDate(regulation.date)}</span>
          </div>
        </div>

        {/* Content Preview */}
        <p className="text-base-content/80 line-clamp-3">
          {regulation.content.substring(0, 150)}...
        </p>

        {/* Read More */}
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary btn-sm gap-2">
            Lire plus
            <FaArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default RegulationCard;
