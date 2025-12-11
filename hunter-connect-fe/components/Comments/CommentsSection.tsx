import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/components/api/Firebase/firebaseConfig";


interface Comment {
  id: string;
  text: string;
  creatorName: string;
  createdAt: any;
}

export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments in real-time
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

      setComments(list);
    });

    return unsubscribe;
  }, [postId]);

  // Create a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const user = auth.currentUser;

    await addDoc(collection(db, "posts", postId, "comments"), {
      text: newComment,
      creatorName: user?.displayName || "Anonymous",
      createdAt: new Date(),
    });

    setNewComment("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>

      {/* Input */}
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

      {/* Comments List */}
      {comments.map((comment) => (
        <View key={comment.id} style={styles.commentBox}>
          <Text style={styles.commentAuthor}>{comment.creatorName}</Text>
          <Text style={styles.commentText}>{comment.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 8,
    height: 40,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#5A31F4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sendBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  commentBox: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  commentAuthor: {
    fontWeight: "700",
    marginBottom: 2,
  },
  commentText: {
    color: "#333",
  },
});
