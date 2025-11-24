import { useRouter } from "expo-router";
import {
  signOut,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebase/firebaseConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  // =====================
  // STATES 
  // =====================
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  // Animation values
  const myTagsHeight = useState(new Animated.Value(0))[0];
  const myTagsOpacity = useState(new Animated.Value(0))[0];
  const settingsHeight = useState(new Animated.Value(0))[0];
  const settingsOpacity = useState(new Animated.Value(0))[0];

  // =====================
  // TAG STATES
  // =====================
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [academicYear, setAcademicYear] = useState("");

  // Load tags from Firestore
  useEffect(() => {
    const fetchTags = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const prefs = snap.data().preferences;
        if (prefs?.courses) setCourses(prefs.courses);
        if (prefs?.skills) setSkills(prefs.skills);
        if (prefs?.interests) setInterests(prefs.interests);
        if (prefs?.academicYear) setAcademicYear(prefs.academicYear);
      }
    };

    fetchTags();
  }, []);

  // =====================
  // ANIMATE TAGS EXPANSION
  // =====================
  const toggleTags = () => {
    const newState = !tagsExpanded;
    setTagsExpanded(newState);

    Animated.timing(myTagsHeight, {
      toValue: newState ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    Animated.timing(myTagsOpacity, {
      toValue: newState ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  // =====================
  // ANIMATE SETTINGS EXPANSION
  // =====================
  const toggleSettings = () => {
    const newState = !settingsExpanded;
    setSettingsExpanded(newState);

    Animated.timing(settingsHeight, {
      toValue: newState ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    Animated.timing(settingsOpacity, {
      toValue: newState ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  // =====================
  // USER FIELDS
  // =====================
  const [firstName, setFirstName] = useState(
    user?.displayName?.split(" ")[0] || "John"
  );
  const [lastName, setLastName] = useState(
    user?.displayName?.split(" ").slice(1).join(" ") || "Doe"
  );
  const [email] = useState(user?.email || "");
  const [password] = useState("********");
  const [major, setMajor] = useState("Computer Science");

  // PASSWORD CHANGE
  const [changePasswordExpanded, setChangePasswordExpanded] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged Out", "You have been successfully logged out.");
      router.replace("/(auth)");
    } catch (error: any) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (user) {
        const fullName = `${firstName} ${lastName}`;
        await updateProfile(user, { displayName: fullName });
        Alert.alert("Success", "Profile updated successfully!");
      }
    } catch (error: any) {
      Alert.alert("Update Failed", error.message);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword)
      return Alert.alert("Error", "Please fill in all fields");

    if (newPassword !== confirmPassword)
      return Alert.alert("Error", "New passwords do not match");

    if (newPassword.length < 6)
      return Alert.alert("Error", "Password must be at least 6 characters");

    try {
      if (user?.email) {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
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
        </View>

        {/* OPTIONS */}
        <View style={styles.optionsContainer}>
          {/* POSTS */}
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionIcon}>📝</Text>
            <Text style={styles.optionText}>My Posts</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          {/* TAGS */}
          <TouchableOpacity style={styles.optionItem} onPress={toggleTags}>
            <Text style={styles.optionIcon}>🏷️</Text>
            <Text style={styles.optionText}>My Tags</Text>
            <Text style={styles.optionArrow}>{tagsExpanded ? "▼" : "›"}</Text>
          </TouchableOpacity>

          {/* TAGS EXPANDED */}
          <Animated.View
            style={{
              overflow: "hidden",
              opacity: myTagsOpacity,
              maxHeight: myTagsHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1200],
              }),
            }}
          >
            <View style={styles.settingsContent}>
              <Text style={styles.sectionTitle}>Your Tags</Text>

              {/* COURSES */}
              <Text style={styles.groupTitle}>Courses</Text>
              <View style={styles.tagContainer}>
                {courses.length ? (
                  courses.map((c, i) => (
                    <View key={i} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{c}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No courses selected.</Text>
                )}
              </View>

              {/* SKILLS */}
              <Text style={styles.groupTitle}>Skills</Text>
              <View style={styles.tagContainer}>
                {skills.length ? (
                  skills.map((s, i) => (
                    <View key={i} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{s}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No skills selected.</Text>
                )}
              </View>

              {/* INTERESTS */}
              <Text style={styles.groupTitle}>Interests</Text>
              <View style={styles.tagContainer}>
                {interests.length ? (
                  interests.map((t, i) => (
                    <View key={i} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{t}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No interests selected.</Text>
                )}
              </View>

              {/* EDIT TAGS */}
              <TouchableOpacity
                style={styles.editTagsButton}
                onPress={() => router.push("/(auth)/onboarding")}
              >
                <Text style={styles.editTagsButtonText}>Edit Tags</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* EVENTS */}
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionIcon}>📅</Text>
            <Text style={styles.optionText}>My Events</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          {/* SETTINGS */}
          <TouchableOpacity style={styles.optionItem} onPress={toggleSettings}>
            <Text style={styles.optionIcon}>⚙️</Text>
            <Text style={styles.optionText}>Settings</Text>
            <Text style={styles.optionArrow}>
              {settingsExpanded ? "▼" : "›"}
            </Text>
          </TouchableOpacity>

          {/* SETTINGS EXPANDED */}
          <Animated.View
            style={{
              overflow: "hidden",
              opacity: settingsOpacity,
              maxHeight: settingsHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 2000],
              }),
            }}
          >
            <View style={styles.settingsContent}>
              {/* PERSONAL INFO */}
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                />

                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                />

                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={email}
                  editable={false}
                />

                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  secureTextEntry
                  value={password}
                  editable={false}
                />
              </View>

              {/* CHANGE PASSWORD */}
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
                      secureTextEntry
                      onChangeText={setCurrentPassword}
                    />

                    <Text style={styles.inputLabel}>New Password</Text>
                    <TextInput
                      style={styles.input}
                      value={newPassword}
                      secureTextEntry
                      onChangeText={setNewPassword}
                    />

                    <Text style={styles.inputLabel}>Confirm New Password</Text>
                    <TextInput
                      style={styles.input}
                      value={confirmPassword}
                      secureTextEntry
                      onChangeText={setConfirmPassword}
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

              {/* STUDENT INFO */}
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Student Information</Text>

                <Text style={styles.inputLabel}>Academic Year</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={academicYear}
                  editable={false}
                />

                <Text style={styles.inputLabel}>Major</Text>
                <TextInput
                  style={styles.input}
                  value={major}
                  onChangeText={setMajor}
                />
              </View>

              {/* SAVE */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>

              {/* LOGOUT */}
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
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

  settingsContent: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    paddingBottom: 40,
  },
  settingsSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },

  // TAGS
  groupTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  tagChip: {
    backgroundColor: "#2E1759",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  tagChipText: { color: "white", fontSize: 14, fontWeight: "500" },
  emptyText: { color: "#777" },

  // INPUTS
  inputLabel: { fontSize: 14, fontWeight: "600", marginTop: 10 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  disabledInput: { backgroundColor: "#eee", color: "#666" },

  // PASSWORD SUBSECTION
  subsectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  subsectionTitle: { fontSize: 16, fontWeight: "600" },
  subsectionArrow: { fontSize: 16, color: "#007AFF" },

  subsectionContent: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: -10,
    marginBottom: 10,
  },

  submitButton: {
    borderWidth: 2,
    borderColor: "#2E1759",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#2E1759",
    fontSize: 16,
    fontWeight: "600",
  },

  saveButton: {
    borderWidth: 2,
    borderColor: "#2E1759",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#2E1759",
    fontSize: 16,
    fontWeight: "600",
  },

  // LOGOUT
  logoutButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  logoutButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },

  editTagsButton: {
    marginTop: 20,
    backgroundColor: "#2E1759",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  editTagsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
