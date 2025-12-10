import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, set } from "firebase/database";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db, rtdb } from "@/components/api/Firebase/firebaseConfig";
import { listenToConversations } from "@/components/api/messages/getConversations";

import { styles } from "./TopHeaderStyles";

const TopHeader = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [incomingCount, setIncomingCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Watch incoming friend requests
        const ref = doc(db, "users", currentUser.uid);
        const unsubscribeSnapshot = onSnapshot(ref, (snap) => {
          const data = snap.data();
          setIncomingCount(data?.incomingRequests?.length ?? 0);
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  /* ---------------------------------------------------------
      LISTEN FOR UNREAD MESSAGE COUNTS
  ----------------------------------------------------------- */
  useEffect(() => {
    if (!user) return;

    const unsub = listenToConversations(user.uid, (list) => {
      let totalUnread = 0;

      for (const convo of list) {
        // unread is a { userId: count } object
        const count = convo.unread?.[user.uid] ?? 0;
        totalUnread += count;
      }

      setUnreadMessages(totalUnread);
    });

    return unsub;
  }, [user]);

  const handleSignOut = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;

        await set(ref(rtdb, `/status/${uid}`), {
          state: "offline",
          last_changed: Date.now(),
        });
      }

      await signOut(auth);
      setMenuVisible(false);
      router.replace("/(auth)");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <SafeAreaView>
      {/* Mobile overlay */}
      {menuVisible && Platform.OS !== "web" && (
        <Pressable
          style={styles.overlay}
          onPress={() => setMenuVisible(false)}
        />
      )}

      <View style={styles.header}>
        {/* Logo */}
        <TouchableOpacity onPress={() => router.push("/(tabs)/Landing")}>
          <Text style={styles.title}>Hunter Connect</Text>
        </TouchableOpacity>

        {/* Messages Icon + Unread Badge */}
        <View style={{ position: "relative", marginRight: 12 }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(messages)/Messages")}
          >
            <FontAwesome name="comment-o" size={22} color="black" />
          </TouchableOpacity>

          {unreadMessages > 0 && <View style={styles.dot} />}
        </View>

        {/* Friends Icon + Badge */}
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(user)/Friends")}
          >
            <Ionicons name="people-outline" size={24} color="black" />
          </TouchableOpacity>

          {incomingCount > 0 && <View style={styles.dot} />}
        </View>

        {/* Profile Icon */}
        <View
          {...(Platform.OS === "web"
            ? {
                onMouseEnter: () => setMenuVisible(true),
                onMouseLeave: () => setMenuVisible(false),
              }
            : {})}
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
                    onMouseEnter: () => setMenuVisible(true),
                    onMouseLeave: () => setMenuVisible(false),
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
                onPress={() => router.push("/(user)/Profile")}
              >
                <Text style={styles.dropdownItemText}>Profile Settings</Text>
              </Pressable>

              <Pressable style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>Privacy Settings</Text>
              </Pressable>

              <Pressable style={styles.dropdownItem}>
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
