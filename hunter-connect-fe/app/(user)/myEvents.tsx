import { auth, db } from "@/firebase/firebaseConfig";
import { useRouter } from "expo-router";
import {
  getDocs,
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
/*                                EVENT TYPES                                */
/* -------------------------------------------------------------------------- */

interface EventData {
  id: string;
  title: string;
  date: any;
  location?: string;
  description?: string;
  createdBy?: string;
  attendees?: string[];
}

/* -------------------------------------------------------------------------- */
/*                          DROPDOWN: GENERAL TAG LIST                        */
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

/* -------------------------------------------------------------------------- */
/*                         DROPDOWN: FULL COURSE LIST                         */
/* -------------------------------------------------------------------------- */

const courseTagList = [
  /* ---------------------------- 100 LEVEL ---------------------------- */
  { label: "🧩 100-Level Courses", value: "100level", selectable: false },
  { label: "CSCI 12100", value: "CSCI 12100", parent: "100level" },
  { label: "CSCI 12700", value: "CSCI 12700", parent: "100level" },
  { label: "CSCI 13200", value: "CSCI 13200", parent: "100level" },
  { label: "CSCI 13300", value: "CSCI 13300", parent: "100level" },
  { label: "CSCI 13500", value: "CSCI 13500", parent: "100level" },
  { label: "CSCI 13600", value: "CSCI 13600", parent: "100level" },
  { label: "CSCI 15000", value: "CSCI 15000", parent: "100level" },
  { label: "CSCI 16000", value: "CSCI 16000", parent: "100level" },
  { label: "CSCI 17200", value: "CSCI 17200", parent: "100level" },

  /* ---------------------------- 200 LEVEL ---------------------------- */
  { label: "⚙️ 200-Level Courses", value: "200level", selectable: false },
  { label: "CSCI 22700", value: "CSCI 22700", parent: "200level" },
  { label: "CSCI 23200", value: "CSCI 23200", parent: "200level" },
  { label: "CSCI 23300", value: "CSCI 23300", parent: "200level" },
  { label: "CSCI 23500", value: "CSCI 23500", parent: "200level" },
  { label: "CSCI 26000", value: "CSCI 26000", parent: "200level" },
  { label: "CSCI 26500", value: "CSCI 26500", parent: "200level" },
  { label: "CSCI 26700", value: "CSCI 26700", parent: "200level" },
  { label: "CSCI 27500", value: "CSCI 27500", parent: "200level" },

  /* ---------------------------- 300 LEVEL ---------------------------- */
  { label: "💻 300-Level Courses", value: "300level", selectable: false },
  { label: "CSCI 32000", value: "CSCI 32000", parent: "300level" },
  { label: "CSCI 33500", value: "CSCI 33500", parent: "300level" },
  { label: "CSCI 34000", value: "CSCI 34000", parent: "300level" },
  { label: "CSCI 35000", value: "CSCI 35000", parent: "300level" },
  { label: "CSCI 35300", value: "CSCI 35300", parent: "300level" },
  { label: "CSCI 35500", value: "CSCI 35500", parent: "300level" },
  { label: "CSCI 36000", value: "CSCI 36000", parent: "300level" },
  { label: "CSCI 36500", value: "CSCI 36500", parent: "300level" },
  { label: "CSCI 37100", value: "CSCI 37100", parent: "300level" },

  /* ---------------------------- 400 LEVEL ---------------------------- */
  { label: "🧠 400-Level Courses", value: "400level", selectable: false },
  { label: "CSCI 40500", value: "CSCI 40500", parent: "400level" },
  { label: "CSCI 41500", value: "CSCI 41500", parent: "400level" },
  { label: "CSCI 43500", value: "CSCI 43500", parent: "400level" },
  { label: "CSCI 46000", value: "CSCI 46000", parent: "400level" },
  { label: "CSCI 49101", value: "CSCI 49101", parent: "400level" },
  { label: "CSCI 49201", value: "CSCI 49201", parent: "400level" },
  { label: "CSCI 49300", value: "CSCI 49300", parent: "400level" },
  { label: "CSCI 49600", value: "CSCI 49600", parent: "400level" },
  { label: "CSCI 49700", value: "CSCI 49700", parent: "400level" },
  { label: "CSCI 49800", value: "CSCI 49800", parent: "400level" },
  { label: "CSCI 49900", value: "CSCI 49900", parent: "400level" },
];

/* -------------------------------------------------------------------------- */
/*                               COMPONENT START                              */
/* -------------------------------------------------------------------------- */

export default function EventsScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);

  /* ------------------------------- Event Groups ------------------------------ */
  const [myEvents, setMyEvents] = useState<EventData[]>([]);
  const [subscribedEvents, setSubscribedEvents] = useState<EventData[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);

  /* ---------------------------- Creation Form State --------------------------- */
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  /* -------- Tag state: two separate arrays (general + courses) -------- */
  const [generalTags, setGeneralTags] = useState<string[]>([]);
  const [courseTags, setCourseTags] = useState<string[]>([]);

  /* ----------------------------- Tag dropdowns ----------------------------- */
  const [generalOpen, setGeneralOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);
  const listModeConfig = Platform.OS === "web" ? "FLATLIST" : "MODAL";

  /* --------------------------- Date / Time Pickers --------------------------- */
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [pickerMode, setPickerMode] =
    useState<null | "date" | "start" | "end">(null);

  const [tempDate, setTempDate] = useState(new Date());
  const [tempStart, setTempStart] = useState(new Date());
  const [tempEnd, setTempEnd] = useState(new Date());

  /* ------------------------------- Format Date ------------------------------- */
  const formatDate = (d: any) => {
    if (!d) return "";
    if (d?.toDate) return d.toDate().toLocaleDateString();
    if (d instanceof Date) return d.toLocaleDateString();
    const parsed = new Date(d);
    return !isNaN(parsed.getTime()) ? parsed.toLocaleDateString() : "";
  };

  /* ------------------------------- Load Events ------------------------------- */
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

        setMyEvents(allEvents.filter((e) => e.createdBy === user.uid));
        setSubscribedEvents(
          allEvents.filter((e) => e.attendees?.includes(user.uid))
        );
        setUpcomingEvents(
          allEvents.filter(
            (e) => e.createdBy !== user.uid && !e.attendees?.includes(user.uid)
          )
        );
      } catch (error) {
        console.error("Event load error:", error);
      }

      setLoading(false);
    };

    loadEvents();
  }, []);

  /* ------------------------------- Open Picker ------------------------------- */
  const openPicker = (mode: "date" | "start" | "end") => {
    setPickerMode(mode);
    if (mode === "date") setTempDate(new Date(date));
    if (mode === "start") setTempStart(new Date(startTime));
    if (mode === "end") setTempEnd(new Date(endTime));
  };

  /* ------------------------------- Create Event ------------------------------ */
  const createEvent = async () => {
    try {
      const docRef = await addDoc(collection(db, "events"), {
        title,
        description,
        location,
        date: Timestamp.fromDate(date),
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
        createdAt: serverTimestamp(),
        createdBy: user?.uid,
        attendees: [],
        tags: {
          general: generalTags,
          courses: courseTags,
        },
      });

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
          createdBy: user?.uid,
          attendees: [],
        },
      ]);

      alert("Event Created!");

      setTitle("");
      setDescription("");
      setLocation("");
      setGeneralTags([]);
      setCourseTags([]);
      setDate(new Date());
      setStartTime(new Date());
      setEndTime(new Date());
      setShowCreateEvent(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------------------- Event Card ------------------------------- */
  const renderEvent = (e: EventData) => (
    <View key={e.id} style={styles.eventCard}>
      <Text style={styles.eventTitle}>{e.title}</Text>
      <Text style={styles.eventDate}>{formatDate(e.date)}</Text>
      {e.location && <Text style={styles.eventLocation}>{e.location}</Text>}
    </View>
  );

  /* ----------------------------- Render Web Picker ---------------------------- */
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

    const getTimeValue = (dt: Date) => {
      return dt.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    if (pickerMode === "start") {
      return (
        <input
          type="time"
          value={getTimeValue(tempStart)}
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
          value={getTimeValue(tempEnd)}
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

  /* --------------------------- Render Mobile Picker -------------------------- */
  const renderMobilePicker = () => {
    if (!pickerMode) return null;

    if (pickerMode === "date") {
      return (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "spinner"}
          onChange={(e, selected) => selected && setTempDate(selected)}
        />
      );
    }

    if (pickerMode === "start") {
      return (
        <DateTimePicker
          value={tempStart}
          mode="time"
          display="spinner"
          onChange={(e, selected) => selected && setTempStart(selected)}
        />
      );
    }

    if (pickerMode === "end") {
      return (
        <DateTimePicker
          value={tempEnd}
          mode="time"
          display="spinner"
          onChange={(e, selected) => selected && setTempEnd(selected)}
        />
      );
    }

    return null;
  };

  /* -------------------------------------------------------------------------- */
  /*                               MAIN UI RETURN                               */
  /* -------------------------------------------------------------------------- */

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
                {myEvents.length ? (
                  myEvents.map(renderEvent)
                ) : (
                  <Text style={styles.empty}>You have not created events yet.</Text>
                )}

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

                    {/* ------------------------ GENERAL TAGS ------------------------ */}
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
                          if (!item?.value) return; 

                          if (!generalTags.includes(item.value)) {
                            setGeneralTags([...generalTags, item.value]);
                          }
                        }}
                        placeholder="Select general tags..."
                        listMode={listModeConfig}
                        modalTitle="Select Tags"
                        modalAnimationType="slide"
                        modalContentContainerStyle={{ flex: 1 }}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        flatListProps={{ nestedScrollEnabled: true }}
                      />
                    </View>
                    {/* General Tag Chips */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {generalTags.map((tag, index) => (
                        <TouchableOpacity
                          key={index}
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

                    {/* ------------------------ COURSE TAGS ------------------------ */}
                    <Text style={styles.label}>Course Tags</Text>
                    <View
                      style={{
                        zIndex: courseOpen ? 2000 : 1,
                        marginBottom: 10,
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
                          if (!item?.value) return;
                          if (item.selectable === false) return;

                          if (!courseTags.includes(item.value)) {
                            setCourseTags([...courseTags, item.value]);
                          }
                        }}
                        placeholder="Select course tags..."
                        listMode={listModeConfig}
                        modalTitle="Select Course"
                        modalAnimationType="slide"
                        modalContentContainerStyle={{ flex: 1 }}
                        style={styles.dropdown}
                        dropDownContainerStyle={{ ...styles.dropdownContainer, maxHeight: 400 }}
                        searchable
                        flatListProps={{ nestedScrollEnabled: true }}
                      />
                    </View>

                    {/* Course Tag Chips */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {courseTags.map((tag, index) => (
                        <TouchableOpacity
                          key={index}
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

                    {/* ------------------------ DATE PICKERS ------------------------ */}

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

                    {/* Create Button */}
                    <TouchableOpacity style={styles.createButton} onPress={createEvent}>
                      <Text style={styles.createButtonText}>Create Event</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* UPCOMING EVENTS */}
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                {upcomingEvents.length ? (
                  upcomingEvents.map(renderEvent)
                ) : (
                  <Text style={styles.empty}>No events found.</Text>
                )}

                {/* SUBSCRIBED EVENTS */}
                <Text style={styles.sectionTitle}>Subscribed Events</Text>
                {subscribedEvents.length ? (
                  subscribedEvents.map(renderEvent)
                ) : (
                  <Text style={styles.empty}>You have no subscribed events.</Text>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* ---------------------------- Modal Picker ---------------------------- */}
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

  eventCard: {
    backgroundColor: "#f0eef7",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: { fontSize: 16, fontWeight: "700" },
  eventDate: { color: "#555", marginTop: 4 },
  eventLocation: { color: "#777", marginTop: 2 },

  empty: { color: "#777", fontStyle: "italic", marginBottom: 10 },

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

  label: {
    fontWeight: "600",
    marginBottom: 6,
  },

  selector: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
  },

  dropdown: {
    borderColor: "#ccc",
    marginBottom: 5,
  },
  dropdownContainer: {
    borderColor: "#ccc",
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
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
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
    fontWeight: "bold",
    marginBottom: 15,
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
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  cancelText: { fontWeight: "600", color: "#333" },

  saveButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#5A31F4",
    borderRadius: 8,
    marginLeft: 10,
    alignItems: "center",
  },
  saveText: { fontWeight: "600", color: "#fff" },

  /* Web Inputs */
  webInput: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    marginBottom: 10,
  },
});
