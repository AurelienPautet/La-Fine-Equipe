import React from "react";
import { FaEdit, FaSpinner, FaUserPlus } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  useMembersSettings,
  useUpdateActifMembersSettings,
  useUpdateSimpleMembersSettings,
} from "../hooks/MemberSettingsHooks";
import { useAuth } from "../components/AuthProvider";

const JoinUsPage: React.FC = () => {
  const { data, isLoading, error } = useMembersSettings();
  const updateActifMembersSettingsMutation = useUpdateActifMembersSettings();
  const updateSimpleMembersSettingsMutation = useUpdateSimpleMembersSettings();
  const { isAuthenticated } = useAuth();
  const actifSettings = data?.actifSettings;
  console.log(actifSettings, data);
  const simpleSettings = data?.simpleSettings;
  const [ConfirmationModalOpen, setConfirmationModalOpen] =
    React.useState(false);
  const [ConfirmationModalMessage, setConfirmationModalMessage] =
    React.useState("");

  const openSimpleSettingsModal = () => {
    const modal = document.getElementById(
      "modify_simple_settings"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const openActifSettingsModal = () => {
    const modal = document.getElementById(
      "modify_actif_settings"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleCloseModal = () => {
    const modalSimple = document.getElementById(
      "modify_simple_settings"
    ) as HTMLDialogElement | null;
    if (modalSimple) {
      modalSimple.close();
    }
    const modalActif = document.getElementById(
      "modify_actif_settings"
    ) as HTMLDialogElement | null;
    if (modalActif) {
      modalActif.close();
    }
  };
  return (
    <div>
      <PageHeader
        title="Rejoins Nous !"
        icon={<FaUserPlus />}
        subtitle="
      Rejoins notre equipe en t'inscrivant sur HelloAsso"
      >
        {isAuthenticated && (
          <div className="flex flex-col w-full items-center justify-center p-4 gap-4 md:flex-row ">
            <ConfirmationModal
              title="Confirmation de mise à jour"
              message={ConfirmationModalMessage}
              open={ConfirmationModalOpen}
              setOpen={setConfirmationModalOpen}
            />
            <button
              className="btn w-1/3 btn-sm btn-secondary "
              onClick={() => {
                openActifSettingsModal();
              }}
            >
              <FaEdit className="w-10 mr-2" />
              Modifier adhésion membres actif
            </button>
            <dialog id="modify_actif_settings" className="modal">
              <div className="modal-box w-full max-w-md">
                <h3 className="font-bold text-lg mb-4">
                  Modifier adhésion membres actif
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCloseModal();
                    const formData = new FormData(e.currentTarget);
                    const url = formData.get("url") as string;
                    const price = parseFloat(formData.get("price") as string);
                    updateActifMembersSettingsMutation.mutate(
                      { url, price },
                      {
                        onSuccess: () => {
                          handleCloseModal();
                          setConfirmationModalMessage(
                            "Les paramètres d'adhésion actif ont été mis à jour avec succès."
                          );
                          setConfirmationModalOpen(true);
                        },
                      }
                    );
                  }}
                >
                  {/* Form fields for modifying actif members settings */}
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">URL</span>
                    </label>
                    <input
                      type="text"
                      name="url"
                      defaultValue={actifSettings?.url}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Price</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      defaultValue={actifSettings?.price}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Sauvegarder
                    </button>
                  </div>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
            <button
              className="btn w-1/3 btn-sm  btn-secondary "
              onClick={() => {
                openSimpleSettingsModal();
              }}
            >
              <FaEdit className="w-10 mr-2" />
              Modifier adhésion membres simple
            </button>
            <dialog id="modify_simple_settings" className="modal">
              <div className="modal-box w-full max-w-md">
                <h3 className="font-bold text-lg mb-4">
                  Modifier adhésion membres simple
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const url = formData.get("url") as string;
                    updateSimpleMembersSettingsMutation.mutate(
                      { url },
                      {
                        onSuccess: () => {
                          handleCloseModal();
                          setConfirmationModalMessage(
                            "Les paramètres d'adhésion simple ont été mis à jour avec succès."
                          );
                          setConfirmationModalOpen(true);
                        },
                      }
                    );
                  }}
                >
                  {/* Form fields for modifying simple members settings */}
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">URL</span>
                    </label>
                    <input
                      type="text"
                      name="url"
                      defaultValue={simpleSettings?.url}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Sauvegarder
                    </button>
                  </div>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
        )}
      </PageHeader>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg ">
          <div className="sticky left-0 top-20 text-center backdrop-blur-[1px] p-2 rounded-2xl mb-6 flex flex-col  sm:flex-row w-fit justify-center gap-4 ml-auto mr-auto">
            {error ? (
              <div className="alert alert-error">
                <p>Erreur lors du chargement des paramètres.</p>
              </div>
            ) : (
              <>
                <a
                  href={actifSettings?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-primary btn-lg text-primary-content shadow-lg hover:shadow-xl  hover:scale-105 transition-all flex items-center gap-2 ${
                    isLoading ? "btn-disabled" : ""
                  }`}
                  aria-disabled={isLoading}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaUserPlus />
                  )}
                  Devenir membre actif
                </a>
                <a
                  href={simpleSettings?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-secondary btn-lg text-primary-content shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 ${
                    isLoading ? "btn-disabled" : ""
                  }`}
                  aria-disabled={isLoading}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaUserPlus />
                  )}
                  Adhésion simple
                </a>
              </>
            )}
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
            <span className="text-primary font-bold">
              {isLoading
                ? "Chargement..."
                : error
                ? "Erreur"
                : `${actifSettings?.price} euros`}
            </span>{" "}
            :
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
