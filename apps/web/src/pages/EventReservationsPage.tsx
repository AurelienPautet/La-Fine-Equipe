import React from "react";
import { useReservationsForEvent } from "../hooks/ReservationHooks";
import PageHeader from "../components/PageHeader";
import { FaChartColumn, FaArrowLeft } from "react-icons/fa6";
import { useParams, Link } from "react-router-dom";
import { useEvent } from "../hooks/EventHooks";
import { TbError404 } from "react-icons/tb";

const EventReservationsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: eventData, isLoading: eventLoading } = useEvent(slug!);

  const {
    data: reservations,
    isLoading: reservationsLoading,
    isError,
  } = useReservationsForEvent(slug!);

  const isLoading = eventLoading || reservationsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent to-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-xl text-base-content">
            Chargement des réservations...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent to-base-200 flex items-center justify-center">
        <div className="text-center w-full flex items-center flex-col">
          <TbError404 className="w-20 h-20" />
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Données non trouvées
          </h1>
          <p className="text-lg text-base-content mb-8">
            Désolé, nous n'avons pas pu charger les réservations.
          </p>
          <Link to="/events" className="btn btn-primary btn-lg">
            ← Retour aux événements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-base-200">
      {/* Header */}
      <PageHeader
        title="Réservations"
        subtitle={`Consultez toutes les réservations pour ${eventData?.title}`}
        icon={<FaChartColumn className="w-10 h-10" />}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link
              to={`/events/${slug}`}
              className="btn btn-outline btn-primary hover:btn-primary transition-all duration-300 flex items-center gap-2"
            >
              <FaArrowLeft className="w-4 h-4" />
              Retour à l'événement
            </Link>
          </div>

          {/* Reservations List */}
          <div className="card bg-base-100 shadow-2xl border-2 border-primary/20">
            <div className="card-body p-6 lg:p-8">
              <h2 className="card-title text-2xl text-secondary mb-6">
                Liste des réservations ({reservations?.length || 0})
              </h2>

              {reservations && reservations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Téléphone</th>
                        <th>Membre</th>
                        <th>Réservé le</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((reservation) => (
                        <tr
                          key={reservation.id}
                          className="hover:bg-secondary/10 transition-colors"
                        >
                          <td className="font-medium text-base-content">
                            {reservation.lastName}
                          </td>
                          <td className="text-base-content">
                            {reservation.firstName}
                          </td>
                          <td className="text-base-content/70">
                            {reservation.phone}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                reservation.isMember
                                  ? "badge-success"
                                  : "badge-warning"
                              }`}
                            >
                              {reservation.isMember ? "Oui" : "Non"}
                            </span>
                          </td>
                          <td className="text-base-content/70">
                            {reservation.reservedAt &&
                              new Date(
                                reservation.reservedAt
                              ).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">
                  <span>Aucune réservation pour cet événement.</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="text-center mt-12">
            <Link
              to={`/events/${slug}`}
              className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Retour à l'événement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventReservationsPage;
