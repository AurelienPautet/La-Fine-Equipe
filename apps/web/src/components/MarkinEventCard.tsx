import React from "react";

interface MarkinEventCardProps {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  articleUrl?: string;
}

const MarkinEventCard: React.FC<MarkinEventCardProps> = ({
  title,
  description,
  date,
  imageUrl,
  articleUrl,
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>{date}</p>
      <img src={imageUrl} alt={title} />
      {articleUrl && <a href={articleUrl}>Read more</a>}
    </div>
  );
};
export default MarkinEventCard;
