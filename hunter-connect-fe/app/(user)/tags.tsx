import { auth, db } from "@/firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// 🔥 ANIMATION IMPORTS
import Animated, {
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TagsScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [courses, setCourses] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [academicYear, setAcademicYear] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const prefs = snap.data().preferences || {};
        setCourses(prefs.courses || []);
        setSkills(prefs.skills || []);
        setInterests(prefs.interests || []);
        setAcademicYear(prefs.academicYear || "");
      }
    };

    load();
  }, []);

  return (
    <Animated.View
      entering={SlideInRight.duration(250)}
      exiting={SlideOutRight.duration(200)}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Tags</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={styles.box}>
            <Text style={styles.section}>Academic Year</Text>
            <Text style={styles.infoText}>
              {academicYear || "Not selected"}
            </Text>

            <Text style={styles.section}>Courses</Text>
            {courses.length ? (
              <View style={styles.tagWrap}>
                {courses.map((c, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{c}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.empty}>No courses selected.</Text>
            )}

            <Text style={styles.section}>Skills</Text>
            {skills.length ? (
              <View style={styles.tagWrap}>
                {skills.map((s, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{s}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.empty}>No skills selected.</Text>
            )}

            <Text style={styles.section}>Interests</Text>
            {interests.length ? (
              <View style={styles.tagWrap}>
                {interests.map((i, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{i}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.empty}>No interests selected.</Text>
            )}

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => router.push("/onboarding")}
            >
              <Text style={styles.editText}>Edit Tags</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f6" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  back: { fontSize: 16, color: "#007AFF" },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  box: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  infoText: { marginTop: 5, fontSize: 15 },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  tag: {
    backgroundColor: "#2E1759",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    margin: 5,
  },
  tagText: { color: "white", fontSize: 14 },
  empty: { marginTop: 5, color: "#999" },
  editBtn: {
    backgroundColor: "#2E1759",
    padding: 12,
    borderRadius: 10,
    marginTop: 30,
  },
  editText: { textAlign: "center", color: "white", fontWeight: "600" },
});
