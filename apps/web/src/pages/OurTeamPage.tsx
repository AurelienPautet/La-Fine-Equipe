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
import MemberCard from "../components/MemberCard";
import PageHeader from "../components/PageHeader";
import { useEffect, useState } from "react";
interface Member {
  id: number;
  name: string;
  role: string;
  photo: string;
  instagram?: string;
}

const OurTeamPage: React.FC = () => {
  const [students, setMembers] = useState<Member[]>([]);
  useEffect(() => {
    fetch("/members.json")
      .then((response) => response.json())
      .then((data) => setMembers(data))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);
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

              <div className="prose lg:prose-lg max-w-none">
                <p className="text-lg text-base-content leading-relaxed mb-6">
                  <strong>La Fine Équipe</strong> est une association étudiante
                  de l'université Lyon 3 dynamique et passionnée, dédiée à la
                  promotion de l'esprit d'équipe et à l'organisation
                  d'événements mémorables pour la communauté universitaire.
                </p>
                <p className="text-lg text-base-content leading-relaxed mb-6">
                  Fondée sur des valeurs de{" "}
                  <span className="text-primary font-semibold">
                    collaboration
                  </span>
                  , d'
                  <span className="text-primary font-semibold">
                    innovation
                  </span>{" "}
                  et de{" "}
                  <span className="text-primary font-semibold">
                    convivialité
                  </span>
                  , notre équipe s'efforce de créer un environnement stimulant
                  où chacun peut s'épanouir et contribuer à des projets
                  enrichissants.
                </p>
                <p className="text-lg text-base-content leading-relaxed">
                  Que ce soit à travers des tournois sportifs, des soirées
                  thématiques, des ateliers créatifs ou des actions solidaires,
                  nous mettons tout en œuvre pour offrir des expériences uniques
                  et fédératrices à nos membres.
                </p>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <section className="py-20 bg-gradient-to-br from-accent to-base-200">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold text-secondary mb-4 flex items-center justify-center gap-4">
                  <FaUsers className="w-10 h-10" />
                  Nos Membres
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
                <p className="text-xl text-base-content max-w-2xl mx-auto">
                  Rencontrez les membres passionnés qui composent La Fine Équipe
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {students.map((student) => (
                  <MemberCard
                    key={student.id}
                    student={student}
                    size="medium"
                    showSocial={true}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Activities Section */}
          <div className="card bg-base-100 shadow-2xl border-2 border-primary/20">
            <div className="card-body p-8">
              <h2 className="text-4xl font-bold text-secondary mb-6 text-center">
                <FaBullseye className="inline w-8 h-8 mr-3" />
                Nos Activités
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-lg">
                      <FaChess className="inline w-4 h-4 mr-2" />
                      Tournois d'échecs
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-lg">
                      <FaHeart className="inline w-4 h-4 mr-2" />
                      Soirées thématiques
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-lg">
                      <FaPalette className="inline w-4 h-4 mr-2" />
                      Ateliers créatifs
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-lg">
                      <FaHandshake className="inline w-4 h-4 mr-2" />
                      Actions solidaires
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-lg">
                      <FaTrophy className="inline w-4 h-4 mr-2" />
                      Compétitions sportives
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-lg">
                      <FaBookOpen className="inline w-4 h-4 mr-2" />
                      Événements culturels
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeamPage;
