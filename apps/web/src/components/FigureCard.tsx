import React from "react";

interface FigureCardProps {
  icon: React.ReactNode;
  figure: string;
  description: string;
  bgColor:
    | "bg-primary"
    | "bg-secondary"
    | "bg-accent"
    | "bg-warning"
    | "bg-info"
    | "bg-success"
    | "bg-error";
}

const FigureCard: React.FC<FigureCardProps> = ({
  icon,
  figure,
  description,
  bgColor,
}) => {
  return (
    <div
      className={`card ${bgColor} text-primary-content shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
    >
      <div className="card-body text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="card-title justify-center text-5xl mb-3">{figure}</h3>
        <p className="text-2xl">{description}</p>
      </div>
    </div>
  );
};

export default FigureCard;
