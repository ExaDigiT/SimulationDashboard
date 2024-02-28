export function convertDateTimeString(datetime: string) {
  return new Date(datetime).toLocaleString("en-us", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
