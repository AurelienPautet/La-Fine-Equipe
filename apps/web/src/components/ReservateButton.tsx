import React, { useEffect } from "react";

import { useCreateReservation } from "../hooks/ReservationHooks";
import AddToCalendarButton from "./AddToCalendarButton";

interface ReservateButtonProps {
  eventId: number | undefined;
  eventTitle?: string;
  eventStartDate?: Date;
  eventEndDate?: Date;
  eventLocation?: string;
  color?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

const ReservateButton: React.FC<ReservateButtonProps> = ({
  eventId,
  eventTitle,
  eventStartDate,
  eventEndDate,
  eventLocation,
  color = "primary",
  size = "lg",
}) => {
  const createReservationMutation = useCreateReservation();

  const openModal = () => {
    const modal = document.getElementById(
      "my_modal_1"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };
  const handleCloseModal = () => {
    const modal = document.getElementById(
      "my_modal_1"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  const [reservationData, setReservationData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    isMember: false,
  });

  const storeInLocalStorage = (data: typeof reservationData) => {
    localStorage.setItem("reservationData", JSON.stringify(data));
  };

  useEffect(() => {
    const data = localStorage.getItem("reservationData");
    console.log("Loaded reservation data from localStorage:", data);
    if (data) {
      setReservationData(JSON.parse(data));
    }
  }, []);

  const [status, setStatus] = React.useState("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReservationData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!eventId) {
      alert("Invalid event ID");
      return;
    }
    setStatus("submitting");
    createReservationMutation.mutate(
      {
        eventId: eventId,
        firstName: reservationData.firstName,
        lastName: reservationData.lastName,
        email: reservationData.email,
        isMember: reservationData.isMember,
      },
      {
        onSuccess: () => {
          setStatus("success");
          storeInLocalStorage(reservationData);
        },
        onError: (error) => {
          console.error("Error creating events:", error);
          setStatus("error");
        },
      }
    );
  };

  if (eventEndDate && new Date(eventStartDate!) < new Date()) {
    return null;
  }

  return (
    <div>
      <button
        className={`btn btn-${color} btn-${size} text-primary-content shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2`}
        onClick={openModal}
      >
        Réserver ma place
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Réserver ma place</h3>
          <p className="py-2">
            Vous êtes sur le point de réserver une place pour l'événement:{" "}
            <strong>{eventTitle || "cet événement"}</strong>
          </p>
          {status === "success" && (
            <div className="flex flex-col items-center">
              <p className="text-success">Réservation réussie!</p>
              <AddToCalendarButton
                eventName={eventTitle || "Événement"}
                startDate={eventStartDate || new Date()} // Replace with actual event start time
                endDate={eventEndDate || new Date()} // Replace with actual event end time
                description={`Réservation pour l'événement: ${
                  eventTitle || "Événement"
                }`}
                location={eventLocation || "Lieu de l'événement"} // Replace with actual location
                filename="reservation.ics"
              />
              <button
                className="btn btn-primary mt-4"
                onClick={handleCloseModal}
              >
                Fermer
              </button>
            </div>
          )}

          {(status === "idle" ||
            status === "error" ||
            status === "submitting") && (
            <div className="modal-action">
              <form
                method="dialog"
                className="w-full flex flex-col items-center"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="eventId" value={eventId} />

                <div className="form-control flex flex-col gap-2 mb-4 w-full justify-center items-center">
                  <label className="label">
                    <span className="label-text text-lg text-base-content">
                      Prénom
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered input-primary text-lg"
                    name="firstName"
                    value={reservationData.firstName}
                    onChange={handleInputChange}
                    disabled={status === "submitting"}
                  />
                </div>

                <div className="form-control flex flex-col gap-2 mb-4 w-full justify-center items-center">
                  <label className="label">
                    <span className="label-text text-lg text-base-content">
                      Nom de famille
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered input-primary text-lg"
                    name="lastName"
                    value={reservationData.lastName}
                    onChange={handleInputChange}
                    disabled={status === "submitting"}
                  />
                </div>

                <div className="form-control flex flex-col gap-2 mb-4 w-full justify-center items-center">
                  <label className="label">
                    <span className="label-text text-lg text-base-content">
                      Adresse Email
                    </span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered input-primary text-lg"
                    name="email"
                    value={reservationData.email}
                    onChange={handleInputChange}
                    disabled={status === "submitting"}
                  />
                </div>

                <div className="form-control flex flex-col gap-2 mb-4 w-full justify-center items-center">
                  <label className="label cursor-pointer">
                    <span className="label-text text-lg text-base-content">
                      Êtes-vous membre de La Fine Équipe?
                    </span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary ml-2"
                      name="isMember"
                      checked={reservationData.isMember}
                      onChange={(e) =>
                        setReservationData((prevData) => ({
                          ...prevData,
                          isMember: e.target.checked,
                        }))
                      }
                      disabled={status === "submitting"}
                    />
                  </label>
                </div>

                {status === "submitting" && (
                  <div className="flex flex-col items-center">
                    <p className="text-info">Réservation en cours...</p>
                  </div>
                )}

                <div className="flex flew-row justify-center w-full pr-20 pl-20 mt-2">
                  <button
                    className="btn btn-ghost mr-4"
                    type="button"
                    onClick={handleCloseModal}
                  >
                    Annuler
                  </button>
                  <button
                    className="btn btn-primary flex-2 w-full"
                    type="submit"
                  >
                    Réserver
                  </button>
                </div>
              </form>
            </div>
          )}
          {status === "error" && (
            <p className="w-full text-center mt-10  text-error">
              Erreur lors de la réservation.
            </p>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default ReservateButton;
