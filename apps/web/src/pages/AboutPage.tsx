import React from "react";
import {
  FaUsers,
  FaHandshake,
  FaLightbulb,
  FaHeart,
  FaBullseye,
  FaChess,
  FaPalette,
  FaTrophy,
  FaBookOpen,
} from "react-icons/fa";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-base-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-focus py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold text-primary-content mb-6 drop-shadow-lg flex items-center justify-center gap-4">
            <FaUsers className="w-12 h-12" />À Propos de La Fine Équipe
          </h1>
          <p className="text-xl text-primary-content/90 max-w-3xl mx-auto drop-shadow-md">
            Découvrez notre histoire, nos valeurs et notre passion pour
            l'aventure collective
          </p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6 rounded-full"></div>
        </div>
      </div>

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
                  🦎 <strong>La Fine Équipe</strong> est une association
                  étudiante dynamique et passionnée, dédiée à la promotion de
                  l'esprit d'équipe et à l'organisation d'événements mémorables
                  pour la communauté universitaire.
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

          {/* Values Section */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-primary text-primary-content shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">
                  <FaHandshake />
                </div>
                <h3 className="card-title justify-center text-2xl mb-3">
                  Collaboration
                </h3>
                <p>
                  Nous croyons en la force du travail d'équipe et de l'entraide
                  mutuelle.
                </p>
              </div>
            </div>

            <div className="card bg-secondary text-secondary-content shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">
                  <FaLightbulb />
                </div>
                <h3 className="card-title justify-center text-2xl mb-3">
                  Innovation
                </h3>
                <p>
                  Nous innovons constamment pour créer des expériences uniques
                  et mémorables.
                </p>
              </div>
            </div>

            <div className="card bg-accent text-accent-content shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">
                  <FaHeart />
                </div>
                <h3 className="card-title justify-center text-2xl mb-3">
                  Convivialité
                </h3>
                <p>
                  L'ambiance chaleureuse et l'esprit festif sont au cœur de
                  notre identité.
                </p>
              </div>
            </div>
          </div>

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

export default AboutPage;
