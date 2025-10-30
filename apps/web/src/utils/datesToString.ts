export default function datesToString(startDate: Date, endDate: Date): string {
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  const startDateString = startDate.toLocaleString("fr-FR");
  const startDateOnly = startDate.toLocaleDateString("fr-FR");
  const endDateOnly = endDate.toLocaleDateString("fr-FR");
  let endString: string;

  if (startDateOnly === endDateOnly) {
    endString = endDate.toLocaleTimeString("fr-FR");
    return `${startDateString} - ${endString}`;
  } else {
    endString = endDate.toLocaleString("fr-FR");
    return `${startDateString} - ${endString}`;
  }
}
