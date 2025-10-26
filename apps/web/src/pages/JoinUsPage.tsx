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
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Devenir Membre de La Fine Equipe
          </h2>
          <p className="mb-4">
            Nous sommes ravis que tu souhaites rejoindre La Fine Equipe ! En
            devenant membre, tu soutiens notre mission de promouvoir le sport et
            de créer une communauté dynamique et engagée.
          </p>
          <p className="mb-4">
            Pour t'inscrire, clique sur le lien ci-dessous qui te dirigera vers
            notre page d'inscription sur HelloAsso. Suis les instructions pour
            compléter ton inscription.
          </p>
          <div className="text-center mt-6 flex flex-col  sm:flex-row w-full justify-center gap-4">
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
        </div>
      </div>
    </div>
  );
};
export default JoinUsPage;
