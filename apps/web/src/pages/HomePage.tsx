import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBook, FaHandsHelping, FaPlus } from "react-icons/fa";
import EventsCard from "../components/EventCard";
import { useLatestsEvents, useMemorableEvents } from "../hooks/EventHooks";
import FigureCard from "../components/FigureCard";
import { MdEvent } from "react-icons/md";
import {
  useFigures,
  useDeleteFigure,
  useReorderFigures,
} from "../hooks/FiguresHooks";
import {
  useVisibleHomeSections,
  useHomeSections,
  useDeleteHomeSection,
  useEditHomeSection,
  useReorderHomeSections,
} from "../hooks/HomeSectionHooks";
import FiguresManager from "../components/FiguresManager";
import HomeSectionManager from "../components/HomeSectionManager";
import HomeSectionDisplay from "../components/HomeSectionDisplay";
import { useAuth } from "../components/AuthProvider";
import type { Figure, HomeSection } from "@lafineequipe/types";

const HomePage: React.FC = () => {
  const { data: latestsEvents, error, isLoading } = useLatestsEvents();
  const {
    data: memorableEvents,
    error: memorableError,
    isLoading: memorableLoading,
  } = useMemorableEvents();
  const { data: figures, isLoading: figuresLoading } = useFigures();
  const { isAuthenticated } = useAuth();
  const deleteFigure = useDeleteFigure();
  const reorderFigures = useReorderFigures();

  // Home sections hooks
  const { data: visibleHomeSections } = useVisibleHomeSections();
  const { data: allHomeSections } = useHomeSections();
  const deleteHomeSection = useDeleteHomeSection();
  const editHomeSection = useEditHomeSection();
  const reorderHomeSections = useReorderHomeSections();

  const homeSectionsToDisplay = isAuthenticated
    ? allHomeSections
    : visibleHomeSections;

  const [editingFigure, setEditingFigure] = useState<Figure | null>(null);

  const [editingHomeSection, setEditingHomeSection] =
    useState<HomeSection | null>(null);
  const [showHomeSectionModal, setShowHomeSectionModal] = useState(false);

  const bgColors = [
    "bg-primary",
    "bg-secondary",
    "bg-warning",
    "bg-error",
  ] as const;

  const handleDeleteFigure = async (id: number) => {
    await deleteFigure.mutateAsync(id);
  };

  const handleMoveFigure = async (figure: Figure, direction: "up" | "down") => {
    if (!figures) return;
    const currentIndex = figures.findIndex((f) => f.id === figure.id);
    if (currentIndex === -1) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === figures.length - 1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newOrder = [...figures];
    [newOrder[currentIndex], newOrder[newIndex]] = [
      newOrder[newIndex],
      newOrder[currentIndex],
    ];

    await reorderFigures.mutateAsync(
      newOrder.map((f, idx) => ({ id: f.id, order: idx }))
    );
  };

  const handleDeleteHomeSection = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette section ?")) {
      await deleteHomeSection.mutateAsync(id);
    }
  };

  const handleToggleHomeSectionVisibility = async (section: HomeSection) => {
    await editHomeSection.mutateAsync({
      id: section.id,
      title: section.title,
      content: section.content,
      buttonLabel: section.buttonLabel || undefined,
      buttonLink: section.buttonLink || undefined,
      imageUrl: section.imageUrl || undefined,
      isVisible: !section.isVisible,
    });
  };

  const handleMoveHomeSection = async (
    section: HomeSection,
    direction: "up" | "down"
  ) => {
    if (!homeSectionsToDisplay) return;
    const currentIndex = homeSectionsToDisplay.findIndex(
      (s) => s.id === section.id
    );
    if (currentIndex === -1) return;
    if (direction === "up" && currentIndex === 0) return;
    if (
      direction === "down" &&
      currentIndex === homeSectionsToDisplay.length - 1
    )
      return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newOrder = [...homeSectionsToDisplay];
    [newOrder[currentIndex], newOrder[newIndex]] = [
      newOrder[newIndex],
      newOrder[currentIndex],
    ];

    await reorderHomeSections.mutateAsync(
      newOrder.map((s, idx) => ({ id: s.id, order: idx }))
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[calc(100vh-2.5rem)] bg-gradient-to-b from-primary to-primary-focus relative overflow-hidden">
        <div className="hero-content text-center text-primary-content relative z-10">
          <div className="max-w-4xl">
            <div className="flex justify-center mb-8">
              <div className="w-64 h-64 rounded-full shadow-2xl">
                <div className="hover-3d">
                  {/* content */}
                  <img
                    src="/logo_texte.png"
                    alt="La Fine Équipe"
                    className="w-full h-full object-cover"
                  />
                  {/* 8 empty divs needed for the 3D effect */}
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
            <p className="text-xl mb-8 max-w-2xl text-secondary opacity-90 mx-auto leading-relaxed drop-shadow-md">
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
                Découvrir l&apos;équipe
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
              Nos prochains événements
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          {error && (
            <p className="text-red-500 w-full text-center">
              Erreur de chargement des events.
            </p>
          )}

          {latestsEvents?.length === 0 && !isLoading ? (
            <p className="text-gray-500 w-full text-center">
              Aucun événement à venir.
              <br />
              Revenez bientôt pour découvrir nos prochains événements !
            </p>
          ) : (
            <div className="ml-auto grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 md:px-20 md:gap-10">
              {latestsEvents?.map((event) =>
                event ? <EventsCard key={event.id} events={event} /> : null
              )}
            </div>
          )}
          <div className="ml-auto grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 md:px-20 md:gap-10">
            {isLoading && (
              <>
                <EventsCard loading={true} events={undefined} />
                <EventsCard loading={true} events={undefined} />
              </>
            )}
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

      {/* Custom Home Sections */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          {isAuthenticated && (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setEditingHomeSection(null);
                  setShowHomeSectionModal(true);
                }}
                className="btn btn-secondary btn-lg"
              >
                <FaPlus className="w-5 h-5" />
                Ajouter une section personnalisée
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Home Section Modal */}
      {showHomeSectionModal ? (
        <dialog className="modal z-50">
          <div className="modal-box mt-10 max-h-[80vh]">
            <h3 className="font-bold text-lg mb-4">
              {editingHomeSection
                ? "Modifier la section"
                : "Ajouter une section"}
            </h3>
            <HomeSectionManager
              editingSection={editingHomeSection}
              onClose={() => {
                setShowHomeSectionModal(false);
                setEditingHomeSection(null);
              }}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button
              onClick={() => {
                setShowHomeSectionModal(false);
                setEditingHomeSection(null);
              }}
            />
          </form>
        </dialog>
      ) : null}

      {homeSectionsToDisplay?.map((section, index) => (
        <HomeSectionDisplay
          key={section.id}
          section={section}
          isAdmin={isAuthenticated}
          onEdit={() => {
            setEditingHomeSection(section);
            setShowHomeSectionModal(true);
          }}
          onDelete={() => handleDeleteHomeSection(section.id)}
          onToggleVisibility={() => handleToggleHomeSectionVisibility(section)}
          onMoveUp={() => handleMoveHomeSection(section, "up")}
          onMoveDown={() => handleMoveHomeSection(section, "down")}
          isFirst={index === 0}
          isLast={index === (homeSectionsToDisplay?.length || 0) - 1}
        />
      ))}

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
        {isAuthenticated && (
          <>
            <div className="flex justify-center mb-4">
              <button
                className="btn btn-primary"
                onClick={() =>
                  setEditingFigure({
                    id: 0,
                    figure: "",
                    description: "",
                    icon: "",
                    order: 0,
                    deletedAt: null,
                  })
                }
              >
                Ajouter un chiffre clé
              </button>
            </div>
            <FiguresManager editingFigure={editingFigure} />
          </>
        )}
        <div className="grid p-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {figuresLoading && (
            <div className="loading loading-spinner text-primary mx-auto"></div>
          )}
          {figures?.map((figure, index) => (
            <FigureCard
              key={figure.id}
              figure={figure}
              bgColor={bgColors[index % bgColors.length]}
              isAdmin={isAuthenticated}
              onEdit={(fig) => setEditingFigure(fig)}
              onDelete={() => handleDeleteFigure(figure.id)}
              onMoveUp={() => handleMoveFigure(figure, "up")}
              onMoveDown={() => handleMoveFigure(figure, "down")}
            />
          ))}
        </div>
      </section>

      {/* Events section */}

      {memorableEvents && memorableEvents.length > 0 ? (
        <section className="p-6 py-20 bg-base-100">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-secondary mb-4 flex items-center justify-center gap-4">
              <MdEvent className="w-10 h-10" />
              Nos Événements Marquants
            </h2>
            {memorableLoading && (
              <div className="loading loading-spinner text-primary mx-auto"></div>
            )}
            {memorableError && (
              <p className="text-red-500">
                Erreur de chargement des événements marquants.
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {memorableEvents?.map((event) => (
                <EventsCard key={event.id} events={event} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default HomePage;
