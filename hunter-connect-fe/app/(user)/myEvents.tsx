import { auth, db } from "@/firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  doc,
  getDocs,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  Timestamp,
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
  Modal,
  Platform,
} from "react-native";

import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";

/* -------------------------------------------------------------------------- */
/*                                 EVENT TYPES                                */
/* -------------------------------------------------------------------------- */

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
  creatorName?: string;  // "You" or fetched user's name
}


/* -------------------------------------------------------------------------- */
/*                               TAG LISTS                                     */
/* -------------------------------------------------------------------------- */

const generalTagList = [
  { label: "Study", value: "Study" },
  { label: "Review", value: "Review" },
  { label: "Workshop", value: "Workshop" },
  { label: "Project", value: "Project" },
  { label: "Group Meeting", value: "Group Meeting" },
  { label: "Tutoring", value: "Tutoring" },
  { label: "Exam Prep", value: "Exam Prep" },
  { label: "Career Event", value: "Career Event" },
  { label: "Networking", value: "Networking" },
  { label: "Hackathon", value: "Hackathon" },
  { label: "Coding Challenge", value: "Coding Challenge" },
  { label: "Office Hours", value: "Office Hours" },
];

const courseTagList = [
  { label: "🧩 100-Level Courses", value: "100level", selectable: false },
  { label: "CSCI 12100", value: "CSCI 12100", parent: "100level" },
  { label: "CSCI 12700", value: "CSCI 12700", parent: "100level" },
  { label: "CSCI 13200", value: "CSCI 13200", parent: "100level" },
  { label: "CSCI 13300", value: "CSCI 13300", parent: "100level" },
  { label: "CSCI 13500", value: "CSCI 13500", parent: "100level" },
  { label: "CSCI 13600", value: "CSCI 13600", parent: "100level" },
  { label: "CSCI 15000", value: "CSCI 15000", parent: "100level" },
  { label: "CSCI 16000", value: "CSCI 16000", parent: "100level" },

  { label: "⚙️ 200-Level Courses", value: "200level", selectable: false },
  { label: "CSCI 22700", value: "CSCI 22700", parent: "200level" },
  { label: "CSCI 23200", value: "CSCI 23200", parent: "200level" },
  { label: "CSCI 23300", value: "CSCI 23300", parent: "200level" },
  { label: "CSCI 23500", value: "CSCI 23500", parent: "200level" },
  { label: "CSCI 26000", value: "CSCI 26000", parent: "200level" },
  { label: "CSCI 26500", value: "CSCI 26500", parent: "200level" },

  { label: "💻 300-Level Courses", value: "300level", selectable: false },
  { label: "CSCI 32000", value: "CSCI 32000", parent: "300level" },
  { label: "CSCI 33500", value: "CSCI 33500", parent: "300level" },
  { label: "CSCI 34000", value: "CSCI 34000", parent: "300level" },

  { label: "🧠 400-Level Courses", value: "400level", selectable: false },
  { label: "CSCI 46000", value: "CSCI 46000", parent: "400level" },
  { label: "CSCI 49201", value: "CSCI 49201", parent: "400level" },
  { label: "CSCI 49900", value: "CSCI 49900", parent: "400level" },
];

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export default function EventsScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);

  const [myEvents, setMyEvents] = useState<EventData[]>([]);
  const [subscribedEvents, setSubscribedEvents] = useState<EventData[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);

  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [generalTags, setGeneralTags] = useState<string[]>([]);
  const [courseTags, setCourseTags] = useState<string[]>([]);

  const [generalOpen, setGeneralOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);
  const listModeConfig = Platform.OS === "web" ? "FLATLIST" : "MODAL";

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [pickerMode, setPickerMode] =
    useState<null | "date" | "start" | "end">(null);

  const [tempDate, setTempDate] = useState(new Date());
  const [tempStart, setTempStart] = useState(new Date());
  const [tempEnd, setTempEnd] = useState(new Date());

  const [expiredEvents, setExpiredEvents] = useState<EventData[]>([]);


  /* ------------------------------- Open Picker ------------------------------- */
  const openPicker = (mode: "date" | "start" | "end") => {
    setPickerMode(mode);

    if (mode === "date") setTempDate(new Date(date));
    if (mode === "start") setTempStart(new Date(startTime));
    if (mode === "end") setTempEnd(new Date(endTime));
  };

  /* ------------------------------- Helpers ------------------------------- */

  const safeDate = (x: any) => {
    if (!x) return new Date();                    // prevents NaN
    if (x.toDate) return x.toDate();             // Firestore Timestamp
    if (x instanceof Date) return x;             // JS Date
    const d = new Date(x);
    return isNaN(d.getTime()) ? new Date() : d;   // fallback if invalid
  };

  const isMine = (e: EventData): boolean => {
    return e.createdBy === user?.uid;
  };

  const isSubscribed = (e: EventData): boolean => {
    if (!user?.uid) return false;  
    return e.attendees?.includes(user.uid) ?? false;
  };

  const toJsDate = (d: any): Date => {
    return d?.toDate ? d.toDate() : new Date(d);
  };

  const isExpired = (e: EventData): boolean => {
    const end = toJsDate(e.endTime);
    return !(end instanceof Date && !isNaN(end.getTime())) || end < new Date();
  };

  const isUpcoming = (e: EventData): boolean => {
    return !isExpired(e);
  };



  /* ------------------------------ Load Events ----------------------------- */

  useEffect(() => {
    if (!user) return;

    const loadEvents = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, "events")));

        const allEvents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as EventData[];

        /* -------------------------------------------------
          1. Attach creator full name & fix createdAt
        ------------------------------------------------- */
        const eventsWithNames = await Promise.all(
          allEvents.map(async (event) => {
            let creatorName = "Unknown User";

            if (event.createdBy) {
              const userDoc = await getDoc(doc(db, "users", event.createdBy));

              if (userDoc.exists()) {
                const data = userDoc.data();
                
                creatorName = `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();
              }
            }

            return {
              ...event,
              creatorName,
              createdAt: event.createdAt?.toDate?.() ?? new Date(),
            };
          })
        );


        /* -------------------------------------------------
          2. Split events into upcoming + expired
        ------------------------------------------------- */
        const upcoming = eventsWithNames.filter(isUpcoming);
        const expired = eventsWithNames.filter(isExpired);

        /* -------------------------------------------------
          3. Assign event categories
        ------------------------------------------------- */
        setMyEvents(upcoming.filter(isMine));

        setSubscribedEvents(upcoming.filter(isSubscribed));

        setUpcomingEvents(
          upcoming.filter((e) => !isMine(e) && !isSubscribed(e))
        );

        setExpiredEvents(
          expired.filter((e) => isMine(e) || isSubscribed(e))
        );
        
        console.log("All events:", allEvents);
        console.log("Events With Names:", eventsWithNames);
        console.log("Upcoming:", upcoming);
        console.log("Expired:", expired);
        console.log("Final upcomingEvents shown:", upcoming.filter(
            (e) => e.createdBy !== user.uid && !e.attendees?.includes(user.uid)
        ));

      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    loadEvents();
  }, []);

  

  /* ----------------------------- Create Event ------------------------------ */

  const createEvent = async () => {
  try {
    if (!user) return;

    // 1) Fetch the creator's name from Firestore correctly
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    let creatorName = "Unknown User";
    if (userSnap.exists()) {
      const data = userSnap.data();
      creatorName = `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();
    }

    // 2) Create the Firestore event
    const docRef = await addDoc(collection(db, "events"), {
      title,
      description,
      location,
      date: Timestamp.fromDate(date),
      startTime: Timestamp.fromDate(startTime),
      endTime: Timestamp.fromDate(endTime),
      createdAt: serverTimestamp(),
      createdBy: user.uid,
      creatorName: creatorName,  // ← stored correctly
      attendees: [],
      tags: {
        general: generalTags,
        courses: courseTags,
      },
    });

    // 3) Update UI immediately so the event shows instantly
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
        createdBy: user.uid,
        creatorName,   // ← include correct name
        attendees: [],
      },
    ]);

    // 4) Reset all form fields
    setTitle("");
    setDescription("");
    setLocation("");
    setGeneralTags([]);
    setCourseTags([]);

    setDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date());

    setShowCreateEvent(false);
    alert("Event Created!");
  } catch (err) {
    console.error(err);
  }
};

  /* ----------------------------- Event Card UI ----------------------------- */

  const renderEvent = (e: EventData) => {
    const eventDate = safeDate(e.date);
    const d = eventDate.toLocaleDateString();

    const s = e.startTime
      ? safeDate(e.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "--";

    const ed = e.endTime
      ? safeDate(e.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "--";

    const createdAtDate = safeDate(e.createdAt);
    const createdAtString = createdAtDate.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View key={e.id} style={styles.eventCard}>
        <Text style={styles.cardTitle}>{e.title}</Text>

        {e.creatorName && (
          <View style={styles.row}>
            <Ionicons name="person-circle-outline" size={18} color="#666" />
            <Text style={styles.creatorText}>Created by {e.creatorName}</Text>
          </View>
        )}

        <View style={styles.row}>
          <Ionicons name="time-outline" size={17} color="#777" />
          <Text style={styles.createdAtText}>Created on {createdAtString}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={17} color="#555" />
          <Text style={styles.cardDate}>{d}</Text>
          <Text style={{ color: "#bbb", marginHorizontal: 6 }}>|</Text>
          <Ionicons name="time-outline" size={17} color="#555" />
          <Text style={styles.cardDate}>{s} - {ed}</Text>
        </View>

        {e.location && (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={17} color="#e34d4d" />
            <Text style={styles.cardLocation}>{e.location}</Text>
          </View>
        )}

        {e.createdBy !== user?.uid && (
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };



  /* ------------------------ Web vs Mobile Picker ------------------------ */

  const renderWebPicker = () => {
    if (pickerMode === "date") {
      return (
        <input
          type="date"
          value={tempDate.toISOString().split("T")[0]}
          onChange={(e) => {
            const [y, m, d] = e.target.value.split("-");
            setTempDate(new Date(Number(y), Number(m) - 1, Number(d)));
          }}
          style={styles.webInput}
        />
      );
    }

    const formatTime = (d: Date) =>
      d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

    if (pickerMode === "start") {
      return (
        <input
          type="time"
          value={formatTime(tempStart)}
          onChange={(e) => {
            const [h, m] = e.target.value.split(":");
            const t = new Date(tempStart);
            t.setHours(Number(h));
            t.setMinutes(Number(m));
            setTempStart(t);
          }}
          style={styles.webInput}
        />
      );
    }

    if (pickerMode === "end") {
      return (
        <input
          type="time"
          value={formatTime(tempEnd)}
          onChange={(e) => {
            const [h, m] = e.target.value.split(":");
            const t = new Date(tempEnd);
            t.setHours(Number(h));
            t.setMinutes(Number(m));
            setTempEnd(t);
          }}
          style={styles.webInput}
        />
      );
    }

    return null;
  };

  const renderMobilePicker = () => {
    if (!pickerMode) return null;

    const mode = pickerMode === "date" ? "date" : "time";

    return (
      <DateTimePicker
        value={
          pickerMode === "date"
            ? tempDate
            : pickerMode === "start"
            ? tempStart
            : tempEnd
        }
        mode={mode}
        display="spinner"
        onChange={(e, selected) => {
          if (!selected) return;
          if (pickerMode === "date") setTempDate(selected);
          if (pickerMode === "start") setTempStart(selected);
          if (pickerMode === "end") setTempEnd(selected);
        }}
      />
    );
  };

  /* ------------------------------ RETURN UI ------------------------------ */

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
                {/* MY EVENTS */}
                <Text style={styles.sectionTitle}>My Events</Text>
                {myEvents.length
                  ? myEvents.map(renderEvent)
                  : <Text style={styles.empty}>You have not created events yet.</Text>}

                {/* CREATE EVENT BUTTON */}
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowCreateEvent(!showCreateEvent)}
                >
                  <Text style={styles.dropdownButtonText}>
                    {showCreateEvent ? "Hide Form ▲" : "Create New Event ▼"}
                  </Text>
                </TouchableOpacity>

                {/* CREATE EVENT FORM */}
                {showCreateEvent && (
                  <View style={styles.createBox}>
                    {/* Title */}
                    <TextInput
                      style={styles.input}
                      placeholder="Event Title"
                      value={title}
                      onChangeText={setTitle}
                    />

                    {/* Description */}
                    <TextInput
                      style={styles.input}
                      placeholder="Description"
                      value={description}
                      onChangeText={setDescription}
                    />

                    {/* Location */}
                    <TextInput
                      style={styles.input}
                      placeholder="Location"
                      value={location}
                      onChangeText={setLocation}
                    />

                    {/* GENERAL TAGS */}
                    <Text style={styles.label}>General Tags</Text>
                    <View
                      style={{
                        zIndex: generalOpen ? 3000 : 1,
                        marginBottom: generalOpen ? 200 : 10,
                      }}
                    >
                      <DropDownPicker
                        open={generalOpen}
                        value={null}
                        items={generalTagList}
                        setOpen={(open) => {
                          setGeneralOpen(open);
                          setCourseOpen(false);
                        }}
                        setValue={() => {}}
                        onSelectItem={(item) => {
                          if (item.value && !generalTags.includes(item.value)) {
                            setGeneralTags([...generalTags, item.value]);
                          }
                        }}
                        placeholder="Select general tags..."
                        listMode={listModeConfig}
                        modalAnimationType="slide"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                      />
                    </View>

                    {/* GENERAL TAG CHIPS */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {generalTags.map((tag, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={styles.tag}
                          onPress={() =>
                            setGeneralTags(generalTags.filter((t) => t !== tag))
                          }
                        >
                          <Text style={styles.tagText}>{tag}</Text>
                          <Text style={styles.remove}>✕</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    {/* COURSE TAGS */}
                    <Text style={styles.label}>Course Tags</Text>
                    <View
                      style={{
                        zIndex: courseOpen ? 2000 : 1,
                        marginBottom: courseOpen ? 200 : 10,
                      }}
                    >
                      <DropDownPicker
                        open={courseOpen}
                        value={null}
                        items={courseTagList}
                        setOpen={(open) => {
                          setCourseOpen(open);
                          setGeneralOpen(false);
                        }}
                        setValue={() => {}}
                        onSelectItem={(item) => {
                          if (item.value && item.selectable !== false) {
                            if (!courseTags.includes(item.value)) {
                              setCourseTags([...courseTags, item.value]);
                            }
                          }
                        }}
                        placeholder="Select course tags..."
                        listMode={listModeConfig}
                        searchable
                        modalAnimationType="slide"
                        style={styles.dropdown}
                        dropDownContainerStyle={{
                          ...styles.dropdownContainer,
                          maxHeight: 400,
                        }}
                      />
                    </View>

                    {/* COURSE TAG CHIPS */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {courseTags.map((tag, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={styles.tag}
                          onPress={() =>
                            setCourseTags(courseTags.filter((t) => t !== tag))
                          }
                        >
                          <Text style={styles.tagText}>{tag}</Text>
                          <Text style={styles.remove}>✕</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    {/* DATE / TIME */}
                    <Text style={styles.label}>Event Date</Text>
                    <TouchableOpacity
                      style={styles.selector}
                      onPress={() => openPicker("date")}
                    >
                      <Text>{date.toDateString()}</Text>
                    </TouchableOpacity>

                    <Text style={styles.label}>Start Time</Text>
                    <TouchableOpacity
                      style={styles.selector}
                      onPress={() => openPicker("start")}
                    >
                      <Text>
                        {startTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.label}>End Time</Text>
                    <TouchableOpacity
                      style={styles.selector}
                      onPress={() => openPicker("end")}
                    >
                      <Text>
                        {endTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </TouchableOpacity>

                    {/* CREATE BUTTON */}
                    <TouchableOpacity
                      style={styles.createButton}
                      onPress={createEvent}
                    >
                      <Text style={styles.createButtonText}>Create Event</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* UPCOMING EVENTS */}
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                {upcomingEvents.length
                  ? upcomingEvents.map(renderEvent)
                  : <Text style={styles.empty}>No events found.</Text>}

                {/* SUBSCRIBED EVENTS */}
                <Text style={styles.sectionTitle}>Subscribed Events</Text>
                {subscribedEvents.length
                  ? subscribedEvents.map(renderEvent)
                  : <Text style={styles.empty}>You have no subscribed events.</Text>}
                {/* Expired EVENTS */}
                <Text style={styles.sectionTitle}>Expired Events</Text>
                  {expiredEvents.length ? (
                    expiredEvents.map(renderEvent)
                  ) : (
                    <Text style={styles.empty}>No expired events.</Text>
                  )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* MODAL PICKER */}
      <Modal visible={pickerMode !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {pickerMode === "date"
                ? "Select Event Date"
                : pickerMode === "start"
                ? "Select Start Time"
                : "Select End Time"}
            </Text>

            {Platform.OS === "web" ? renderWebPicker() : renderMobilePicker()}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setPickerMode(null)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  if (pickerMode === "date") setDate(tempDate);
                  if (pickerMode === "start") setStartTime(tempStart);
                  if (pickerMode === "end") setEndTime(tempEnd);
                  setPickerMode(null);
                }}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

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

  empty: { color: "#777", fontStyle: "italic", marginBottom: 10 },

  /* EVENT CARD — PREMIUM DESIGN */
  eventCard: {
    backgroundColor: "#f8f8fb",
    padding: 20,
    borderRadius: 18,
    marginBottom: 18,
    width: "100%",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  cardDate: {
    marginLeft: 6,
    fontSize: 14,
    color: "#555",
  },

  cardLocation: {
    marginLeft: 6,
    fontSize: 14,
    color: "#444",
  },

  registerButton: {
    backgroundColor: "#007bff",
    marginTop: 14,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 12,
  },

  registerText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },

  dropdownButton: {
    backgroundColor: "#5A31F4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  dropdownButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  createBox: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  label: {
    fontWeight: "600",
    marginBottom: 6,
  },

  selector: {
    padding: 13,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 12,
  },

  dropdown: {
    borderColor: "#ccc",
    borderRadius: 10,
    minHeight: 50,
    paddingHorizontal: 6,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderRadius: 10,
  },

  tag: {
    backgroundColor: "#2E1759",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tagText: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },
  remove: {
    color: "#ccc",
    marginLeft: 5,
    fontSize: 14,
  },

  createButton: {
    backgroundColor: "#5A31F4",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 13,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },

  cancelButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  cancelText: { fontWeight: "600", color: "#333" },

  saveButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#5A31F4",
    borderRadius: 10,
    marginLeft: 10,
    alignItems: "center",
  },
  saveText: { fontWeight: "600", color: "#fff" },

  webInput: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    marginBottom: 10,
  },
  creatorText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },

  createdAtText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#777",
  },
});
