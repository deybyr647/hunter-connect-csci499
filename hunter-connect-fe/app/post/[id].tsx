import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { getPostById } from "@/components/api/Posts/Posts";
import PostCard from "@/components/PostCard/PostCard";
import CommentsSection from "@/components/Comments/CommentsSection";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchPost() {
      try {
        const p = await getPostById(id as string);
        setPost(p);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5A31F4" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Post not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={styles.contentWrapper}>
        <PostCard post={post} disablePress />

        <View style={styles.commentsWrapper}>
          <CommentsSection postId={post.postID} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },

  contentWrapper: {
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
    paddingTop: 20,
  },

  commentsWrapper: {
    marginTop: 30,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  notFound: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },
});
