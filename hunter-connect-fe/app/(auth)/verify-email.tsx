import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { auth } from "../../firebase/firebaseConfig";
import { sendEmailVerification } from "firebase/auth";

export default function VerifyEmailScreen() {
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(async () => {
        if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
            clearInterval(interval);
            router.replace("/(tabs)/Landing");
        }
        }
    }, 4000); // check every 4 seconds

    return () => clearInterval(interval);
    }, []);
  const user = auth.currentUser;

  const handleResend = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      alert("Verification email resent! Check your Hunter inbox.");
    }
  };

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
          Please check your inbox and click the link to verify your account before logging in.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleResend}>
          <Text style={styles.buttonText}>Resend Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#ddd" }]}
          onPress={() => router.replace("/(auth)")}
        >
          <Text style={[styles.buttonText, { color: "#333" }]}>Back to Login</Text>
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
