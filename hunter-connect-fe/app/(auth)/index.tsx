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
  sendEmailVerification,
} from "firebase/auth";

import {UserInterface, createUser} from "@/app/(auth)/api/Users";

type AuthMode = "login" | "signup";

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");

  useEffect(() => {
    // only run on web to avoid affecting mobile keyboards
    if (Platform.OS === "web") {
      const listener = (e : KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault(); 
          handleAuth(); 
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
  const [passwordStrength, setPasswordStrength] = useState("");
  const [matchMessage, setMatchMessage] = useState("");

  const evaluatePasswordStrength = (pwd: string) => {
    if (!pwd) return "";

    // Strong: 8+ chars, at least one uppercase, one lowercase, one number, and one special symbol
    const strongRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    // Medium: at least 6+ chars with letters and numbers
    const mediumRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (strongRegex.test(pwd)) return "Strong";
    if (mediumRegex.test(pwd)) return "Medium";
    return "Weak";
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(evaluatePasswordStrength(text));
    if (confirmPassword.length > 0) {
      setMatchMessage(text === confirmPassword ? "Match" : "No Match");
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setMatchMessage(password === text ? "Match" : "No Match");
  };

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
    if (evaluatePasswordStrength(password) === "Weak") {
      setErrorMessage("Password is too weak. Please make it stronger before continuing.");
      return;
    }
    if (mode === "signup" && !email.endsWith("@myhunter.cuny.edu")) {
      setErrorMessage("Please use your @myhunter.cuny.edu email to sign up.");
      return;
    }

    try {
      if (mode === "login") {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (!userCredential.user.emailVerified) {
          await auth.signOut();
          setErrorMessage("Please verify your email before logging in.");
          return;
        }

        router.push("/(tabs)/Landing");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save full name to Firebase Auth
        await updateProfile(userCredential.user, {
          displayName: `${firstName} ${lastName}`,
        });

        await sendEmailVerification(userCredential.user);

        // Access UID of user here, along with token to send to backend for authentication
          const uid = user.uid;
          const bearerToken = await user.getIdToken();

          const reqBody: UserInterface = {
              name: {
                  firstName: firstName,
                  lastName: lastName,
              },
              email: email,
              uid: uid,
              bearerToken: bearerToken,
          }

          console.log("Request Body: \n", reqBody);
          console.log("Bearer Token: \n", bearerToken);
          await createUser(reqBody);

        // Refresh the user object so `onAuthStateChanged` gets updated info
        await reload(userCredential.user);
        router.replace("/verify-email");
      }
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
    setPasswordStrength("");
    setMatchMessage("");
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
            placeholder="Hunter Email"
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
            onChangeText={handlePasswordChange}
            secureTextEntry
            returnKeyType="done" 
            onSubmitEditing={handleAuth}
          />

          {/* Password Strength Indicator */}
          {mode === "signup" && password.length > 0 && (
            <Text
              style={{
                alignSelf: "flex-start",
                color:
                  passwordStrength === "Strong"
                    ? "green"
                    : passwordStrength === "Medium"
                    ? "orange"
                    : "red",
                marginBottom: 6,
              }}
            >
              Password strength: {passwordStrength}
            </Text>
          )}

          {/* Confirm Password (signup only) */}
          {mode === "signup" && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry
              />

              {confirmPassword.length > 0 && (
                <Text
                  style={{
                    alignSelf: "flex-start",
                    color: matchMessage === "Match" ? "green" : "red",
                    marginBottom: 6,
                  }}
                >
                  {matchMessage === "Match"
                    ? "✅ Passwords match"
                    : "❌ Passwords do not match"}
                </Text>
              )}
            </>
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
            <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
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
