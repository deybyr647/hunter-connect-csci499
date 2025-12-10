import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "@/components/api/Firebase/firebaseConfig";

/* ----------------------------- EVENT TYPES ----------------------------- */

interface EventData {
  id: string;
  title: string;
  date: any;
  startTime?: any;
  endTime?: any;
  location?: string;
  description?: string;
  createdBy?: string;
  attendees?: string[];

  tags?: {
    general: string[];
    courses: string[];
  };

  createdAt?: any;
  creatorName?: string;
}

/* ----------------------------- MAIN SCREEN ----------------------------- */

export default function MyEventsScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [myEvents, setMyEvents] = useState<EventData[]>([]);
  const [subscribedEvents, setSubscribedEvents] = useState<EventData[]>([]);
  const [expiredEvents, setExpiredEvents] = useState<EventData[]>([]);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {}
  );
  /* ------------------------------ HELPERS ------------------------------ */

  const safeDate = (x: any) => {
    if (!x) return new Date();
    if (x.toDate) return x.toDate();
    if (x instanceof Date) return x;
    const d = new Date(x);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const isMine = (e: EventData) => e.createdBy === user?.uid;
  const isSubscribed = (e: EventData) =>
    e.attendees?.includes(user?.uid ?? "") ?? false;

  const isUpcoming = (e: EventData) => safeDate(e.endTime) >= new Date();

  const isExpired = (e: EventData) => safeDate(e.endTime) < new Date();

  const normalizeTags = (tags: any) => ({
    general: Array.isArray(tags?.general)
      ? tags.general
      : Object.values(tags?.general ?? {}),

    courses: Array.isArray(tags?.courses)
      ? tags.courses
      : Object.values(tags?.courses ?? {}),
  });

  const toggleDescription = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  /* -------------------------- RENDER EVENT CARD ------------------------- */

  const renderEvent = (e: EventData) => {
    const date = safeDate(e.date);
    const start = safeDate(e.startTime);
    const end = safeDate(e.endTime);
    const isExpanded = expandedCards[e.id] ?? false;
    return (
      <View key={e.id} style={styles.eventCard}>
        <Text style={styles.cardTitle}>{e.title}</Text>

        <Text style={styles.metaText}>
          Created by {e.creatorName} •{" "}
          {safeDate(e.createdAt).toLocaleDateString()}
        </Text>

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={16} color="#555" />
          <Text style={styles.cardDetail}>
            {date.toLocaleDateString()} •{" "}
            {start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>

        {e.location && (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="#e34d4d" />
            <Text style={styles.cardDetail}>{e.location}</Text>
          </View>
        )}

        <View style={styles.tagContainer}>
          {(e.tags?.general ?? []).map((t, i) => (
            <View key={i} style={styles.tagPurple}>
              <Text style={styles.tagPurpleText}>{t}</Text>
            </View>
          ))}

          {(e.tags?.courses ?? []).map((t, i) => (
            <View key={i} style={styles.tagGreen}>
              <Text style={styles.tagGreenText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* DESCRIPTION TOGGLE */}
        {e.description ? (
          <>
            {/* HEADER BUTTON */}
            <TouchableOpacity
              onPress={() => toggleDescription(e.id)}
              style={styles.descriptionHeader}
            >
              <Text style={styles.descriptionHeaderText}>
                Description {isExpanded ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>

            {/* COLLAPSIBLE AREA */}
            {isExpanded && (
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionFull}>{e.description}</Text>
              </View>
            )}
          </>
        ) : null}

        {/* Subscribe / Unsubscribe */}
        {e.createdBy !== user?.uid && (
          <TouchableOpacity
            style={isSubscribed(e) ? styles.unsubButton : styles.subButton}
            onPress={() => toggleSubscribe(e)}
          >
            <Text
              style={
                isSubscribed(e) ? styles.unsubButtonText : styles.subButtonText
              }
            >
              {isSubscribed(e) ? "Unsubscribe" : "Subscribe"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  /* ------------------------------ LOAD EVENTS ------------------------------ */

  useEffect(() => {
    if (!user) return;

    const loadEvents = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, "events")));

        const allEvents = await Promise.all(
          snapshot.docs.map(async (d) => {
            const data = d.data();
            let creatorName = "Unknown";

            if (data.createdBy) {
              const userDoc = await getDoc(doc(db, "users", data.createdBy));
              if (userDoc.exists()) {
                const u = userDoc.data();
                creatorName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
              }
            }

            return {
              id: d.id,
              ...data,
              creatorName,
              createdAt: data.createdAt?.toDate?.() ?? new Date(),
              tags: normalizeTags(data.tags),
            } as EventData;
          })
        );

        const upcoming = allEvents.filter(isUpcoming);
        const expired = allEvents.filter(isExpired);

        setMyEvents(upcoming.filter(isMine));
        setSubscribedEvents(upcoming.filter(isSubscribed));
        setExpiredEvents(expired.filter((e) => isMine(e) || isSubscribed(e)));
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    loadEvents();
  }, []);

  /* --------------------------- SUB / UNSUB LOGIC --------------------------- */

  const toggleSubscribe = async (event: EventData) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "events", event.id), {
        attendees: isSubscribed(event)
          ? arrayRemove(user.uid)
          : arrayUnion(user.uid),
      });

      // UI updates
      setSubscribedEvents((prev) =>
        isSubscribed(event)
          ? prev.filter((e) => e.id !== event.id)
          : [
              ...prev,
              { ...event, attendees: [...(event.attendees ?? []), user.uid] },
            ]
      );
    } catch (err) {
      console.error("Subscribe error:", err);
    }
  };

  /* ------------------------------ RETURN UI ------------------------------ */

  return (
    <Animated.View
      entering={SlideInRight.duration(250)}
      exiting={SlideOutRight.duration(200)}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          {/* HEADER */}

          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#5A31F4" />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>My Events</Text>

          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* CREATED BY ME */}
          <Text style={styles.sectionTitle}>Created by Me</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#5A31F4" />
          ) : myEvents.length ? (
            myEvents.map(renderEvent)
          ) : (
            <Text style={styles.empty}>You haven't created any events.</Text>
          )}

          {/* SUBSCRIBED */}
          <Text style={styles.sectionTitle}>Subscribed</Text>
          {subscribedEvents.length ? (
            subscribedEvents.map(renderEvent)
          ) : (
            <Text style={styles.empty}>
              You are not subscribed to any events.
            </Text>
          )}

          {/* EXPIRED */}
          <Text style={styles.sectionTitle}>Past Events</Text>
          {expiredEvents.length ? (
            expiredEvents.map(renderEvent)
          ) : (
            <Text style={styles.empty}>No past events to show.</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

/* ------------------------------- STYLES ------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },

  scrollContent: {
    paddingBottom: 40,
    alignItems: "center",
  },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
  },

  pageTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  sectionTitle: {
    width: "100%",
    maxWidth: 700,
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },

  empty: {
    width: "100%",
    maxWidth: 700,
    paddingHorizontal: 20,
    color: "#777",
    fontStyle: "italic",
    marginBottom: 10,
  },

  /* Event Card */
  eventCard: {
    width: "100%",
    maxWidth: 700,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  metaText: {
    color: "#777",
    marginBottom: 8,
    fontSize: 13,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  cardDetail: {
    marginLeft: 6,
    fontSize: 14,
    color: "#444",
  },

  /* Tags */
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  tagPurple: {
    backgroundColor: "#EFE9FF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },

  tagPurpleText: {
    color: "#6B4CF6",
    fontSize: 12,
    fontWeight: "600",
  },

  tagGreen: {
    backgroundColor: "#E8F9EF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },

  tagGreenText: {
    color: "#0F6F3C",
    fontSize: 12,
    fontWeight: "600",
  },

  /* Buttons */
  subButton: {
    borderWidth: 1.5,
    borderColor: "#6B4CF6",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },

  subButtonText: {
    color: "#6B4CF6",
    fontWeight: "600",
  },

  unsubButton: {
    borderWidth: 1.5,
    borderColor: "#AAA",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },

  unsubButtonText: {
    color: "#666",
    fontWeight: "600",
  },

  descriptionHeader: {
    marginTop: 10,
    marginBottom: 6,
  },

  descriptionHeaderText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5A31F4",
  },

  descriptionBox: {
    backgroundColor: "#F7F5FF",
    borderWidth: 1,
    borderColor: "#E3DAFF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  descriptionFull: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});
