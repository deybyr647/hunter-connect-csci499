import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/components/api/Firebase/firebaseConfig";
import ReplyableComment from "./ReplyableComment";

interface Comment {
  id: string;
  text: string;
  creatorName: string;
  createdAt: any;
  parentId?: string | null;
  replies?: Comment[];
}

export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  /** Convert flat list into nested comment tree */
  const buildCommentTree = (list: Comment[]) => {
    const map: Record<string, Comment> = {};
    list.forEach((c) => (map[c.id] = { ...c, replies: [] }));

    const roots: Comment[] = [];

    list.forEach((c) => {
      if (c.parentId) {
        map[c.parentId]?.replies?.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });

    return roots;
  };

  /** Fetch comments from Firestore */
  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];

      const tree = buildCommentTree(list);
      setComments(tree);
    });

    return unsubscribe;
  }, [postId]);

  /** Add a top-level comment */
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const user = auth.currentUser;

    await addDoc(collection(db, "posts", postId, "comments"), {
      text: newComment,
      creatorName: user?.displayName || "Anonymous",
      createdAt: new Date(),
      parentId: null,
    });

    setNewComment("");
  };

  /** Add a reply to an existing comment */
  const handleReply = async (parentId: string, replyText: string) => {
    if (!replyText.trim()) return;
    const user = auth.currentUser;

    await addDoc(collection(db, "posts", postId, "comments"), {
      text: replyText,
      creatorName: user?.displayName ?? "Anonymous",
      createdAt: new Date(),
      parentId,
      likes: 0,            
      likedBy: [],         
    });

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>

      {/* TOP-LEVEL COMMENT INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.sendBtn}>
          <Text style={styles.sendBtnText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* COMMENT THREAD */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {comments.map((comment) => (
          <ReplyableComment
            key={comment.id}
            comment={comment}
            postId={postId}
            onReply={handleReply}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  input: {
    flex: 1,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 14,
  },

  sendBtn: {
    marginLeft: 10,
    backgroundColor: "#5A31F4",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  sendBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
