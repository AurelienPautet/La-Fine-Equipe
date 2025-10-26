import React from "react";

interface MarkinEventCardProps {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  eventsUrl?: string;
}

const MarkinEventCard: React.FC<MarkinEventCardProps> = ({
  title,
  description,
  date,
  imageUrl,
  eventsUrl,
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>{date}</p>
      <img src={imageUrl} alt={title} />
      {eventsUrl && <a href={eventsUrl}>Read more</a>}
    </div>
  );
};
export default MarkinEventCard;
