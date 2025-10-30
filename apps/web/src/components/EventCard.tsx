import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaUser, FaCalendarAlt, FaStar } from "react-icons/fa";
import type { EventsWithTags } from "@lafineequipe/types";
import { FaLocationPin } from "react-icons/fa6";
import datesToString from "../utils/datesToString";

import { useChangeEventMemorability } from "../hooks/EventHooks";
import { useAuth } from "./AuthProvider";

const EventsCard: React.FC<{
  events: EventsWithTags | undefined;
  className?: string;
  loading?: boolean;
}> = ({ events, loading = false, className }) => {
  const { mutate } = useChangeEventMemorability();
  const { isAuthenticated } = useAuth();
  if (loading) {
    return (
      <div
        className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300 border border-base-300/50 h-fit overflow-hidden ${className}`}
      >
        <div className="card-body flex flex-col justify-between h-full p-4 sm:p-6">
          {/* Image skeleton */}
          <div className="skeleton w-full h-32 sm:h-40 rounded-lg"></div>

          {/* Content skeleton */}
          <div className="flex flex-col gap-3 mt-3 sm:mt-4">
            {/* Title skeleton */}
            <div className="skeleton h-6 w-3/4 rounded"></div>

            {/* Metadata skeleton */}
            <div className="space-y-2">
              <div className="skeleton h-4 w-1/2 rounded"></div>
              <div className="skeleton h-4 w-2/3 rounded"></div>
              <div className="skeleton h-4 w-1/3 rounded"></div>
            </div>
          </div>

          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-1 mt-3">
            <div className="skeleton h-5 w-12 rounded-full"></div>
            <div className="skeleton h-5 w-12 rounded-full"></div>
            <div className="skeleton h-5 w-12 rounded-full"></div>
          </div>

          {/* Button skeleton */}
          <div className="mt-4 sm:mt-6">
            <div className="skeleton h-10 w-full sm:w-40 rounded-lg"></div>
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
      className={`card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-300/50 hover:border-primary/50 overflow-hidden h-full flex flex-col ${className}`}
    >
      {isAuthenticated && (
        <div
          className="absolute top-2 right-2 cursor-pointer z-10"
          onClick={() => {
            mutate({
              id: events.id,
              memorable: !events.memorable,
            });
            console.log({
              id: events.id,
              memorable: !events.memorable,
            });
          }}
        >
          <FaStar
            className={
              events.memorable
                ? "w-6 h-6 text-yellow-400 "
                : "w-6 h-6 text-gray-400 "
            }
          />
        </div>
      )}

      {/* Image Container */}
      <figure className="relative w-full h-48  overflow-hidden bg-base-200">
        <img
          src={events.thumbnailUrl || "/LFE_lézard_nu_2.png"}
          alt={events.title || "Event Thumbnail"}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </figure>

      {/* Card Body */}
      <div className="card-body flex flex-col justify-between  p-3 sm:p-4 md:p-6 gap-2 sm:gap-3 md:gap-4">
        {/* Title */}
        <div>
          <h2 className="card-title text-secondary text-lg sm:text-xl md:text-2xl font-bold line-clamp-2 leading-snug">
            {events.title || "Événement sans titre"}
          </h2>
        </div>

        {/* Metadata Section */}
        <div className="flex-1 space-y-1 sm:space-y-1.5 text-xs sm:text-sm">
          {/* Author */}
          {events.author && (
            <div className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors">
              <FaUser className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary flex-shrink-0" />
              <span className="truncate font-medium">{events.author}</span>
            </div>
          )}

          {/* Date */}
          {events.startDate && (
            <div className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors">
              <FaCalendarAlt className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary flex-shrink-0" />
              <span className="truncate">
                {datesToString(events.startDate, events.endDate)}
              </span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors">
            <FaLocationPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary flex-shrink-0" />
            <span className="truncate">{events.location}</span>
          </div>
        </div>

        {/* Tags Section */}
        {events.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {events.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="badge badge-primary badge-sm text-xs font-semibold"
              >
                {tag.name}
              </span>
            ))}
            {events.tags.length > 3 && (
              <span className="badge badge-primary/50 badge-sm text-xs">
                +{events.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Button */}
        <div className="card-actions mt-2 sm:mt-3">
          <Link
            to={`/events/${events.slug}`}
            className="btn btn-primary btn-sm w-full sm:w-auto gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <span>Voir l&apos;événement</span>
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsCard;
