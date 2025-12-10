import { Timestamp } from "firebase/firestore";

/**
 * Interface representing the raw structure we might receive from the Java backend
 * or a serialized Firestore timestamp.
 */
interface FirestoreTimestampLike {
  seconds: number;
  nanos?: number; // From Java Backend
  nanoseconds?: number; // From Firestore JS SDK
}

/**
 * Converts a Firestore Timestamp (or backend JSON equivalent) to a native JavaScript Date object.
 * Handles both Java backend format (nanos) and Firebase JS format (nanoseconds).
 */
const timestampToDate = (
  ts: FirestoreTimestampLike | Timestamp | null | undefined
): Date => {
  if (!ts) {
    return new Date();
  }

  // Check for seconds
  const seconds = ts.seconds ?? 0;

  // Check for nanoseconds (JS SDK) OR nanos (Java Backend)
  const val = ts as any;
  const nanoseconds = val.nanoseconds ?? val.nanos ?? 0;

  // Convert to milliseconds
  const milliseconds = seconds * 1000 + nanoseconds / 1000000;

  return new Date(milliseconds);
};

/**
 * Formats a timestamp into a readable Date string (e.g., "Fri, Dec 25, 2026")
 */
const formatDateString = (
  ts: FirestoreTimestampLike | Timestamp | null | undefined
): string => {
  const date = timestampToDate(ts);
  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Formats a timestamp into a readable Time string (e.g., "10:30 AM")
 */
const formatTimeString = (
  ts: FirestoreTimestampLike | Timestamp | null | undefined
): string => {
  const date = timestampToDate(ts);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Helper to get a "Range" string (e.g., "10:00 AM - 11:30 AM")
 */
const formatTimeRange = (
  start: FirestoreTimestampLike | Timestamp | null | undefined,
  end: FirestoreTimestampLike | Timestamp | null | undefined
): string => {
  const s = formatTimeString(start);
  const e = formatTimeString(end);
  if (!s || !e) return "";
  return `${s} - ${e}`;
};

/**
 * Checks if a Firestore timestamp is in the future compared to now.
 */
const isFuture = (
  ts: FirestoreTimestampLike | Timestamp | null | undefined
): boolean => {
  const date = timestampToDate(ts);
  return date > new Date();
};

export {
  timestampToDate,
  formatDateString,
  formatTimeString,
  formatTimeRange,
  isFuture,
    FirestoreTimestampLike
};
