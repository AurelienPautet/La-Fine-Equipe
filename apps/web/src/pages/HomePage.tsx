import React from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaBook,
  FaGem,
  FaHeart,
  FaLightbulb,
  FaHandshake,
} from "react-icons/fa";
import ArticleCard from "../components/ArticleCard";
import { useLatestArticle } from "../hooks/ArticleHooks";
import FigureCard from "../components/FigureCard";

const HomePage: React.FC = () => {
  const { data: latestArticle, error, isLoading } = useLatestArticle();
  console.log("Latest article data:", latestArticle, error);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[calc(100vh-2.5rem)] bg-gradient-to-br from-primary to-primary-focus relative overflow-hidden">
        <div className="hero-content text-center text-primary-content relative z-10">
          <div className="max-w-4xl">
            <div className="flex justify-center mb-8">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full shadow-2xl">
                  <img
                    src="/logo.png"
                    alt="La Fine Équipe"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-6 drop-shadow-lg flex items-center justify-center gap-4">
              <FaGem className="w-12 h-12 text-accent" />

              <span className="hidden lg:visible bold bg-red-900">
                La Fine Équipe
              </span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Bienvenue sur le site de La Fine Équipe ! Nous sommes un groupe
              passionné et dévoué, travaillant ensemble pour atteindre nos
              objectifs. Découvrez notre univers unique et nos aventures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/about"
                className="btn btn-accent btn-lg text-accent-content shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <FaUsers className="w-5 h-5" />
                Découvrir l'équipe
              </Link>
              <Link
                to="/article"
                className="btn btn-outline btn-lg border-2 border-accent text-accent hover:bg-accent hover:text-accent-content shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <FaBook className="w-5 h-5" />
                Lire nos articles
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-secondary rounded-full"></div>
          <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-accent rounded-full"></div>
        </div>
      </div>

      {/* Latest Article Section */}
      {latestArticle && (
        <section className="py-20 bg-base-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-secondary mb-4 flex items-center justify-center gap-4">
                <FaBook className="w-10 h-10" />
                Dernier Article
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="flex justify-center">
              <div className="max-w-lg">
                <ArticleCard article={latestArticle} />
              </div>
            </div>
            <div className="text-center mt-8">
              <Link
                to="/article"
                className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <FaBook className="w-5 h-5" />
                Voir tous nos articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Presentation Section */}
      <div className="min-h-[calc(100vh-2.5rem)] h-full flex flex-col  items-center">
        <div className="h-full bg-white w-full">
          <div className="flex flex-row w-full h-full">
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
            <div className=" h-full  w-1/3 flex items-center justify-center">
              <img
                src="/PresIlustr.png"
                alt="Présentation La Fine Équipe"
                className="w-2/3"
              />
            </div>
          </div>
        </div>
        <div className="h-full bg-accent w-full flex flex-row justify-center items-center">
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
                <b>d’incarner et de porter les revendications des étudiants</b>
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
    </div>
  );
};

export default HomePage;
