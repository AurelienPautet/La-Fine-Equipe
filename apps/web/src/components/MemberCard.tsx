import React from "react";
import { FaInstagram, FaUser } from "react-icons/fa";

interface Member {
  id: number;
  name: string;
  role: string;
  photo: string;
  instagram?: string;
}

interface MemberCardProps {
  student: Member;
  size?: "small" | "medium" | "large";
  showSocial?: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({
  student,
  size = "medium",
  showSocial = true,
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      cardClass:
        "card bg-base-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300",
      avatarSize: "w-16 h-16",
      titleSize: "text-lg",
      roleSize: "text-sm",
      padding: "px-4 pt-4",
    },
    medium: {
      cardClass:
        "card bg-base-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-primary",
      avatarSize: "w-24 h-24",
      titleSize: "text-xl",
      roleSize: "text-base",
      padding: "px-6 pt-6",
    },
    large: {
      cardClass:
        "card bg-base-100 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-primary",
      avatarSize: "w-32 h-32",
      titleSize: "text-2xl",
      roleSize: "text-lg",
      padding: "px-8 pt-8",
    },
  };

  const config = sizeConfig[size];

  return (
    <div className={config.cardClass}>
      <figure className={config.padding}>
        <div className="avatar">
          <div
            className={`${config.avatarSize} rounded-full ring ring-primary ring-offset-base-100 ring-offset-4`}
          >
            <img
              src={student.photo}
              alt={student.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/logo.png";
              }}
            />
          </div>
        </div>
      </figure>

      <div className="card-body text-center">
        <h3
          className={`card-title ${config.titleSize} text-secondary justify-center`}
        >
          {student.name}
        </h3>
        <p className={`${config.roleSize} text-primary font-medium`}>
          {student.role}
        </p>

        {/* Role Badge */}
        <div className="card-actions justify-center mt-2">
          <div className="badge badge-primary badge-outline flex items-center gap-1">
            <FaUser className="w-3 h-3" />
            {student.role}
          </div>
        </div>

        {/* Social Links */}
        {showSocial && student.instagram && (
          <div className="card-actions justify-center mt-2">
            <a
              href={student.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center   hover:scale-110 transition-all duration-300"
              aria-label={`Instagram de ${student.name}`}
            >
              <FaInstagram className="w-4 h-4" />
              <span className="">@{student.instagram.split("/").pop()}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
