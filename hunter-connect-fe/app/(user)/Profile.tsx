import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserInterface, getUser } from "@/components/api/Users/Users";
import { auth } from "@/components/api/util/firebaseConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [academicYear, setAcademicYear] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const bearerToken = await user?.getIdToken();
        const userData: UserInterface | undefined = await getUser(
          user?.uid,
          bearerToken
        );

        const year =
          userData?.preferences?.academicYear ?? "Unknown Academic Year";
        setAcademicYear(year);
      } catch (error) {
        console.error(error);
      }
    })();
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
            <Ionicons name="chevron-back" size={24} color="#5A31F4" />
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

          <Text style={styles.userName}>{user?.displayName || "John Doe"}</Text>

          <Text style={styles.academicYearText}>
            {academicYear ? academicYear : "No Year Selected"}
          </Text>
        </View>

        {/* OPTIONS */}
        <View style={styles.optionsContainer}>
          {/* POSTS */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push("/(user)/Posts")}
          >
            <Text style={styles.optionIcon}>📝</Text>
            <Text style={styles.optionText}>My Posts</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          {/* EVENTS */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push("/(user)/Events")}
          >
            <Text style={styles.optionIcon}>📅</Text>
            <Text style={styles.optionText}>My Events</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          {/* TAGS */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push("/(user)/Tags")}
          >
            <Text style={styles.optionIcon}>🏷️</Text>
            <Text style={styles.optionText}>My Tags</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          {/* SETTINGS */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push("/(user)/Settings")}
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
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7", // Matches Friends page bg
  },

  scrollContent: {
    paddingBottom: 40,
  },

  /* ---------- HEADER ---------- */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: { width: 60 },
  backButtonText: { fontSize: 16, color: "#6C47FF", fontWeight: "600" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },

  /* ---------- PROFILE CARD ---------- */
  profileSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 28,
    borderRadius: 14,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },

  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: { width: 80, height: 80 },

  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
    color: "#1C1C1E",
  },

  academicYearText: {
    marginTop: 6,
    fontSize: 16,
    color: "#666",
  },

  /* ---------- OPTIONS CARD ---------- */
  optionsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 4,

    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },

  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  optionIcon: {
    fontSize: 22,
    marginRight: 16,
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#2C2C2E",
    fontWeight: "500",
  },

  optionArrow: {
    fontSize: 24,
    color: "#C7C7CC",
  },
});
