import { UserInterface, getUser } from "@/api/Users";
import { auth } from "@/api/firebaseConfig";
import { useRouter } from "expo-router";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
  updateProfile,
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

export default function SettingsScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
        const {firstName, lastName, email, preferences} = userData;

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


  const handleSave = async () => {
    try {
      if (user) {
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });

        Alert.alert("Success", "Profile updated!");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

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
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.back}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.box}>
            <Text style={styles.section}>Personal Info</Text>

            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
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

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>

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
  box: { backgroundColor: "#fff", margin: 20, padding: 20, borderRadius: 12 },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  label: { fontSize: 14, marginTop: 10 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  disabled: { backgroundColor: "#eee" },
  saveBtn: {
    borderWidth: 2,
    borderColor: "#2E1759",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#2E1759",
    fontSize: 16,
    fontWeight: "600",
  },
  updatePassBtn: {
    borderWidth: 2,
    borderColor: "#2E1759",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  updatePassText: {
    color: "#2E1759",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: "#FF3B30",
    padding: 12,
    borderRadius: 10,
    marginTop: 25,
  },
  logoutText: { color: "#FF3B30", textAlign: "center", fontWeight: "600" },
});
