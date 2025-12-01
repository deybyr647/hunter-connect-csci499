import { auth, db } from "@/firebase/firebaseConfig";
import { useRouter } from "expo-router";
import {
  doc,
  getDocs,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface EventData {
  id: string;
  title: string;
  date: any;
  location?: string;
  description?: string;
  createdBy?: string;
  attendees?: string[];
}

export default function EventsScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);

  // NEW CATEGORIES
  const [myEvents, setMyEvents] = useState<EventData[]>([]);
  const [subscribedEvents, setSubscribedEvents] = useState<EventData[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);

  // CREATE EVENT FORM STATE
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [tags, setTags] = useState("");

  // SAFE DATE FORMATTER
  const formatDate = (d: any) => {
    if (!d) return "";
    if (d?.toDate) return d.toDate().toLocaleDateString();
    if (typeof d === "string") {
      const dateObj = new Date(d);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString();
      }
    }
    return "";
  };

  // LOAD ALL EVENTS AND CATEGORY SPLIT
  useEffect(() => {
    if (!user) return;

    const loadEvents = async () => {
      try {
        const eventQuery = query(collection(db, "events"));
        const snapshot = await getDocs(eventQuery);

        const allEvents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as EventData[];

        const myEv = allEvents.filter((e) => e.createdBy === user.uid);

        const subscribed = allEvents.filter((e) =>
          e.attendees?.includes(user.uid)
        );

        const upcoming = allEvents.filter(
          (e) =>
            e.createdBy !== user.uid &&
            !e.attendees?.includes(user.uid)
        );

        setMyEvents(myEv);
        setSubscribedEvents(subscribed);
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error("Error loading events:", error);
      }

      setLoading(false);
    };

    loadEvents();
  }, []);

  // RENDER EVENT CARD
  const renderEvent = (e: EventData) => (
    <View key={e.id} style={styles.eventCard}>
      <Text style={styles.eventTitle}>{e.title}</Text>
      <Text style={styles.eventDate}>{formatDate(e.date)}</Text>
      {e.location && <Text style={styles.eventLocation}>{e.location}</Text>}
    </View>
  );

  // CREATE EVENT
  const createEvent = async () => {
    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t !== "");

      const docRef = await addDoc(collection(db, "events"), {
        title,
        description,
        location,
        date,
        startTime,
        endTime,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid,
        attendees: [],
        tags: tagArray,
      });

      console.log("Event created:", docRef.id);

      // Refresh events list after creating
      setMyEvents((prev) => [
        ...prev,
        {
          id: docRef.id,
          title,
          description,
          location,
          date,
          startTime,
          endTime,
          createdBy: auth.currentUser?.uid,
          attendees: [],
        },
      ]);

      alert("Event created!");

      // Reset fields
      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setTags("");

      setShowCreateEvent(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Animated.View
      entering={SlideInRight.duration(250)}
      exiting={SlideOutRight.duration(200)}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.back}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Events</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.contentBox}>
            {loading ? (
              <ActivityIndicator size="large" color="#2E1759" />
            ) : (
              <>
                {/* SECTION: MY EVENTS */}
                <Text style={styles.sectionTitle}>My Events</Text>
                {myEvents.length ? (
                  myEvents.map(renderEvent)
                ) : (
                  <Text style={styles.empty}>You have not created events yet.</Text>
                )}

                {/* CREATE EVENT DROPDOWN */}
                <View style={{ marginVertical: 15 }}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowCreateEvent(!showCreateEvent)}
                  >
                    <Text style={styles.dropdownButtonText}>
                      {showCreateEvent ? "Hide Form ▲" : "Create New Event ▼"}
                    </Text>
                  </TouchableOpacity>

                  {showCreateEvent && (
                    <View style={styles.createBox}>
                      <TextInput
                        style={styles.input}
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                      />

                      <TextInput
                        style={styles.input}
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                      />

                      <TextInput
                        style={styles.input}
                        placeholder="Location"
                        value={location}
                        onChangeText={setLocation}
                      />

                      <TextInput
                        style={styles.input}
                        placeholder="Date (YYYY-MM-DD)"
                        value={date}
                        onChangeText={setDate}
                      />

                      <TextInput
                        style={styles.input}
                        placeholder="Start Time (HH:MM)"
                        value={startTime}
                        onChangeText={setStartTime}
                      />

                      <TextInput
                        style={styles.input}
                        placeholder="End Time (HH:MM)"
                        value={endTime}
                        onChangeText={setEndTime}
                      />

                      <TextInput
                        style={styles.input}
                        placeholder="Tags (csci135, study)"
                        value={tags}
                        onChangeText={setTags}
                      />

                      <TouchableOpacity
                        style={styles.createButton}
                        onPress={createEvent}
                      >
                        <Text style={styles.createButtonText}>
                          Create Event
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* SECTION: UPCOMING EVENTS */}
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                {upcomingEvents.length ? (
                  upcomingEvents.map(renderEvent)
                ) : (
                  <Text style={styles.empty}>No upcoming events available.</Text>
                )}

                {/* SECTION: SUBSCRIBED EVENTS */}
                <Text style={styles.sectionTitle}>Subscribed Events</Text>
                {subscribedEvents.length ? (
                  subscribedEvents.map(renderEvent)
                ) : (
                  <Text style={styles.empty}>
                    You have not subscribed to any events yet.
                  </Text>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContent: { paddingBottom: 40, alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    width: "100%",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  back: { fontSize: 16, color: "#007AFF" },
  headerTitle: { fontSize: 18, fontWeight: "bold" },

  contentBox: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 700,
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },

  eventCard: {
    backgroundColor: "#f0eef7",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: { fontSize: 16, fontWeight: "700" },
  eventDate: { color: "#555", marginTop: 4 },
  eventLocation: { color: "#777", marginTop: 2 },

  empty: {
    color: "#777",
    fontStyle: "italic",
    marginBottom: 10,
  },

  dropdownButton: {
    backgroundColor: "#5A31F4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  dropdownButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  createBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  createButton: {
    backgroundColor: "#5A31F4",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
