import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { AuthStyles as styles } from "../../components/AuthStyles";



export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Welcome back!");
      router.push("/welcome"); // Change this to the landing page whenever you merge all files
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

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

    <View style={styles.formContainer}>
      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Forgot password link */}
      <TouchableOpacity onPress={() => console.log("Forgot password tapped")}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Sign-up link */}
      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.link}>
          Don’t have an account?{" "}
          <Text style={{ fontWeight: "bold", color: "#007AFF" }}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);
}

