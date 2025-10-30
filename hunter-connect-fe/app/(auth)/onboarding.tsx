import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { auth } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function OnboardingScreen() {
  const router = useRouter();

  const [academicYear, setAcademicYear] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const toggleSelection = (array: string[], item: string, setter: Function) => {
    if (array.includes(item)) setter(array.filter((i) => i !== item));
    else setter([...array, item]);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(
      doc(db, "users", user.uid),
      {
        preferences: { academicYear, courses, skills, interests },
      },
      { merge: true }
    );

    router.replace("/(tabs)/Landing");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2E1759" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>
          This helps us match you with study partners and resources.
        </Text>

        <View style={styles.formBox}>
          {/* Academic Year */}
          <Text style={styles.sectionTitle}>🎓 Academic Year</Text>
          {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'].map((y) => (
            <TouchableOpacity
              key={y}
              style={styles.option}
              onPress={() => setAcademicYear(y)}
            >
              <Text style={{ color: academicYear === y ? '#2E1759' : '#000' }}>• {y}</Text>
            </TouchableOpacity>
          ))}

          {/* Courses */}
          <Text style={styles.sectionTitle}>📚 CS Courses</Text>
          {['CSCI 127', 'CSCI 135', 'CSCI 235', 'CSCI 335'].map((c) => (
            <TouchableOpacity
              key={c}
              style={styles.option}
              onPress={() => toggleSelection(courses, c, setCourses)}
            >
              <Text style={{ color: courses.includes(c) ? '#2E1759' : '#000' }}>☑️ {c}</Text>
            </TouchableOpacity>
          ))}

          {/* Skills */}
          <Text style={styles.sectionTitle}>💻 Skills</Text>
          {['Python', 'Java', 'C++', 'React', 'SQL', 'Git'].map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.option}
              onPress={() => toggleSelection(skills, s, setSkills)}
            >
              <Text style={{ color: skills.includes(s) ? '#2E1759' : '#000' }}>☑️ {s}</Text>
            </TouchableOpacity>
          ))}

          {/* Interests */}
          <Text style={styles.sectionTitle}>💡 Interests</Text>
          {['Web Development', 'AI', 'Cybersecurity', 'Databases', 'Game Dev'].map((i) => (
            <TouchableOpacity
              key={i}
              style={styles.option}
              onPress={() => toggleSelection(interests, i, setInterests)}
            >
              <Text style={{ color: interests.includes(i) ? '#2E1759' : '#000' }}>☑️ {i}</Text>
            </TouchableOpacity>
          ))}

          {/* Continue Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Continue →</Text>
          </TouchableOpacity>

          {/* Skip Link */}
          <TouchableOpacity onPress={() => router.replace('/(tabs)/Landing')}>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    textAlign: 'center',
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  formBox: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '100%',
    padding: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  option: {
    marginVertical: 3,
  },
  button: {
    backgroundColor: '#2E1759',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 25,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    color: '#2E1759',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
