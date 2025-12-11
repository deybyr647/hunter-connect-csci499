import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable, Text, View } from "react-native";
import { auth } from "@/components/api/Firebase/firebaseConfig";
import { toggleLike } from "@/components/api/Posts/toggleLike";
import { PostInterface } from "@/components/api/Posts/Posts";
import {
  formatDateString,
  formatTimeString,
  timestampToDate,
} from "@/components/util/Timestamp";

import styles from "./PostCardStyles";
import { useRouter } from "expo-router";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/components/api/Firebase/firebaseConfig";
import React, { useEffect, useState } from "react";

const PostCard = ({
  post,
  disablePress = false
}: {
  post: PostInterface;
  disablePress?: boolean;
}) => {

  const router = useRouter();
  const [commentCount, setCommentCount] = useState(0);

  const {
    content,
    likes,
    title,
    timestamp,
    creatorName,
    tags,
    location,
    postID
  } = post;
  const user = auth.currentUser;
  const [likesState, setLikesState] = useState(post.likes);
  const [likedByState, setLikedByState] = useState(post.likedBy ?? []);
  const liked = likedByState.includes(user?.uid ?? ""); 
  const isClickable = !disablePress;

  const formatRelativeTime = (ts: any) => {
    const date = timestampToDate(ts);
    const diff = (Date.now() - date.getTime()) / 1000;

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 172800) return "1 day ago";

    return `${Math.floor(diff / 86400)} days ago`;
  };

  useEffect(() => {
    if (!postID) return;

    const commentsRef = collection(db, "posts", postID, "comments");

    const unsubscribe = onSnapshot(commentsRef, snap => {
      setCommentCount(snap.size);
    });

    return unsubscribe;
  }, [postID]);

  useEffect(() => {
    if (!postID) return;

    const unsubscribe = onSnapshot(doc(db, "posts", postID), snap => {
      if (!snap.exists()) return;
      const data = snap.data();

      setLikesState(data.likes ?? 0);
      setLikedByState(data.likedBy ?? []);
    });

    return unsubscribe;
  }, [postID]);

  return (
    <Pressable
      disabled={!isClickable}
      onPress={
        isClickable
          ? () =>
              router.push({
                pathname: "/post/[id]",
                params: { id: postID }
              })
          : undefined
      }
      style={styles.card}
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
        <Pressable
          style={styles.footerBtn}
          onPress={() => {
            if (!user) return;
            toggleLike(postID, user.uid);
          }}
        >
          {liked ? (
            <FontAwesome name="heart" size={18} color="#e24b4b" />
          ) : (
            <FontAwesome name="heart-o" size={18} color="#6e6e6e" />
          )}

          <Text style={styles.footerBtnText}>
            {likesState}
          </Text>
        </Pressable>



        <Pressable
          disabled={!isClickable}
          style={styles.footerBtn}
          onPress={() =>
            router.push({
              pathname: "/post/[id]",
              params: { id: postID }, 
            })
          }
        >
          <FontAwesome name="comment-o" size={18} color="#6e6e6e" />
          <View style={styles.commentPill}>
            <Text style={styles.commentPillText}>{commentCount}</Text>
          </View>
        </Pressable>
      </View>

    </Pressable>
  );

};

export default PostCard;
