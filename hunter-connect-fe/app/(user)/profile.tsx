import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebase/firebaseConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [academicYear, setAcademicYear] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const prefs = snap.data().preferences;
        if (prefs?.academicYear) setAcademicYear(prefs.academicYear);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/(tabs)/Landing")}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.backButton} />
        </View>

        {/* PROFILE */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../assets/images/hunter_logo.png")}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.userName}>
            {user?.displayName || "John Doe"}
          </Text>

          <Text style={styles.academicYearText}>
            {academicYear ? academicYear : "No Year Selected"}
          </Text>
        </View>

        {/* OPTIONS */}
        <View style={styles.optionsContainer}>
          {/* POSTS */}
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionIcon}>📝</Text>
            <Text style={styles.optionText}>My Posts</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          {/* EVENTS */}
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionIcon}>📅</Text>
            <Text style={styles.optionText}>My Events</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          {/* TAGS */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push("/(user)/tags")}
          >
            <Text style={styles.optionIcon}>🏷️</Text>
            <Text style={styles.optionText}>My Tags</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          {/* SETTINGS */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push("/(user)/settings")}
          >
            <Text style={styles.optionIcon}>⚙️</Text>
            <Text style={styles.optionText}>Settings</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContent: { paddingBottom: 40 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2",
  },
  backButton: { width: 60 },
  backButtonText: { fontSize: 16, color: "#007AFF" },
  headerTitle: { fontSize: 18, fontWeight: "bold" },

  profileSection: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: { width: 80, height: 80 },
  userName: { fontSize: 24, fontWeight: "700" },

  academicYearText: {
    marginTop: 5,
    fontSize: 16,
    color: "#666",
  },

  optionsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionIcon: { fontSize: 24, marginRight: 15 },
  optionText: { flex: 1, fontSize: 16 },
  optionArrow: { fontSize: 24, color: "#aaa" },
});
