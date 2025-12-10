import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { PostInterface } from "@/components/api/Posts/Posts";
import {
  formatDateString,
  formatTimeString,
} from "@/components/util/Timestamp";

import styles from "./PostCardStyles";

const PostCard = (post: PostInterface) => {
  const { content, likes, title, timestamp, creatorName, tags, location } =
    post;

  return (
    <View style={styles.post}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Ionicons name="person-circle-outline" size={40} color="#5A31F4" />
        </View>
        <View>
          <Text style={styles.username}>{creatorName ?? "Unknown User"}</Text>
          <Text style={styles.timestamp}>
            {`${formatDateString(timestamp)} ${formatTimeString(timestamp)}`}
          </Text>
        </View>
      </View>

      <Text style={styles.postTitle}>{title ?? "Unknown Title"}</Text>
      <Text style={styles.content}>{content ?? "Unknown Content"}</Text>

      <View style={styles.row}>
        <Ionicons name="location-outline" size={16} color="#e34d4d" />
        <Text style={styles.cardDetail}>{location ?? "Unknown Location"}</Text>
      </View>

      {/* TAGS */}

      <View style={styles.tagContainer}>
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

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn}>
          <FontAwesome name="heart-o" size={18} color="#555" />
          <Text style={styles.likeText}>{likes ?? 0}</Text>
        </Pressable>
        <Pressable style={styles.actionBtn}>
          <FontAwesome name="comment-o" size={18} color="#555" />
        </Pressable>
      </View>
    </View>
  );
};

export default PostCard;
