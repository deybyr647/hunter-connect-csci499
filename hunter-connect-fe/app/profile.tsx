import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "../firebase/firebaseConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged Out", "You have been successfully logged out.");
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.backButton} />
        </View>

        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../assets/images/hunter_logo.png")}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.userName}>
            {user?.displayName || "Hunter Student"}
          </Text>
          <Text style={styles.userEmail}>{user?.email || "No email"}</Text>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionIcon}>📝</Text>
            <Text style={styles.optionText}>My Posts</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionIcon}>🎓</Text>
            <Text style={styles.optionText}>My Interests</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionIcon}>📅</Text>
            <Text style={styles.optionText}>My Events</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionIcon}>⚙️</Text>
            <Text style={styles.optionText}>Settings</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingBottom: 40,
  },
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
  backButton: {
    width: 60,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
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
  avatar: {
    width: 80,
    height: 80,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
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
  optionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  optionArrow: {
    fontSize: 24,
    color: "#ccc",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
