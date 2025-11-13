import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { auth } from "@/firebase/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { styles as styles } from "./TopHeaderStyles";


const TopHeader = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMenuVisible(false);
      router.replace("/(auth)");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Mobile overlay (click outside closes dropdown) */}
      {menuVisible && Platform.OS !== "web" && (
        <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)} />
      )}

      <View style={styles.header}>
        <FontAwesome name="graduation-cap" size={24} color="black" />
        <Text style={styles.title}>Hunter Connect</Text>
        <FontAwesome name="bell-o" size={22} color="black" />
        <FontAwesome name="comment-o" size={22} color="black" />

        {/* 👤 Profile Icon — hover on web, tap on mobile */}
        <View
          {...(Platform.OS === "web"
            ? {
                onMouseEnter: () => setMenuVisible(true),
                onMouseLeave: () => setMenuVisible(false),
              }
            : {})}
          // 👆 this safely adds web-only props
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (Platform.OS !== "web") setMenuVisible(!menuVisible);
            }}
          >
            <FontAwesome name="user-circle-o" size={26} color="black" />
          </TouchableOpacity>

          {menuVisible && (
            <View
              {...(Platform.OS === "web"
                ? {
                    onMouseEnter: () => setMenuVisible(true), // keep open
                    onMouseLeave: () => setMenuVisible(false), // close only after leaving dropdown
                  }
                : {})}
              style={styles.dropdown}
            >
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownName}>
                  {user?.displayName || "User"}
                </Text>
                <Text style={styles.dropdownEmail}>
                  {user?.email || "No email"}
                </Text>
              </View>

              <Pressable
                style={styles.dropdownItem}
                onPress={() => router.push("/(tabs)/profile")}
              >
                <Text style={styles.dropdownItemText}>Profile Settings</Text>
              </Pressable>

              <Pressable
                style={styles.dropdownItem}
                onPress={() => router.push("/(tabs)/privacy")}
              >
                <Text style={styles.dropdownItemText}>Privacy Settings</Text>
              </Pressable>

              <Pressable
                style={styles.dropdownItem}
                onPress={() => router.push("/(tabs)/help")}
              >
                <Text style={styles.dropdownItemText}>Help & Support</Text>
              </Pressable>

              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "#eee",
                  marginTop: 5,
                }}
              />

              <Pressable style={styles.dropdownItem} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TopHeader;
