import React from "react";
import { FaCalendar } from "react-icons/fa";

interface AddToCalendarButtonProps {
  eventName: string;
  startDate: Date;
  endDate: Date;
  description: string;
  location: string;
  filename?: string;
}

const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({
  eventName,
  startDate,
  endDate,
  description,
  location,
  filename = "event.ics",
}) => {
  const formatISCString = (date: Date | string): string => {
    console.log("Formatting date:", date);
    return (
      new Date(date).toISOString().replace(/[-:.]/g, "").substring(0, 15) + "Z"
    );
  };

  const handleClick = () => {
    if (!startDate || !endDate) {
      console.log(startDate, endDate);
      console.error("Start date or end date is undefined");
      return;
    }
    const startUTC = formatISCString(startDate);
    const endUTC = formatISCString(endDate);
    const createdUTC = formatISCString(new Date());
    const safeDescription = description.replace(/\n/g, "\\n");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `UID:${createdUTC}@your-website.com`,
      `DTSTAMP:${createdUTC}`,
      `DTSTART:${startUTC}`,
      `DTEND:${endUTC}`,
      `SUMMARY:${eventName}`,
      `DESCRIPTION:${safeDescription}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const file = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(file);
    const element = document.createElement("a");
    element.href = url;
    element.download = filename;
    element.style.display = "none";
    console.log("ICS file created");
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  };

  return (
    <button className="btn btn-primary" onClick={handleClick}>
      <FaCalendar /> Ajouter au calendrier
    </button>
  );
};

export default AddToCalendarButton;
