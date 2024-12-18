import { toZonedTime } from "date-fns-tz";

function getCurrentTime(timeZone: string): Date {
  const now = new Date();
  return toZonedTime(now, timeZone);
}

export { getCurrentTime };
