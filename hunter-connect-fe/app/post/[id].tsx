import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";

import { getPostById } from "@/components/api/Posts/Posts";
import PostCard from "@/components/PostCard/PostCard";
import CommentsSection from "@/components/Comments/CommentsSection";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
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
  if (!post) return <View><Text>Post not found.</Text></View>;

  return (
    <ScrollView style={{ flex: 1 }}>
      <PostCard {...post} />
      <CommentsSection postId={id as string} />
    </ScrollView>
  );
}
