import { useRouter } from "expo-router";
import {
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "../firebase/firebaseConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  // State for expandable sections
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [changeEmailExpanded, setChangeEmailExpanded] = useState(false);
  const [changePasswordExpanded, setChangePasswordExpanded] = useState(false);

  // State for form fields
  const [firstName, setFirstName] = useState(
    user?.displayName?.split(" ")[0] || "John"
  );
  const [lastName, setLastName] = useState(
    user?.displayName?.split(" ").slice(1).join(" ") || "Doe"
  );
  const [email, setEmail] = useState(user?.email || "johndoe@gmail.com");
  const [password] = useState("********");
  const [studentId, setStudentId] = useState("12345678");
  const [major, setMajor] = useState("Computer Science");

  // State for change email
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  // State for change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged Out", "You have been successfully logged out.");
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (user) {
        // Update display name
        const fullName = `${firstName} ${lastName}`.trim();
        if (fullName) {
          await updateProfile(user, { displayName: fullName });
        }

        Alert.alert("Success", "Profile updated successfully!");
      }
    } catch (error: any) {
      Alert.alert("Update Failed", error.message);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail || !emailPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      if (user && user.email) {
        // Reauthenticate user
        const credential = EmailAuthProvider.credential(
          user.email,
          emailPassword
        );
        await reauthenticateWithCredential(user, credential);

        // Update email
        await updateEmail(user, newEmail);
        setEmail(newEmail);
        setNewEmail("");
        setEmailPassword("");
        setChangeEmailExpanded(false);
        Alert.alert("Success", "Email updated successfully!");
      }
    } catch (error: any) {
      Alert.alert("Email Update Failed", error.message);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      if (user && user.email) {
        // Reauthenticate user
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);

        // Update password
        await updatePassword(user, newPassword);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setChangePasswordExpanded(false);
        Alert.alert("Success", "Password updated successfully!");
      }
    } catch (error: any) {
      Alert.alert("Password Update Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
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
            {user?.displayName || "John Doe"}
          </Text>
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

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setSettingsExpanded(!settingsExpanded)}
          >
            <Text style={styles.optionIcon}>⚙️</Text>
            <Text style={styles.optionText}>Settings</Text>
            <Text style={styles.optionArrow}>
              {settingsExpanded ? "▼" : "›"}
            </Text>
          </TouchableOpacity>

          {/* Expandable Settings Section */}
          {settingsExpanded && (
            <View style={styles.settingsContent}>
              {/* Personal Information Section */}
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                  placeholderTextColor="#999"
                />

                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                  placeholderTextColor="#999"
                />

                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={email}
                  editable={false}
                  placeholderTextColor="#999"
                />

                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={password}
                  editable={false}
                  secureTextEntry
                  placeholderTextColor="#999"
                />
              </View>

              {/* Change Email Section */}
              <View style={styles.settingsSection}>
                <TouchableOpacity
                  style={styles.subsectionHeader}
                  onPress={() => setChangeEmailExpanded(!changeEmailExpanded)}
                >
                  <Text style={styles.subsectionTitle}>Change Email</Text>
                  <Text style={styles.subsectionArrow}>
                    {changeEmailExpanded ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>

                {changeEmailExpanded && (
                  <View style={styles.subsectionContent}>
                    <Text style={styles.inputLabel}>New Email</Text>
                    <TextInput
                      style={styles.input}
                      value={newEmail}
                      onChangeText={setNewEmail}
                      placeholder="Enter new email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#999"
                    />

                    <Text style={styles.inputLabel}>Current Password</Text>
                    <TextInput
                      style={styles.input}
                      value={emailPassword}
                      onChangeText={setEmailPassword}
                      placeholder="Confirm with password"
                      secureTextEntry
                      placeholderTextColor="#999"
                    />

                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleChangeEmail}
                    >
                      <Text style={styles.submitButtonText}>Update Email</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Change Password Section */}
              <View style={styles.settingsSection}>
                <TouchableOpacity
                  style={styles.subsectionHeader}
                  onPress={() =>
                    setChangePasswordExpanded(!changePasswordExpanded)
                  }
                >
                  <Text style={styles.subsectionTitle}>Change Password</Text>
                  <Text style={styles.subsectionArrow}>
                    {changePasswordExpanded ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>

                {changePasswordExpanded && (
                  <View style={styles.subsectionContent}>
                    <Text style={styles.inputLabel}>Current Password</Text>
                    <TextInput
                      style={styles.input}
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      placeholder="Enter current password"
                      secureTextEntry
                      placeholderTextColor="#999"
                    />

                    <Text style={styles.inputLabel}>New Password</Text>
                    <TextInput
                      style={styles.input}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Enter new password"
                      secureTextEntry
                      placeholderTextColor="#999"
                    />

                    <Text style={styles.inputLabel}>Confirm New Password</Text>
                    <TextInput
                      style={styles.input}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm new password"
                      secureTextEntry
                      placeholderTextColor="#999"
                    />

                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleChangePassword}
                    >
                      <Text style={styles.submitButtonText}>
                        Update Password
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Student Information Section */}
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Student Information</Text>

                <Text style={styles.inputLabel}>Student ID</Text>
                <TextInput
                  style={styles.input}
                  value={studentId}
                  onChangeText={setStudentId}
                  placeholder="Enter student ID"
                  placeholderTextColor="#999"
                />

                <Text style={styles.inputLabel}>Major</Text>
                <TextInput
                  style={styles.input}
                  value={major}
                  onChangeText={setMajor}
                  placeholder="Enter major"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Save Changes Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
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
  settingsContent: {
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  settingsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  subsectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  subsectionArrow: {
    fontSize: 16,
    color: "#007AFF",
  },
  subsectionContent: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: -10,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#34C759",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
