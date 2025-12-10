import { Timestamp } from "firebase/firestore";

interface EventInterface {
  id: string; // Added optional ID for frontend convenience
  attendees: string[];
  createdAt: Timestamp | Date;
  createdBy: string;
  creatorName: string;
  date: Timestamp | Date;
  description: string;
  endTime: Timestamp | Date;
  location: string;
  startTime: Timestamp | Date;
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

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

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
    const req = await fetch(`${API_URL}/api/events`, requestConfig);
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
    const req = await fetch(`${API_URL}/api/events/${id}`, requestConfig);
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
const getEvent = async (uid: string = "", bearerToken: string = "") => {
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
    const req = await fetch(`${API_URL}/api/events/${uid}`, requestConfig);
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
    const req = await fetch(`${API_URL}/api/events`, requestConfig);
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
      `${API_URL}/api/events/${id}/subscribe`,
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

export {
  getEvent,
  getAllEvents,
  createEvent,
  updateEvent,
  toggleSubscribe,
  EventInterface,
};
