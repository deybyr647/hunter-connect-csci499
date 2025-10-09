import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthStyles as styles } from "../components/AuthStyles";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo + Title */}
      <View style={styles.header}>
        <Text style={styles.title}>HUNTER</Text>
        <Image
          source={require("../assets/images/hunter_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>CONNECT</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.signInButton]}
          onPress={() => router.push("/login")}
        >
            <Text style={[styles.buttonText, { color: "#2E1759" }]}>
            Sign In
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={() => router.push("/signup")}
        >
            <Text style={[styles.buttonText, { color: "#2E1759" }]}>
            Sign Up
            </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

