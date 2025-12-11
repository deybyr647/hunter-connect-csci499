import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPostById } from "@/components/api/Posts/Posts";
import PostCard from "@/components/PostCard/PostCard";
import CommentsSection from "@/components/Comments/CommentsSection";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const p = await getPostById(id as string);
        setPost(p);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  if (!post) return <Text>Post not found.</Text>;

  return (
    <ScrollView style={{ flex: 1 }}>
      
      {/* 🔙 BACK BUTTON */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#5A31F4" />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            marginLeft: 12,
            color: "#3C2E7E",
          }}
        >
          Post
        </Text>
      </View>

      {/* POST + COMMENTS */}
      <PostCard post={post} disablePress />
      <CommentsSection postId={id as string} />
    </ScrollView>
  );
}
