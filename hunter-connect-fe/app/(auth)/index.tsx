import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AuthStyles as styles } from "./AuthStyles";
import { auth } from "../../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  reload,
} from "firebase/auth";

type AuthMode = "login" | "signup";

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");

  useEffect(() => {
    // only run on web to avoid affecting mobile keyboards
    if (Platform.OS === "web") {
      const listener = (e : KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault(); // stop form reload
          handleAuth(); // run your function
        }
      };

      document.addEventListener("keydown", listener);
      return () => document.removeEventListener("keydown", listener);
    }
  }, []);

  // form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // user-friendly Firebase error mapping
  const getFriendlyErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "This email is already in use. Try logging in instead.";
      case "auth/weak-password":
        return "Password is too weak. Use at least 6 characters.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  // handle both login and signup
const handleAuth = async () => {
  setErrorMessage("");

  if (!email || !password) {
    setErrorMessage("Please fill in all required fields.");
    return;
  }

  if (mode === "signup" && password !== confirmPassword) {
    setErrorMessage("Passwords do not match.");
    return;
  }

  try {
    if (mode === "login") {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // ✅ Save full name to Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // ✅ Refresh the user object so `onAuthStateChanged` gets updated info
      await reload(userCredential.user);
    }

    router.push("/onboarding");
  } catch (error: any) {
    console.log("Firebase error:", error.code);
    const friendlyMessage = getFriendlyErrorMessage(error.code);
    setErrorMessage(friendlyMessage);
  }
};

  // toggle between login and signup
  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setErrorMessage("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

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

        {/* Auth Form */}
        <View
          style={
            mode === "login" ? styles.loginFormContainer : styles.signupFormContainer
          }
        >
          {/* Signup-only name fields */}
          {mode === "signup" && (
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="First Name"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Last Name"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          )}

          {/* Shared email + password */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done" 
            onSubmitEditing={handleAuth}
          />

          {/* Confirm password for signup */}
          {mode === "signup" && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          )}

          {/* Inline error message */}
          {errorMessage !== "" && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>
              {mode === "login" ? "Login" : "Create Account"}
            </Text>
          </TouchableOpacity>
          {/* Forgot password link — visible only in login mode */}
          {mode === "login" && (
            <TouchableOpacity onPress={() => console.log("Forgot password tapped")}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* Toggle between modes */}
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            {mode === "login" ? (
              <>
                <Text style={styles.haveAccount}>Don’t have an account? </Text>
                <TouchableOpacity onPress={toggleMode}>
                  <Text style={styles.link}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.haveAccount}>Already have an account? </Text>
                <TouchableOpacity onPress={toggleMode}>
                  <Text style={styles.link}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
