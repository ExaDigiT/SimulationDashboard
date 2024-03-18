import { format } from "date-fns";

export function convertDateTimeString(datetime: string | null) {
  if (!datetime) return "-";

  return format(new Date(datetime).toISOString(), "MM/dd/yyyy, HH:mm z");
}
