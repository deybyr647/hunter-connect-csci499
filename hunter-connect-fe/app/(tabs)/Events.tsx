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
  arrayUnion,
  arrayRemove,
  updateDoc,
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

import Animated, {
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";

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

/* ----------------------------- TAG LISTS ----------------------------- */

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

/* ----------------------------- MAIN COMPONENT ----------------------------- */

export default function EventsScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
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

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});


  /* ------------------ Picker Helpers ------------------ */
  const openPicker = (mode: "date" | "start" | "end") => {
    setPickerMode(mode);

    if (mode === "date") setTempDate(new Date(date));
    if (mode === "start") setTempStart(new Date(startTime));
    if (mode === "end") setTempEnd(new Date(endTime));
  };

  /* ------------------ Helpers ------------------ */
  const safeDate = (x: any) => {
    if (!x) return new Date();

    // Firestore Timestamp
    if (x.toDate) return new Date(x.toDate().getTime());

    // Already a JS Date
    if (x instanceof Date) return new Date(x.getTime());

    const d = new Date(x);
    return isNaN(d.getTime()) ? new Date() : new Date(d.getTime());
  };


  const normalizeTags = (tags: any) => ({
    general: Array.isArray(tags?.general)
      ? tags.general
      : Object.values(tags?.general ?? {}),

    courses: Array.isArray(tags?.courses)
      ? tags.courses
      : Object.values(tags?.courses ?? {}),
  });

  const isSubscribed = (e: EventData) =>
    e.attendees?.includes(user?.uid ?? "") ?? false;

  function normalizeDateOnly(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  /* ------------------ Load Events ------------------ */
  useEffect(() => {
    if (!user) return;

    const loadEvents = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, "events")));

        const allEvents = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            let creatorName = "Unknown";

            if (data.createdBy) {
              const u = await getDoc(doc(db, "users", data.createdBy));
              if (u.exists()) {
                const d = u.data();
                creatorName = `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim();
              }
            }

            return {
              id: docSnap.id,
              ...data,
              creatorName,
              createdAt: data.createdAt?.toDate?.() ?? new Date(),
              tags: normalizeTags(data.tags),
            } as EventData;
          })
        );

        const upcoming = allEvents.filter(
          (e) => safeDate(e.endTime) >= new Date()
        );
        setUpcomingEvents(upcoming);
      } catch (e) {
        console.error(e);
      }

      setLoading(false);
    };

    loadEvents();
  }, []);

  /* ------------------ Create Event ------------------ */
  const createEvent = async () => {
    if (!user) return;

    try {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      let creatorName = "Unknown";

      if (userSnap.exists()) {
        const d = userSnap.data();
        creatorName = `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim();
      }

      const normalizedDate = normalizeDateOnly(date);

      const docRef = await addDoc(collection(db, "events"), {
        title,
        description,
        location,

        // FIXED: date-only, no timezone shifts
        date: Timestamp.fromDate(normalizedDate),

        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),

        createdAt: serverTimestamp(),
        createdBy: user.uid,
        creatorName,
        attendees: [],
        tags: {
          general: generalTags,
          courses: courseTags,
        },
      });


      const newEvent: EventData = {
        id: docRef.id,
        title,
        description,
        location,
        date: normalizedDate,  // FIXED
        startTime,
        endTime,
        createdBy: user.uid,
        creatorName,
        attendees: [],
        tags: {
          general: [...generalTags],
          courses: [...courseTags],
        },
        createdAt: new Date(),
      };

      setUpcomingEvents((prev) => [newEvent, ...prev]);

      setShowCreateEvent(false);
      setTitle("");
      setDescription("");
      setLocation("");
      setGeneralTags([]);
      setCourseTags([]);

      alert("Event Created!");
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------ Subscribe / Unsubscribe ------------------ */
  const toggleSubscribe = async (event: EventData) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "events", event.id), {
        attendees: isSubscribed(event)
          ? arrayRemove(user.uid)
          : arrayUnion(user.uid),
      });

      setUpcomingEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? {
                ...e,
                attendees: isSubscribed(event)
                  ? e.attendees?.filter((a) => a !== user.uid)
                  : [...(e.attendees ?? []), user.uid],
              }
            : e
        )
      );
    } catch (err) {
      console.error("Subscription error:", err);
    }
  };

  const toggleDescription = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* ------------------ Event Card ------------------ */
  const renderEvent = (e: EventData) => {
    const d = safeDate(e.date);
    const s = safeDate(e.startTime);
    const ed = safeDate(e.endTime);

    const isExpanded = expandedCards[e.id] ?? false;

    return (
      <View key={e.id} style={styles.eventCard}>
        <Text style={styles.cardTitle}>{e.title}</Text>

        <Text style={styles.metaText}>
          Created by {e.creatorName} • {safeDate(e.createdAt).toLocaleDateString()}
        </Text>

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={16} color="#555" />
          <Text style={styles.cardDetail}>
            {d.toLocaleDateString()} •{" "}
            {s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
            {ed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>

        {e.location ? (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="#e34d4d" />
            <Text style={styles.cardDetail}>{e.location}</Text>
          </View>
        ) : null}

        {/* TAGS */}
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

        {/* DESCRIPTION SECTION */}
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



        {/* SUBSCRIBE BUTTON */}
        {e.createdBy !== user?.uid && (
          isSubscribed(e) ? (
            <TouchableOpacity
              style={styles.unsubscribeBtn}
              onPress={() => toggleSubscribe(e)}
            >
              <Text style={styles.unsubscribeText}>Unsubscribe</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.subscribeBtn}
              onPress={() => toggleSubscribe(e)}
            >
              <Text style={styles.subscribeText}>Subscribe</Text>
            </TouchableOpacity>
          )
        )}

      </View>
    );
  };


  /* ------------------ Web/Mobile Picker ------------------ */

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

  /* ------------------ RETURN UI ------------------ */

  return (
    <Animated.View
      entering={SlideInRight.duration(250)}
      exiting={SlideOutRight.duration(200)}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* HEADER */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Upcoming Events</Text>

            <TouchableOpacity
              style={styles.createEventCompact}
              onPress={() => setShowCreateEvent(!showCreateEvent)}
            >
              <Ionicons name="add-circle-outline" size={18} color="#5A31F4" />
              <Text style={styles.createEventText}>Create Event</Text>
            </TouchableOpacity>
          </View>

          {/* CREATE FORM */}
          {showCreateEvent && (
            <View style={styles.createBox}>
              <TextInput
                style={styles.input}
                placeholder="Event Title"
                value={title}
                onChangeText={setTitle}
              />

              <TextInput
                style={[styles.input, { height: 80 }]}
                multiline
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
                    if (!item.value) return; // ignore undefined values

                    if (!generalTags.includes(item.value)) {
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

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {generalTags.map((tag, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.tagPurple}
                    onPress={() =>
                      setGeneralTags(generalTags.filter((t) => t !== tag))
                    }
                  >
                    <Text style={styles.tagPurpleText}>
                      {tag} <Text style={styles.remove}>✕</Text>
                    </Text>
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
                    if (!item.value || item.selectable === false) return;

                    if (!courseTags.includes(item.value)) {
                      setCourseTags([...courseTags, item.value]);
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

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {courseTags.map((tag, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.tagGreen}
                    onPress={() =>
                      setCourseTags(courseTags.filter((t) => t !== tag))
                    }
                  >
                    <Text style={styles.tagGreenText}>
                      {tag} <Text style={styles.remove}>✕</Text>
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* PICKERS */}
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
              <TouchableOpacity style={styles.createButton} onPress={createEvent}>
                <Text style={styles.createButtonText}>Create Event</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* UPCOMING EVENTS */}
          {loading ? (
            <ActivityIndicator size="large" color="#5A31F4" />
          ) : (
            upcomingEvents.map(renderEvent)
          )}
        </ScrollView>
      </SafeAreaView>

      {/* DATE/TIME MODAL */}
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

/* ----------------------------- STYLES ----------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },

  scrollContent: {
    paddingBottom: 50,
    alignItems: "center",
  },

  /* Header */
  pageHeader: {
    width: "100%",
    maxWidth: 700,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  createEventCompact: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFE9FF",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  createEventText: {
    marginLeft: 6,
    color: "#5A31F4",
    fontWeight: "600",
  },

  /* Event Card */
  eventCard: {
    width: "100%",
    maxWidth: 700,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#222",
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
    marginBottom: 4,
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

  remove: {
    color: "#999",
    marginLeft: 4,
    fontSize: 14,
  },

  /* Subscribe Buttons */
  subscribeBtn: {
    borderWidth: 1.4,
    borderColor: "#6B4CF6",
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },

  subscribeText: {
    color: "#6B4CF6",
    fontWeight: "600",
    fontSize: 15,
  },

  unsubscribeBtn: {
    borderWidth: 1.4,
    borderColor: "#AAA",
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },

  unsubscribeText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 15,
  },

  /* Create Form */
  createBox: {
    width: "100%",
    maxWidth: 700,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#FFF",
  },

  label: {
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 14,
  },

  dropdown: {
    borderColor: "#CCC",
    borderRadius: 10,
    backgroundColor: "#FFF",
  },

  dropdownContainer: {
    borderColor: "#CCC",
    borderRadius: 10,
  },

  selector: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#FFF",
  },

  createButton: {
    backgroundColor: "#6B4CF6",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  createButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
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
    backgroundColor: "#FFF",
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
    backgroundColor: "#DDD",
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },

  cancelText: {
    fontWeight: "600",
    color: "#333",
  },

  saveButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#5A31F4",
    borderRadius: 10,
    marginLeft: 10,
    alignItems: "center",
  },

  saveText: {
    fontWeight: "600",
    color: "#FFF",
  },

  webInput: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#FFF",
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
