import { useRouter } from "expo-router";
import { sendEmailVerification } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "@/components/api/util/firebaseConfig";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const user = auth.currentUser;

  //  periodically check verification status
  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser && !verified) {
        setChecking(true);
        await auth.currentUser.reload();
        setChecking(false);

        if (auth.currentUser.emailVerified) {
          setVerified(true);
          clearInterval(interval);

          // wait a moment before redirecting
          setTimeout(() => router.replace("/onboarding"), 2500);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [verified]);

  //  resend verification email
  const handleResend = async () => {
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        alert("Verification email resent! Check your Hunter inbox.");
      } catch (error) {
        console.error("Resend failed:", error);
        alert("Failed to resend. Please try again later.");
      }
    }
  };

  //  success screen
  if (verified) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require("../../assets/images/hunter_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>✅ Email Verified!</Text>
          <Text style={styles.message}>
            Your email has been successfully verified.
          </Text>
          <Text style={styles.instructions}>
            Redirecting you to onboarding...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  //  waiting screen
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/hunter_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.message}>
          A verification email has been sent to:
        </Text>
        <Text style={styles.email}>{user?.email || "your email"}</Text>
        <Text style={styles.instructions}>
          Please check your inbox and click the link to verify your account.
        </Text>

        {checking && (
          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <ActivityIndicator size="small" color="#2E1759" />
            <Text style={{ color: "#666", marginTop: 6 }}>
              Checking verification...
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleResend}>
          <Text style={styles.buttonText}>Resend Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#ddd" }]}
          onPress={() => router.replace("/(auth)")}
        >
          <Text style={[styles.buttonText, { color: "#333" }]}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E1759",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E1759",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#444",
  },
  email: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2E1759",
    marginVertical: 8,
  },
  instructions: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2E1759",
    paddingVertical: 12,
    borderRadius: 10,
    width: "80%",
    marginVertical: 6,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});
