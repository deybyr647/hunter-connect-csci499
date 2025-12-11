import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { timestampToDate } from "@/components/util/Timestamp";
import { auth, db } from "@/components/api/Firebase/firebaseConfig";
import { toggleCommentLike } from "@/components/Comments/toggleCommentLike";
import { doc, onSnapshot } from "firebase/firestore";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface ReplyableCommentProps {
  comment: any;               // contains text, creatorName, createdAt, replies[]
  postId: string;             // needed for writing replies
  onReply: (parentId: string, text: string) => void;
  depth?: number;             // indentation level
}

export default function ReplyableComment({
  comment,
  postId,
  onReply,
  depth = 0,
}: ReplyableCommentProps) {

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const user = auth.currentUser;

  const [likesState, setLikesState] = useState(comment.likes ?? 0);
  const [likedByState, setLikedByState] = useState(comment.likedBy ?? []);
  const liked = likedByState.includes(user?.uid ?? "");

  useEffect(() => {
    const ref = doc(db, "posts", postId, "comments", comment.id);

    const unsubscribe = onSnapshot(ref, snap => {
        if (!snap.exists()) return;
        const data = snap.data();
        setLikesState(data.likes ?? 0);
        setLikedByState(data.likedBy ?? []);
    });

    return unsubscribe;
    }, [postId, comment.id]);

  const formatRelativeTime = (ts: any) => {
    const date = timestampToDate(ts);
    const diff = (Date.now() - date.getTime()) / 1000;

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <View style={[styles.container, { marginLeft: depth * 12 }]}>
      
      {/* LEFT INDENT BAR */}
      <View style={styles.leftBar} />

      {/* COMMENT BODY */}
      <View style={styles.content}>
        
        {/* Header with name + time */}
        <View style={styles.header}>
          <Text style={styles.author}>{comment.creatorName}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.time}>{formatRelativeTime(comment.createdAt)}</Text>
        </View>

        {/* Text */}
        <Text style={styles.text}>{comment.text}</Text>

        {/* Reply Button */}
        <View style={styles.actionRow}>
          {/* Reply */}
          <TouchableOpacity onPress={() => setShowReplyBox(!showReplyBox)}>
            <Text style={styles.replyBtn}>Reply</Text>
          </TouchableOpacity>

          {/* Like */}
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => {
              if (!user) return;
              toggleCommentLike(postId, comment.id, user.uid);
            }}
          >
            {liked ? (
              <FontAwesome name="heart" size={15} color="#e24b4b" />
            ) : (
              <FontAwesome name="heart-o" size={15} color="#777" />
            )}
            <Text style={styles.likeCount}>{likesState}</Text>
          </TouchableOpacity>
        </View>


        {showReplyBox && (
          <View style={styles.replyBox}>
            <TextInput
              placeholder="Write a reply..."
              value={replyText}
              onChangeText={setReplyText}
              style={styles.replyInput}
            />
            <TouchableOpacity
              style={styles.postReplyBtn}
              onPress={() => {
                if (replyText.trim().length === 0) return;
                onReply(comment.id, replyText);
                setReplyText("");
                setShowReplyBox(false);
              }}
            >
              <Text style={styles.postReplyText}>Post</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Render Replies Recursively */}
        {comment.replies?.map((reply: any) => (
          <ReplyableComment
            key={reply.id}
            comment={reply}
            postId={postId}
            depth={depth + 1}
            onReply={onReply}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
  },

  leftBar: {
    width: 3,
    backgroundColor: "#dcdcdc",
    borderRadius: 6,
    marginRight: 10,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },

  author: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },

  dot: {
    marginHorizontal: 4,
    color: "#777",
  },

  time: {
    fontSize: 12,
    color: "#777",
  },

  text: {
    fontSize: 15,
    color: "#1a1a1b",
    marginBottom: 6,
  },

  replyBtn: {
    color: "#5A31F4",
    fontWeight: "500",
    fontSize: 13,
    marginBottom: 6,
  },

  replyBox: {
    marginTop: 4,
  },

  replyInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
  },

  postReplyBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#5A31F4",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 6,
  },

  postReplyText: {
    color: "white",
    fontWeight: "600",
  },

  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 8,
    gap: 16,             // space between Reply + Like
  },

  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  likeCount: {
    fontSize: 13,
    color: "#555",
  },


});
