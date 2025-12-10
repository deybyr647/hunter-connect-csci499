import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "@/components/api/Firebase/firebaseConfig";
import {
  UserInterface,
  createUser,
  updateUser,
} from "@/components/api/Users/Users";
import {
  courseList,
  interestList,
  skillList,
} from "@/components/util/OnboardingOptions";

export default function OnboardingScreen() {
  const router = useRouter();

  const [academicYear, setAcademicYear] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // dropdown open states
  const [courseOpen, setCourseOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  // dummy values (required for controlled components)
  const [yearValue, setYearValue] = useState<string | null>(null);
  const [courseValue, setCourseValue] = useState<string | null>(null);
  const [skillValue, setSkillValue] = useState<string | null>(null);
  const [interestValue, setInterestValue] = useState<string | null>(null);

  // lists
  const academicYearList = [
    { label: "Freshman", value: "Freshman" },
    { label: "Sophomore", value: "Sophomore" },
    { label: "Junior", value: "Junior" },
    { label: "Senior", value: "Senior" },
    { label: "Graduate", value: "Graduate" },
  ];

  const listModeConfig = Platform.OS === "web" ? "FLATLIST" : "MODAL";

  // Utility add/remove
  const addUnique = (array: string[], item: string, setter: Function) => {
    if (!array.includes(item)) setter([...array, item]);
  };

  const removeItem = (array: string[], item: string, setter: Function) => {
    setter(array.filter((i) => i !== item));
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);

    try {
      const bearerToken = await user.getIdToken();

      const reqBody: UserInterface = {
        firstName: "",
        lastName: "",
        email: "",
        uid: "",
        username: "",
        incomingRequests: [],
        outgoingRequests: [],
        friends: [],
        preferences: {
          academicYear: academicYear,
          courses: courses,
          skills: skills,
          interests: interests,
        },
      };

      await updateUser(reqBody, bearerToken);

      router.replace("/(tabs)/Landing");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2E1759" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>
          This helps us match you with study partners and resources.
        </Text>

        <View style={styles.formBox}>
          {/*  ACADEMIC YEAR */}
          <Text style={styles.sectionTitle}>🎓 Academic Year</Text>
          <View
            style={{
              zIndex: 5000,
              position: "relative",
              marginBottom: yearOpen ? 200 : 10,
            }}
          >
            <DropDownPicker
              open={yearOpen}
              value={yearValue}
              setValue={(callback) => {
                const val = callback(yearValue);
                setYearValue(val);
                setAcademicYear(val || "");
              }}
              items={academicYearList}
              setOpen={(open) => {
                setYearOpen(open);
                setCourseOpen(false);
                setSkillOpen(false);
                setInterestOpen(false);
              }}
              placeholder="Select academic year..."
              listMode={listModeConfig}
              modalTitle="Select Academic Year"
              modalAnimationType="slide"
              modalContentContainerStyle={{ flex: 1 }}
              flatListProps={{ nestedScrollEnabled: true }}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          {/*  COURSES */}
          <Text style={styles.sectionTitle}>📚 CS Courses</Text>
          <View
            style={{
              zIndex: 4000,
              position: "relative",
              marginBottom: courseOpen ? 200 : 10,
            }}
          >
            <DropDownPicker
              open={courseOpen}
              value={courseValue}
              setValue={setCourseValue}
              items={courseList}
              setOpen={(open) => {
                setCourseOpen(open);
                setYearOpen(false);
                setSkillOpen(false);
                setInterestOpen(false);
              }}
              onSelectItem={(item) =>
                item?.value && addUnique(courses, item.value, setCourses)
              }
              listMode={listModeConfig}
              modalTitle="Select Course"
              searchable={true}
              modalAnimationType="slide"
              modalContentContainerStyle={{ flex: 1 }}
              flatListProps={{ nestedScrollEnabled: true }}
              placeholder="Select a course..."
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {courses.map((c, i) => (
              <TouchableOpacity
                key={i}
                style={styles.tag}
                onPress={() => removeItem(courses, c, setCourses)}
              >
                <Text style={styles.tagText}>{c}</Text>
                <Text style={styles.remove}>✕</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/*  SKILLS */}
          <Text style={styles.sectionTitle}>💻 Skills</Text>
          <View
            style={{
              zIndex: 3000,
              position: "relative",
              marginBottom: skillOpen ? 200 : 10,
            }}
          >
            <DropDownPicker
              open={skillOpen}
              value={skillValue}
              setValue={setSkillValue}
              items={skillList}
              setOpen={(open) => {
                setSkillOpen(open);
                setYearOpen(false);
                setCourseOpen(false);
                setInterestOpen(false);
              }}
              onSelectItem={(item) =>
                item?.value && addUnique(skills, item.value, setSkills)
              }
              listMode={listModeConfig}
              modalTitle="Select Skill"
              searchable={true}
              modalAnimationType="slide"
              modalContentContainerStyle={{ flex: 1 }}
              flatListProps={{ nestedScrollEnabled: true }}
              placeholder="Select a skill..."
              closeAfterSelecting={true}
              maxHeight={250}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {skills.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={styles.tag}
                onPress={() => removeItem(skills, s, setSkills)}
              >
                <Text style={styles.tagText}>{s}</Text>
                <Text style={styles.remove}>✕</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/*  INTERESTS */}
          <Text style={styles.sectionTitle}>💡 Interests</Text>
          <View
            style={{
              zIndex: 2000,
              position: "relative",
              marginBottom: interestOpen ? 200 : 10,
            }}
          >
            <DropDownPicker
              open={interestOpen}
              value={interestValue}
              setValue={setInterestValue}
              items={interestList}
              setOpen={(open) => {
                setInterestOpen(open);
                setSkillOpen(false);
                setCourseOpen(false);
                setYearOpen(false);
              }}
              onSelectItem={(item) =>
                item?.value && addUnique(interests, item.value, setInterests)
              }
              listMode={listModeConfig}
              modalTitle="Select Interest"
              searchable={true}
              modalAnimationType="slide"
              modalContentContainerStyle={{ flex: 1 }}
              flatListProps={{ nestedScrollEnabled: true }}
              placeholder="Select an interest..."
              closeAfterSelecting={true}
              maxHeight={250}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {interests.map((i, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.tag}
                onPress={() => removeItem(interests, i, setInterests)}
              >
                <Text style={styles.tagText}>{i}</Text>
                <Text style={styles.remove}>✕</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* BUTTONS */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Continue →</Text>
            )}
          </TouchableOpacity>

          {/* Skip */}
          <TouchableOpacity onPress={() => router.replace("/(tabs)/Landing")}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: Platform.OS === "web" ? "flex-start" : "center",
    maxWidth: Platform.OS === "web" ? 800 : "100%",
    alignSelf: "center",
    width: "100%",
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
    textAlign: "center",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 20,
    textAlign: "center",
  },
  formBox: {
    backgroundColor: "white",
    borderRadius: 15,
    width: "100%",
    padding: 20,
    maxWidth: Platform.OS === "web" ? 600 : "100%",
    alignSelf: "center",
    paddingBottom: 100,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
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
  button: {
    backgroundColor: "#2E1759",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 25,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  skipText: {
    color: "#2E1759",
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
