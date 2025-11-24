import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, {
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface EventData {
  id: string;
  title: string;
  date: any; // Firestore Timestamp
  location?: string;
  description?: string;
}

export default function EventsScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);

  const [upcoming, setUpcoming] = useState<EventData[]>([]);
  const [registered, setRegistered] = useState<EventData[]>([]);
  const [past, setPast] = useState<EventData[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setLoading(false);
          return;
        }

        const prefs = userSnap.data();
        const upcomingIds = prefs.upcomingEvents || [];
        const registeredIds = prefs.registeredEvents || [];
        const pastIds = prefs.pastEvents || [];

        const fetchEvent = async (id: string): Promise<EventData | null> => {
          const eventRef = doc(db, "events", id);
          const eventSnap = await getDoc(eventRef);
          if (!eventSnap.exists()) return null;
          return { id, ...eventSnap.data() } as EventData;
        };

        const upcomingData = (await Promise.all(upcomingIds.map(fetchEvent))).filter(
          Boolean
        ) as EventData[];

        const registeredData = (
          await Promise.all(registeredIds.map(fetchEvent))
        ).filter(Boolean) as EventData[];

        const pastData = (await Promise.all(pastIds.map(fetchEvent))).filter(
          Boolean
        ) as EventData[];

        // 🔥 Sort by date
        const sortByDate = (arr: EventData[]) =>
          arr.sort(
            (a, b) =>
              a.date.toDate().getTime() - b.date.toDate().getTime()
          );

        setUpcoming(sortByDate(upcomingData));
        setRegistered(sortByDate(registeredData));
        setPast(sortByDate(pastData));

      } catch (err) {
        console.error("Error fetching events:", err);
      }

      setLoading(false);
    };

    loadEvents();
  }, []);

  const renderEvent = (e: EventData) => (
    <View key={e.id} style={styles.eventCard}>
      <Text style={styles.eventTitle}>{e.title}</Text>
      <Text style={styles.eventDate}>
        {e.date.toDate().toLocaleDateString()}
      </Text>
      {e.location && <Text style={styles.eventLocation}>{e.location}</Text>}
    </View>
  );

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
                {/* UPCOMING */}
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                {upcoming.length
                  ? upcoming.map(renderEvent)
                  : <Text style={styles.empty}>No upcoming events.</Text>}

                {/* REGISTERED */}
                <Text style={styles.sectionTitle}>Registered Events</Text>
                {registered.length
                  ? registered.map(renderEvent)
                  : <Text style={styles.empty}>No registered events yet.</Text>}

                {/* PAST EVENTS */}
                <Text style={styles.sectionTitle}>Past Events</Text>
                {past.length
                  ? past.map(renderEvent)
                  : <Text style={styles.empty}>No past events.</Text>}
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
});
