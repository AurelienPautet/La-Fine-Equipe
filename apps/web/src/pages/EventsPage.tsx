import React, { useMemo } from "react";
import { FaCalendarCheck, FaPlus, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import EventsCard from "../components/EventCard";
import type { EventsWithTags } from "@lafineequipe/types";
import { useEvents } from "../hooks/EventHooks";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../components/AuthProvider";

const EventsPage: React.FC = () => {
  const { data: events, isLoading, isError, error } = useEvents();
  const { isAuthenticated } = useAuth();
  const { upcomingEvents, pastEvents } = useMemo(() => {
    if (!events) return { upcomingEvents: [], pastEvents: [] };

    const now = new Date();
    const upcoming: EventsWithTags[] = [];
    const past: EventsWithTags[] = [];

    events.forEach((event) => {
      const eventStartDate = new Date(event.startDate);
      if (eventStartDate >= now) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    upcoming.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center">
        <PageHeader
          title="Nos Events"
          subtitle="Découvrez nos derniers events, événements et aventures de La Fine Équipe"
          icon={<FaCalendarCheck className="w-12 h-12" />}
          className="py-20 w-full"
        />
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <FaCalendarCheck className="w-6 h-6" />
          <span>
            Erreur lors du chargement des événements: {error?.message}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <PageHeader
        title="Événements"
        subtitle="Découvrez les derniers événements de La Fine Équipe"
        icon={<FaCalendarCheck className="w-12 h-12" />}
        className="py-20"
      >
        {/* Create New Events Button */}
        {isAuthenticated && (
          <div className="mt-8">
            <Link
              to="/events/create"
              className="btn btn-secondary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaPlus className="w-5 h-5" />
              Créer un nouvel événement
            </Link>
          </div>
        )}
      </PageHeader>

      {/* Events Section */}
      <div className="container mx-auto px-4 py-16">
        {events && events.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            {/* Upcoming Events Section */}
            {upcomingEvents.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center justify-center w-full  gap-4 mb-8">
                  <h2 className="text-4xl font-bold text-base-content">
                    Événements à venir
                  </h2>
                  <span className="badge badge-primary badge-lg">
                    {upcomingEvents.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingEvents.map((event: EventsWithTags) => (
                    <EventsCard key={event.id} events={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events Section */}
            {pastEvents.length > 0 && (
              <div>
                <div className="flex items-center justify-center w-full gap-4 mb-8">
                  <h2 className="text-4xl font-bold text-base-content">
                    Événements passés
                  </h2>
                  <span className="badge badge-neutral badge-lg">
                    {pastEvents.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                  {pastEvents.map((event: EventsWithTags) => (
                    <EventsCard key={event.id} events={event} />
                  ))}
                </div>
              </div>
            )}

            {/* No events message */}
            {upcomingEvents.length === 0 && pastEvents.length === 0 && (
              <div className="text-center">
                <div className="bg-base-100 rounded-xl p-12 shadow-lg">
                  <FaCalendarCheck className="w-16 h-16 mx-auto mb-6 text-primary/50" />
                  <h3 className="text-2xl font-bold mb-4 text-base-content">
                    Aucun événement pour le moment
                  </h3>
                  {isAuthenticated && (
                    <>
                      <p className="text-base-content/70 mb-8">
                        Soyez le premier à créer un événement !
                      </p>
                      <Link
                        to="/events/create"
                        className="btn btn-primary btn-lg gap-2"
                      >
                        <FaPlus className="w-5 h-5" />
                        Créer le premier événement
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-base-100 rounded-xl p-12 shadow-lg">
              <FaCalendarCheck className="w-16 h-16 mx-auto mb-6 text-primary/50" />
              <h3 className="text-2xl font-bold mb-4 text-base-content">
                Aucun événement pour le moment
              </h3>
              {isAuthenticated && (
                <>
                  <p className="text-base-content/70 mb-8">
                    Soyez le premier à créer un événement !
                  </p>
                  <Link
                    to="/events/create"
                    className="btn btn-primary btn-lg gap-2"
                  >
                    <FaPlus className="w-5 h-5" />
                    Créer le premier événement
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
