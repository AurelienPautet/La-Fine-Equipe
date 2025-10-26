import React from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaBook,
  FaHeart,
  FaLightbulb,
  FaHandshake,
  FaHandsHelping,
} from "react-icons/fa";
import EventsCard from "../components/EventCard";
import { useLatestsEvents } from "../hooks/EventHooks";
import FigureCard from "../components/FigureCard";
import { MdEvent } from "react-icons/md";
import MarkinEventCard from "../components/MarkinEventCard";

const HomePage: React.FC = () => {
  const { data: latestsEvents, error, isLoading } = useLatestsEvents();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[calc(100vh-2.5rem)] bg-gradient-to-b from-primary to-primary-focus relative overflow-hidden">
        <div className="hero-content text-center text-primary-content relative z-10">
          <div className="max-w-4xl">
            <div className="flex justify-center mb-8">
              <div className="w-64 h-64 rounded-full shadow-2xl">
                <img
                  src="/logo_texte.png"
                  alt="La Fine Équipe"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Bienvenue sur le site de La Fine Équipe ! Nous sommes un groupe
              passionné et dévoué, travaillant ensemble pour atteindre nos
              objectifs. Découvrez notre univers unique et nos aventures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/about"
                className="btn btn-primary btn-lg text-primary-content shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <FaUsers className="w-5 h-5" />
                Découvrir l'équipe
              </Link>
              <Link
                to="/join"
                className="btn btn-secondary btn-lg text-secondary-content shadow-lg hover:shadow-xl transform hover:scale-110 transition-all flex items-center gap-3"
              >
                <FaHandsHelping className="w-6 h-6" />
                Nous rejoindre
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Latests Events Section */}
      <section className="py-20 bg-primary-focus">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-secondary mb-4 flex items-center justify-center gap-4">
              <FaBook className="w-10 h-10" />
              Derniers Events
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-10">
            {isLoading && (
              <>
                <EventsCard
                  className="w-1/3"
                  loading={true}
                  events={undefined}
                />
                <EventsCard
                  className="w-1/3"
                  loading={true}
                  events={undefined}
                />
              </>
            )}
            {error && (
              <p className="text-red-500">Erreur de chargement des events.</p>
            )}

            {latestsEvents?.map((events) => (
              <EventsCard className="w-1/3" key={events.id} events={events} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/events"
              className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <FaBook className="w-5 h-5" />
              Voir tous nos events
            </Link>
          </div>
        </div>
      </section>

      {/* Presentation Section */}
      <div className="min-h-[calc(100vh-2.5rem)] h-full flex flex-col  items-center">
        <div className="h-full bg-white w-full">
          <div className="flex flex-col md:flex-row w-full h-full">
            <div className="flex-1 h-full w-full">
              <div className=" flex flex-col justify-center items-center h-full p-10">
                <h2 className="text-5xl font-bold text-secondary mb-6 text-center">
                  Qui Sommes-Nous ?
                </h2>
                <p className="text-xl text-justify max-w-2xl">
                  La Fine Équipe est une association de l’Université Jean Moulin
                  Lyon III, prônant <b> l’entraide</b> et <b> l’engagement</b>,
                  et comptant <b>huit élus</b> au sein de ses membres.
                  <br />
                  <br />
                  <b>Apolitiques</b> et <b>apartisans</b>, nous sommes
                  indépendants et ne recevons aucun financement extérieur à
                  l’Université.
                  <br />
                  <br />
                  <b>Inclusif</b>, nous avons également la particularité d’être
                  la seule association de l’Université dotée d’un pôle handicap.
                </p>
              </div>
            </div>
            <div className=" h-full  w-full md:w-1/3 flex items-center justify-center">
              <img
                src="/PresIlustr.png"
                alt="Présentation La Fine Équipe"
                className="h-1/3 w-1/3 md:h-full md:w-full"
              />
            </div>
          </div>
        </div>
        <div className="h-full bg-accent w-full flex flex-col md:flex-row justify-center items-center">
          <div className=" h-full  w-1/3 flex items-center justify-center">
            <img
              src="/PresIlustr2.png"
              alt="Présentation La Fine Équipe"
              className="w-full"
            />
          </div>
          <div className="h-full w-full">
            <div className=" flex flex-col justify-center items-center h-full p-10">
              <p className="text-xl text-justify max-w-2xl">
                Les membres et les élus de La Fine Équipe se donnent pour
                mission{" "}
                <b>d’incarner et de porter les revendications des étudiants</b>{" "}
                de Lyon III auprès des instances décisionnelles.
                <br />
                <br />
                Pour cela, nous avons mis en place un <b>
                  cahier de doléances
                </b>{" "}
                anonyme sur notre Linktree, et réalisons régulièrement sur nos
                réseaux sociaux et sur les campus, des <b>sondages</b> pour
                connaître les attentes, les opinions et les <b>problèmes</b>{" "}
                auxquels les étudiants sont confrontés dans leur vie
                quotidienne.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Figures Section */}
      <section className="p-6 py-20 bg-base-100">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-secondary mb-4 flex items-center justify-center gap-4">
            <FaUsers className="w-10 h-10" />
            Nos Chiffres Clés
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <FigureCard
            icon={<FaHandshake />}
            figure="38"
            description="MEMBRES"
            bgColor="bg-primary"
          />

          <FigureCard
            figure="61"
            description="PASSAGES EN AMPHI"
            bgColor="bg-secondary"
            icon={<FaLightbulb />}
          />

          <FigureCard
            figure="2"
            description="ÉLUS AU CONSEIL DE LA
FORMATION ET DE LA VIE
UNIVERSITAIRE (CFVU)"
            bgColor="bg-warning"
            icon={<FaHeart />}
          />

          <FigureCard
            figure="2"
            description="ÉLUS À LA
SECTION
DISCIPLINAIRE"
            bgColor="bg-warning"
            icon={<FaHeart />}
          />
          <FigureCard
            figure="6"
            description="ÉLUS AU CONSEIL
DOCUMENTAIRE (75% des sièges)"
            bgColor="bg-primary"
            icon={<FaHeart />}
          />
          <FigureCard
            figure="25 000"
            description="VUES SUR LES RÉSEAUX SOCIAUX"
            bgColor="bg-secondary"
            icon={<FaHeart />}
          />
        </div>
      </section>

      {/* Events section */}
      <section className="p-6 py-20 bg-base-100">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-secondary mb-4 flex items-center justify-center gap-4">
            <MdEvent className="w-10 h-10" />
            Nos Evenements Marquants
          </h2>
          <div>
            <MarkinEventCard
              title="Collecte de fournitures scolaires"
              description="Organisation d'une collecte de fournitures scolaires pour les étudiants dans le besoin."
              date="15 septembre 2023"
              imageUrl="/events/collecte_fournitures.jpg"
              eventsUrl="/events/collecte-fournitures-scolaires"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
