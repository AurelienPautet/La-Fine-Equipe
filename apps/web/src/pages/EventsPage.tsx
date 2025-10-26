import React from "react";
import { FaBook, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import EventsCard from "../components/EventCard";
import type { EventsWithTags } from "../../../../packages/types/src/events";
import { useEvents } from "../hooks/EventHooks";
import PageHeader from "../components/PageHeader";
const EventsPage: React.FC = () => {
  let { data: events } = useEvents();
  if (events === undefined) {
    events = [];
  }
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <PageHeader
        title="Nos Events"
        subtitle="Découvrez nos derniers events, événements et aventures de La Fine Équipe"
        icon={<FaBook className="w-12 h-12" />}
        className="py-20"
      >
        {/* Create New Events Button */}
        <div className="mt-8">
          <Link
            to="/events/create"
            className="btn btn-secondary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaPlus className="w-5 h-5" />
            Créer un nouvel events
          </Link>
        </div>
      </PageHeader>

      {/* Events Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-base-content">
            Tous nos events
          </h2>

          {events.length === 0 ? (
            <div className="text-center">
              <div className="bg-base-100 rounded-xl p-12 shadow-lg">
                <FaBook className="w-16 h-16 mx-auto mb-6 text-primary/50" />
                <h3 className="text-2xl font-bold mb-4 text-base-content">
                  Aucun events pour le moment
                </h3>
                <p className="text-base-content/70 mb-8">
                  Soyez le premier à créer un events !
                </p>
                <Link
                  to="/events/create"
                  className="btn btn-primary btn-lg gap-2"
                >
                  <FaPlus className="w-5 h-5" />
                  Créer le premier events
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((events: EventsWithTags) => (
                <EventsCard key={events.id} events={events} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
