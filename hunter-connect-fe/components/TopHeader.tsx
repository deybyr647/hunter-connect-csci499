import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { auth } from "@/firebase/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2",
    position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    top: 65,
    right: 10,
    width: 220,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: 10,
  },
  dropdownHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 10,
  },
  dropdownName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  dropdownEmail: {
    fontSize: 13,
    color: "#555",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#333",
  },
  signOutText: {
    fontSize: 15,
    color: "red",
    fontWeight: "bold",
  },
});

const TopHeader = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<any>(null); // track current user

  // 🔹 Listen for logged-in user changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setMenuVisible(!menuVisible);

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
    <SafeAreaView>
      <View style={styles.header}>
        <FontAwesome name="graduation-cap" size={24} color="black" />
        <Text style={styles.title}>Hunter Connect</Text>
        <FontAwesome name="bell-o" size={22} color="black" />
        <FontAwesome name="comment-o" size={22} color="black" />

        {/* 👇 Profile Icon */}
        <TouchableOpacity onPress={toggleMenu}>
          <FontAwesome name="user-circle-o" size={26} color="black" />
        </TouchableOpacity>

        {/* 👇 Dropdown Menu */}
        {menuVisible && (
          <View style={styles.dropdown}>
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
              onPress={() => {
                setMenuVisible(false);
                router.push("/(tabs)/profile");
              }}
            >
              <Text style={styles.dropdownItemText}>Profile Settings</Text>
            </Pressable>

            <Pressable
              style={styles.dropdownItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/(tabs)/privacy");
              }}
            >
              <Text style={styles.dropdownItemText}>Privacy Settings</Text>
            </Pressable>

            <Pressable
              style={styles.dropdownItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/(tabs)/help");
              }}
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
    </SafeAreaView>
  );
};

export default TopHeader;
