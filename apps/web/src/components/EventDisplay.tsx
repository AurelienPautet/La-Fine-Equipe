import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { FaUser, FaCalendarAlt, FaTag } from "react-icons/fa";
import type { Tag } from "@lafineequipe/types";
import { FaLocationPin, FaUserGroup } from "react-icons/fa6";
import ReservateButton from "./ReservateButton";
import datesToString from "../utils/datesToString";
interface EventsMetadata {
  title: string;
  author: string;
  startDate: Date;
  endDate: Date;
  location: string;
  maxAttendees?: number | null;
  thumbnailUrl?: string | null;
  tags: Tag[];
  id?: number;
}

interface EventsDisplayProps {
  metadata: EventsMetadata;
  content: string;
  isPreview?: boolean;
}

const EventsDisplay: React.FC<EventsDisplayProps> = ({
  metadata,
  content,
  isPreview = false,
}) => {
  return (
    <article className="w-full">
      {/* Events Header */}
      <header className="mb-8 pb-6 border-b border-base-300">
        {/* Title */}
        <h1
          className={`font-bold text-secondary mb-4 ${
            isPreview ? "text-2xl lg:text-3xl" : "text-3xl lg:text-4xl"
          }`}
        >
          {metadata.title || "Titre de l'events"}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm lg:text-base text-base-content/70">
          {/* Author */}
          {metadata.author && (
            <div className="flex items-center gap-2">
              <FaUser className="w-4 h-4 text-primary" />
              <span>{metadata.author}</span>
            </div>
          )}

          {/* Date */}
          {metadata.startDate && (
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="w-4 h-4 text-primary" />
              {datesToString(metadata.startDate, metadata.endDate)}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-2">
            <FaLocationPin className="w-4 h-4 text-primary" />
            <span>{metadata.location}</span>
          </div>

          {/* Max Attendees */}
          {metadata.maxAttendees && (
            <div className="flex items-center gap-2">
              <FaUserGroup className="w-4 h-4 text-primary" />
              <span>Capacité:</span>
              <span>{metadata.maxAttendees}</span>
            </div>
          )}

          {/* Tags */}
          {metadata.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <FaTag className="w-4 h-4 text-primary" />
              <div className="flex flex-wrap gap-1">
                {metadata.tags.map((tag, index) => (
                  <span key={index} className="badge badge-primary badge-sm">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Reservation Button */}
      {new Date(metadata.startDate) > new Date() && (
        <div className="w-full flex items-center justify-center sticky left-0 top-20 p-2">
          <ReservateButton
            eventId={metadata.id}
            eventTitle={metadata.title}
            eventStartDate={metadata.startDate}
            eventEndDate={metadata.endDate}
            eventLocation={metadata.location}
          />
        </div>
      )}
      {/* Events Content */}
      <div
        className={`prose max-w-none prose-headings:text-secondary prose-a:text-primary hover:prose-a:text-primary-focus prose-strong:text-secondary prose-code:bg-primary/10 prose-code:text-primary prose-code:px-2 prose-code:py-1 prose-code:rounded ${
          isPreview ? "prose-sm lg:prose-base" : "prose-lg"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {content || "*Votre contenu apparaîtra ici...*"}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default EventsDisplay;
