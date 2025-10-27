import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaUser,
  FaCalendarAlt,
  FaTag,
  FaCalendar,
} from "react-icons/fa";
import type { EventsWithTags } from "@lafineequipe/types";
import { FaLocationPin } from "react-icons/fa6";

const EventsCard: React.FC<{
  events: EventsWithTags | undefined;
  className?: string;
  loading?: boolean;
}> = ({ events, loading = false, className }) => {
  if (loading) {
    return (
      <div
        className={`card bg-base-100 shadow-xl border-2 border-primary/20 h-fit ${className}`}
      >
        <div className="card-body flex flex-col justify-between h-full p-6">
          <div className="skeleton w-full h-24 rounded-lg"></div>

          <div className="flex items-start gap-3 mt-4">
            <div className="skeleton h-6 w-6 rounded-lg flex-shrink-0"></div>

            <div className="flex-1 min-w-0">
              <div className="skeleton h-6 w-3/4 mb-3"></div>

              <div className="space-y-2 h-20">
                <div className="skeleton h-4 w-1/2"></div>
                <div className="skeleton h-4 w-2/3"></div>
                <div className="skeleton h-4 w-1/3"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-4">
            <div className="skeleton h-4 w-12 rounded"></div>
            <div className="skeleton h-4 w-12 rounded"></div>
            <div className="skeleton h-4 w-12 rounded"></div>
          </div>
          <div className="card-actions justify-end mt-4">
            <div className="skeleton h-8 w-32 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!events) {
    return null;
  }

  return (
    <div
      className={`card h-fit bg-base-100 shadow-xl border-2 border-primary/20 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 transform hover:scale-105  ${className}`}
    >
      <div className="card-body flex flex-col justify-between h-full p-6">
        <img
          src={events.thumbnailUrl || "/LFE_lézard_nu_2.png"}
          alt="Event Thumbnail"
          className="w-full h-24 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex items-start gap-3">
          <div className="badge badge-primary badge-lg flex-shrink-0">
            <FaCalendar className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Fixed height title with truncation */}
            <h2 className="card-title text-secondary text-xl mb-3 h-14 line-clamp-2">
              {events.title || "Events sans titre"}
            </h2>

            {/* Metadata Section with fixed space */}
            <div className="space-y-2 h-20 overflow-hidden">
              {/* Author */}
              {events.author && (
                <div className="flex items-center gap-2 text-base-content/60">
                  <FaUser className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="text-sm truncate">{events.author}</span>
                </div>
              )}

              {/* Date */}
              {events.startDate && (
                <div className="flex items-center gap-2 text-base-content/60">
                  <FaCalendarAlt className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="text-sm truncate">
                    {new Date(events.startDate).toLocaleString("fr-FR")}
                    {" - "}
                    {new Date(events.endDate).toLocaleDateString("fr-FR") ==
                    new Date(events.startDate).toLocaleDateString("fr-FR")
                      ? new Date(events.endDate).toLocaleTimeString("fr-FR")
                      : new Date(events.endDate).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              )}

              {/* Location */}
              <div className="flex items-center gap-2 text-base-content/60">
                <FaLocationPin className="w-3 h-3 text-primary flex-shrink-0" />
                <span className="text-sm truncate">{events.location}</span>
              </div>

              {/* Tags with fixed height and overflow handling */}
              {events.tags.length > 0 && (
                <div className="flex items-start gap-2 text-base-content/60">
                  <FaTag className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1 overflow-hidden max-h-8">
                    {events.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="badge badge-primary badge-xs flex-shrink-0"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {events.tags.length > 3 && (
                      <span className="badge badge-primary badge-xs flex-shrink-0">
                        +{events.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed position button at bottom */}
        <div className="card-actions justify-end mt-4">
          <Link
            to={`/events/${events.slug}`}
            className="btn btn-primary btn-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
          >
            Voir l'événement
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsCard;
