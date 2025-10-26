import React from "react";
import PageHeader from "../components/PageHeader";
import { FaUserPlus } from "react-icons/fa";

const JoinUsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Rejoins Nous !"
        icon={<FaUserPlus />}
        subtitle="
      Rejoins notre equipe en t'inscrivant sur HelloAsso"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg ">
          <div className="sticky left-0 top-20 text-center backdrop-blur-[1px] p-2 rounded-2xl mb-6 flex flex-col  sm:flex-row w-fit justify-center gap-4 ml-auto mr-auto">
            <a
              href="https://www.helloasso.com/associations/la-fine-equipe-lyon-iii/adhesions/devenir-membre-actif-pour-l-annee-2025-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg text-primary-content shadow-lg hover:shadow-xl  hover:scale-105 transition-all flex items-center gap-2"
            >
              <FaUserPlus />
              Devenir membre actif
            </a>
            <a
              href="https://www.helloasso.com/associations/la-fine-equipe-lyon-iii/adhesions/bulletin-d-adhesion-simple-a-la-fine-equipe"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg text-primary-content shadow-lg hover:shadow-xl  hover:scale-105 transition-all flex items-center gap-2"
            >
              <FaUserPlus />
              Adhésion simple
            </a>
          </div>
          <h2 className="text-3xl font-bold mb-6 text-center text-primary">
            Devenir Membre de <span className="italic">La Fine Equipe</span>
          </h2>
          <p className="mb-4">
            Nous sommes toujours à la recherche de{" "}
            <span className="font-bold">nouveaux membres</span> ! Si tu
            souhaites t’investir à{" "}
            <span className="italic">La Fine Équipe</span>, nous soutenir ou
            simplement te tenir informé de nos prochains évènements,{" "}
            <span className="font-bold">devenir membre</span> est exactement ce
            qui nous aide le plus. Pour cela, deux choix s’offrent à toi :{" "}
            <span className="text-secondary font-bold">l’adhésion simple</span>,
            ou{" "}
            <span className="text-secondary font-bold">
              l’adhésion en tant que membre actif
            </span>
            .
          </p>
          <p className="mb-4">
            L’<span className="font-bold">adhésion simple</span> est valable{" "}
            <span className="font-bold">à vie</span>. Celle-ci permet :
          </p>
          <ul className=" ml-3 mb-4 list-disc list-inside">
            <li>
              D’être informé de l’actualité de{" "}
              <span className="italic">La Fine Équipe</span>
            </li>
            <li>D’être prioritaire pour les places à nos évènements</li>
            <li>
              D’intégrer, voire de créer un <span className="italic">pôle</span>{" "}
              pour faire vivre l’Association et réaliser tes projets
            </li>
            <li>D’être candidat sur l’une de nos listes.</li>
          </ul>
          <p className="mb-4">
            L’adhésion en tant que{" "}
            <span className="text-secondary font-bold">membre actif</span>{" "}
            confère tous les avantages de l’adhésion simple, et permet,{" "}
            <span className="font-bold">pour l’année scolaire</span> en cours,
            moyennant une contribution de{" "}
            <span className="text-primary font-bold">7 euros</span> :
          </p>
          <ul className="ml-3 mb-4 list-disc list-inside">
            <li>De voter aux réunions de l’Assemblée générale</li>
            <li>
              D’intégrer le{" "}
              <span className="italic">Conseil d’administration</span> ou le
              bureau le cas échéant
            </li>
            <li>D’être candidat en bonne place</li>
            <li>
              Et de nous{" "}
              <span className="font-bold text-primary">
                soutenir financièrement
              </span>{" "}
              !
            </li>
          </ul>
          <p>
            Si tu as des questions, n’hésite pas à nous contacter, par mail ou
            sur nos réseaux. <span className="font-bold">Merci d’avance</span> !
          </p>
          <img
            src="./PhotoGroupe.png"
            alt="Rejoins Nous Illustration"
            className="mt-6 mx-auto"
          />
          <p className="mt-4 text-center">
            Rejoins-nous et fais partie de l'aventure !
          </p>
        </div>
      </div>
    </div>
  );
};
export default JoinUsPage;
