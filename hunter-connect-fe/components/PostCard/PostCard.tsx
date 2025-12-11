import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { PostInterface } from "@/components/api/Posts/Posts";
import {
  formatDateString,
  formatTimeString,
  timestampToDate,
} from "@/components/util/Timestamp";

import styles from "./PostCardStyles";
import { useRouter } from "expo-router";

const PostCard = (post: PostInterface) => {
  const router = useRouter();
  const { content, likes, title, timestamp, creatorName, tags, location } =
    post;
  const formatRelativeTime = (ts: any) => {
    const date = timestampToDate(ts); // ✅ always returns a valid JS Date

    const diff = (Date.now() - date.getTime()) / 1000; // seconds

    if (isNaN(diff)) return ""; // safety fallback

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 172800) return "1 day ago";

    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/post/[id]",
          params: { id: post.postID },
        });
      }}
      style={styles.card}   // <- this is your ONE card wrapper
    >

      {/* USER HEADER */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(creatorName?.charAt(0) ?? "?").toUpperCase()}
            </Text>
          </View>

          <View style={styles.userRow}>
            <Text style={styles.username}>{creatorName ?? "Unknown User"}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.timestamp}>{formatRelativeTime(timestamp)}</Text>
          </View>
        </View>

        {location ? (
          <View style={styles.headerRight}>
            <Ionicons name="location-outline" size={16} color="#e34d4d" />
            <Text style={styles.locationTextSmall}>{location}</Text>
          </View>
        ) : (
          <View />
        )}
      </View>

      {/* TITLE */}
      <Text style={styles.title}>{title ?? "Unknown Title"}</Text>

      {/* CONTENT */}
      <Text style={styles.body}>{content ?? "Unknown Content"}</Text>

      {/* TAGS */}
      <View style={styles.tagRow}>
        {tags?.general?.map((t, i) => (
          <View key={i} style={styles.tagPurple}>
            <Text style={styles.tagPurpleText}>{t}</Text>
          </View>
        ))}
        {tags?.courses?.map((t, i) => (
          <View key={i} style={styles.tagGreen}>
            <Text style={styles.tagGreenText}>{t}</Text>
          </View>
        ))}
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Pressable style={styles.footerBtn}>
          <FontAwesome name="heart-o" size={18} color="#6e6e6e" />
          <Text style={styles.footerBtnText}>{likes ?? 0}</Text>
        </Pressable>

        <Pressable style={styles.footerBtn}>
          <FontAwesome name="comment-o" size={18} color="#6e6e6e" />
        </Pressable>
      </View>

    </Pressable>
  );

};

export default PostCard;
