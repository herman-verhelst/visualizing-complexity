import {Edition} from "../models/edition";

export function convertRemToPixels(rem: number): number {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function calculateAverageSpeed(edition: Edition): number {
  // Convert time to total hours
  const totalTimeInHours =
    edition.time.hours + edition.time.minutes / 60 + edition.time.seconds / 3600;

  // Calculate average speed (distance / time)
  return edition.distance / totalTimeInHours;
}
