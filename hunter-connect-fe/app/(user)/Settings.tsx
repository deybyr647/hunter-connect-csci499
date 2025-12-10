import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserInterface, getUser } from "@/components/api/Users/Users";
import { auth, rtdb } from "@/components/api/util/firebaseConfig";
import { ref, set } from "firebase/database";

export default function SettingsScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const bearerToken = await user?.getIdToken();
        const userData = await getUser(user?.uid, bearerToken);
        const { firstName, lastName, email, username, preferences } = userData;

        setUsername(username ?? "Unknown Username");

        if (!userData) return;

        setFirstName(firstName ?? "Unknown First Name");
        setLastName(lastName ?? "Unknown Last Name");
        setEmail(email ?? "Unknown Email Address");
        setAcademicYear(preferences?.academicYear ?? "Unknown");
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword)
      return Alert.alert("Error", "Passwords do not match.");

    try {
      const cred = EmailAuthProvider.credential(user?.email!, currentPassword);
      await reauthenticateWithCredential(user!, cred);
      await updatePassword(user!, newPassword);
      Alert.alert("Success", "Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleLogout = async () => {
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const uid = currentUser.uid;

        await set(ref(rtdb, `/status/${uid}`), {
          state: "offline",
          last_changed: Date.now(),
        });
      }

      await signOut(auth);
      router.replace("/(auth)");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <Animated.View
      entering={SlideInRight.duration(250)}
      exiting={SlideOutRight.duration(200)}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#5A31F4" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.box}>
            <Text style={styles.section}>Personal Info</Text>

            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, styles.disabled]}
              value={firstName}
              editable={false}
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[styles.input, styles.disabled]}
              value={lastName}
              editable={false}
            />

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[
                styles.input,
                styles.disabled,
                { fontStyle: "italic", color: "#555" },
              ]}
              value={`@${username}`}
              editable={false}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabled]}
              value={email}
              editable={false}
            />

            <Text style={styles.label}>Major</Text>
            <TextInput
              style={[styles.input, styles.disabled]}
              value="Computer Science"
              editable={false}
            />

            <Text style={styles.label}>Academic Year</Text>
            <TextInput
              style={[styles.input, styles.disabled]}
              value={academicYear}
              editable={false}
            />

            <Text style={styles.section}>Change Password</Text>

            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={styles.updatePassBtn}
              onPress={handlePasswordChange}
            >
              <Text style={styles.updatePassText}>Update Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7", // Same background as Friends page
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
  },
  backButton: {
    width: 40,
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  /* CARD WRAPPER */
  box: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    margin: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },

  section: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 10,
    marginTop: 10,
  },

  /* LABELS */
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 14,
    marginBottom: 4,
    fontWeight: "600",
  },

  /* INPUTS (match Friends search input style) */
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#FFF",
    marginBottom: 8,
  },

  disabled: {
    backgroundColor: "#F0F0F0",
    color: "#777",
  },

  updatePassBtn: {
    backgroundColor: "#EFE9FF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  updatePassText: {
    color: "#6B4CF6",
    fontWeight: "600",
    fontSize: 16,
    fontStyle: "italic",
  },

  /* LOGOUT BUTTON (match declineBtn styling) */
  logoutBtn: {
    backgroundColor: "#FFE8EE",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 30,
  },
  logoutText: {
    color: "#E44860",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
    fontStyle: "italic",
  },
});
