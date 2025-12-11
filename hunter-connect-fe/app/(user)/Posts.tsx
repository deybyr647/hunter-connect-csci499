import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { db } from "@/components/api/Firebase/firebaseConfig";
import PostCard from "@/components/PostCard/PostCard";
import { PostInterface } from "@/components/api/Posts/Posts";

export default function MyPostsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [myPosts, setMyPosts] = useState<PostInterface[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadMyPosts = async () => {
      try {
        // Query Firestore for posts created by this user
        const q = query(
          collection(db, "posts"),
          where("userID", "==", user.uid),
        );

        const snapshot = await getDocs(q);

        const posts: PostInterface[] = await Promise.all(
          snapshot.docs.map(async (d) => {
            const data = d.data();

            // Fetch creator name from users collection
            let creatorName = "Unknown";
            if (data.userID) {
              const userDoc = await getDoc(doc(db, "users", data.userID));
              if (userDoc.exists()) {
                const u = userDoc.data();
                creatorName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
              }
            }

            return {
              postID: d.id,
              ...data,
              creatorName,
            } as PostInterface;
          })
        );

        setMyPosts(posts);
      } catch (err) {
        console.error("Error loading posts:", err);
      }

      setLoading(false);
    };

    loadMyPosts();
  }, [user]);

  return (
    <Animated.View
      entering={SlideInRight.duration(250)}
      exiting={SlideOutRight.duration(200)}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#5A31F4" />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>My Posts</Text>

          <View style={{ width: 24 }} />
        </View>

        {/* CONTENT */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Posts Created by Me</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#5A31F4" />
          ) : myPosts.length ? (
            myPosts.map((post) => (
              <PostCard key={post.postID} post={post} disablePress={false} />
            ))
          ) : (
            <Text style={styles.empty}>You haven't created any posts yet.</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },

  scrollContent: {
    paddingBottom: 40,
    alignItems: "center",
  },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
  },

  pageTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  sectionTitle: {
    width: "100%",
    maxWidth: 700,
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },

  empty: {
    width: "100%",
    maxWidth: 700,
    paddingHorizontal: 20,
    color: "#777",
    fontStyle: "italic",
    marginBottom: 10,
  },
});
