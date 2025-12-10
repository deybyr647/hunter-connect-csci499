import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "@/components/api/Firebase/firebaseConfig";
import { UserInterface, getUser } from "@/components/api/Users/Users";

export default function TagsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [courses, setCourses] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [academicYear, setAcademicYear] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const bearerToken = await user?.getIdToken();
        const userData: UserInterface | undefined = await getUser(
          user?.uid,
          bearerToken
        );

        const { preferences } = userData;
        const { academicYear, courses, skills, interests } = preferences;

        setCourses(courses || []);
        setSkills(skills || []);
        setInterests(interests || []);
        setAcademicYear(academicYear || "Unknown Academic Year");
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

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
            <Text style={styles.headerTitle}>My Tags</Text>
            <View style={{ width: 60 }} />
          </View>
          <View style={styles.box}>
            {/* Academic Year */}
            <Text style={styles.section}>Academic Year</Text>
            <Text style={styles.infoText}>
              {academicYear || "Not selected"}
            </Text>

            <View style={styles.divider} />

            {/* Courses */}
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

            <View style={styles.divider} />

            {/* Skills */}
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

            <View style={styles.divider} />

            {/* Interests */}
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
              onPress={() => router.push("/Onboarding")}
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
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
  },

  back: {
    fontSize: 16,
    color: "#5A31F4",
    fontWeight: "600",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  /* Scroll container */
  scrollContent: {
    paddingBottom: 50,
    alignItems: "center",
  },

  /* Card box — matches eventCard/createBox */
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
  /* Section Header */
  section: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 5,
    marginBottom: 3,
  },

  infoText: {
    fontSize: 15,
    color: "#444",
    marginTop: 2,
  },

  empty: {
    marginTop: 6,
    color: "#777",
    fontStyle: "italic",
  },

  /* Tags — matching event tags (purple chips) */
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    marginBottom: 6,
  },

  tag: {
    backgroundColor: "#EFE9FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },

  tagText: {
    color: "#6B4CF6",
    fontSize: 13,
    fontWeight: "600",
  },

  /* Edit button — matches Event createButton */
  editBtn: {
    backgroundColor: "#EFE9FF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },

  editText: {
    color: "#6B4CF6",
    fontWeight: "600",
    fontSize: 16,
    fontStyle: "italic",
  },

  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginVertical: 16,
  },

  backButton: {
    width: 40,
    justifyContent: "center",
  },
});
