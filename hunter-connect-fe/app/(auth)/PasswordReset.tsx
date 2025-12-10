import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "@/components/api/Firebase/firebaseConfig";

import { AuthStyles as styles } from "../../components/AuthPage/AuthStyles";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Missing Email", "Please enter your Hunter email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  };

  //  Confirmation Screen
  if (sent) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <View style={styles.header}>
          <Text style={styles.title}>HUNTER</Text>
          <Image
            source={require("../../assets/images/hunter_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>CONNECT</Text>
        </View>

        <View
          style={[
            styles.loginFormContainer,
            {
              alignItems: "center",
              width: "90%",
              maxWidth: 420,
              alignSelf: "center",
            },
          ]}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#2E1759",
              marginBottom: 10,
            }}
          >
            📩 Reset Link Sent!
          </Text>

          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: "#444",
              marginBottom: 10,
            }}
          >
            A password reset email has been sent to:
          </Text>

          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              color: "#2E1759",
              marginBottom: 20,
            }}
          >
            {email}
          </Text>

          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "#666",
              marginBottom: 25,
            }}
          >
            Please check your inbox and follow the link to reset your password.
          </Text>

          <TouchableOpacity
            style={[styles.button, { width: "80%" }]}
            onPress={() => router.replace("/(auth)")}
          >
            <Text style={styles.buttonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  //  Input Screen
  return (
    <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>HUNTER</Text>
          <Image
            source={require("../../assets/images/hunter_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>CONNECT</Text>
        </View>

        {/* Reset Form */}
        <View style={[styles.loginFormContainer, { alignItems: "center" }]}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#2E1759",
              marginBottom: 8,
            }}
          >
            Forgot Password
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: "#555",
              marginBottom: 20,
              fontSize: 15,
            }}
          >
            Enter your Hunter College email below, and we’ll send you a password
            reset link.
          </Text>

          <TextInput
            style={[styles.input, { width: "100%" }]}
            placeholder="Enter your @myhunter.cuny.edu email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={[styles.button, { width: "100%" }]}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/(auth)")}
            style={{ marginTop: 10 }}
          >
            <Text style={styles.forgotPassword}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
