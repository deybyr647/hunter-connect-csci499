/**
 * Interface representing the raw Firestore timestamp object received from the backend.
 */
interface FirestoreTimestamp {
  seconds: number;
  nanos: number;
}

interface EventInterface {
  id?: string; // Added optional ID for frontend convenience
  attendees: string[];
  createdAt: FirestoreTimestamp;
  createdBy: string;
  creatorName: string;
  date?: FirestoreTimestamp;
  description: string;
  endTime: FirestoreTimestamp;
  location: string;
  startTime: FirestoreTimestamp;
  tags: {
    courses: string[];
    general: string[];
  };
  title: string;
}

// Helper interface for API calls to include auth token and ID
interface EventApiRequest extends Partial<EventInterface> {
  bearerToken: string;
  id?: string; // Explicit ID for updates/gets
}

/**
 * POST /api/events
 * Creates a new event.
 * Note: Backend sets createdBy, creatorName, and createdAt automatically.
 */
const createEvent = async (body: EventApiRequest, bearerToken: string) => {
  const { ...eventData } = body;

  const requestConfig: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
    body: JSON.stringify(eventData),
    mode: "cors",
    credentials: "omit",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const req = await fetch("http://localhost:8080/api/events", requestConfig);
    const json: EventInterface = await req.json();

    if (req.status === 201) {
      console.log("Event Created:", json);
      return json;
    } else {
      console.error("Create Event Failed:", json);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * PUT /api/events/{id}
 * Updates an existing event.
 */
const updateEvent = async (body: EventApiRequest, bearerToken: string) => {
  const { id, ...updates } = body;

  if (!id) throw new Error("Event ID is required for updates.");

  const requestConfig: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
    body: JSON.stringify(updates),
    mode: "cors",
    credentials: "omit",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const req = await fetch(
      `http://localhost:8080/api/events/${id}`,
      requestConfig
    );
    const json: EventInterface = await req.json();

    if (req.status === 200) {
      console.log("Event Updated:", json);
      return json;
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * GET /api/events/{id}
 * Fetches a single event.
 */
const getEvent = async (body: EventApiRequest, bearerToken: string) => {
  const { id } = body;

  const requestConfig: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
    mode: "cors",
    credentials: "omit",
    cache: "no-cache",
  };

  try {
    const req = await fetch(
      `http://localhost:8080/api/events/${id}`,
      requestConfig
    );
    const json: EventInterface = await req.json();

    if (req.status === 200) {
      return json;
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * GET /api/events
 * Fetches all events.
 */
const getAllEvents = async (bearerToken: string) => {
  const requestConfig: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`, // Backend requires auth
      Accept: "application/json",
    },
    mode: "cors",
    credentials: "omit",
    cache: "no-cache",
  };

  try {
    const req = await fetch(`http://localhost:8080/api/events`, requestConfig);
    const json: EventInterface[] = await req.json();

    if (req.status === 200) {
      return json; // Returns EventInterface[]
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * POST /api/events/{id}/subscribe
 * Toggles subscription status (join/leave event).
 */
const toggleSubscribe = async (body: EventApiRequest, bearerToken: string) => {
  const { id } = body;

  const requestConfig: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
    mode: "cors",
    credentials: "omit",
    cache: "no-cache",
  };

  try {
    const req = await fetch(
      `http://localhost:8080/api/events/${id}/subscribe`,
      requestConfig
    );
    const json = await req.json();

    if (req.status === 200) {
      console.log("Subscription Toggled:", json);
      return json;
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

/* Timestamp Helpers */

/**
 * Converts a Firestore Timestamp object to a native JavaScript Date object.
 * @param ts The timestamp object { seconds, nanos }
 * @returns Date object or null if input is invalid
 */
export const timestampToDate = (
  ts: FirestoreTimestamp | null | undefined
): Date | null => {
  if (!ts || typeof ts.seconds !== "number") return null;

  // Convert seconds to milliseconds
  const milliseconds = ts.seconds * 1000 + ts.nanos / 1000000;
  return new Date(milliseconds);
};

/**
 * Formats a timestamp into a readable Date string (e.g., "Fri, Dec 25, 2026")
 */
export const formatDateString = (
  ts: FirestoreTimestamp | null | undefined
): string => {
  const date = timestampToDate(ts);
  if (!date) return "N/A";

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
export const formatTimeString = (
  ts: FirestoreTimestamp | null | undefined
): string => {
  const date = timestampToDate(ts);
  if (!date) return "";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Helper to get a "Range" string (e.g., "10:00 AM - 11:30 AM")
 */
export const formatTimeRange = (
  start: FirestoreTimestamp,
  end: FirestoreTimestamp
): string => {
  const s = formatTimeString(start);
  const e = formatTimeString(end);
  if (!s || !e) return "";
  return `${s} - ${e}`;
};

export {
  EventInterface,
  EventApiRequest,
  createEvent,
  updateEvent,
  getEvent,
  getAllEvents,
  toggleSubscribe,
};
