import React from "react";
import {
  FaUsers,
  FaHandshake,
  FaHeart,
  FaBullseye,
  FaChess,
  FaPalette,
  FaTrophy,
  FaBookOpen,
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import DivisionsDisplay from "../components/DivisionsDisplay";

const OurTeamPage: React.FC = () => {
  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <PageHeader
        title="À Propos de La Fine Équipe"
        subtitle="Découvrez notre histoire et les membres qui composent notre équipe."
        icon={<FaUsers className="w-12 h-12" />}
        className="py-20"
      >
        <div className="w-24 h-1 bg-accent mx-auto mt-6 rounded-full"></div>
      </PageHeader>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Main Description Card */}
          <div className="card bg-base-100 shadow-2xl border-2 border-primary/20">
            <div className="card-body p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                    <img src="/logo.png" alt="Logo" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-secondary">
                  Notre Histoire
                </h2>
              </div>

              <div className="space-y-6 text-base-content leading-relaxed text-lg">
                <p>
                  <span className="font-bold text-primary">
                    Créée en novembre 2023
                  </span>
                  , au en vue des élections au Conseil de la faculté de Droit,
                  la liste de La Fine Équipe a rapidement évolué, pour devenir
                  dès la rentrée 2024 une des
                  <span className="font-semibold text-secondary">
                    {" "}
                    principales associations étudiantes{" "}
                  </span>
                  de l'Université Lyon III. De portée
                  <span className="font-bold text-primary"> généraliste</span>,
                  nous organisons des
                  <span className="font-semibold text-secondary">
                    {" "}
                    conférences, des ateliers de conversation
                  </span>
                  , et agissons au travers de notre
                  <span className="font-semibold text-secondary">
                    {" "}
                    pôle handicap
                  </span>
                  .
                </p>
                <p>
                  Nous travaillons aussi à faire{" "}
                  <span className="font-bold text-primary">
                    participer directement
                  </span>{" "}
                  les étudiants à la vie de l'Université , en proposant des
                  listes d'étudiants ordinaires, sur une ligne apolitique et
                  apartisane , aux élections des différents organes
                  représentatifs des usagers .
                </p>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <DivisionsDisplay />
        </div>
      </div>
    </div>
  );
};

export default OurTeamPage;
