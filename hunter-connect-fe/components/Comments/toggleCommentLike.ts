import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/components/api/Firebase/firebaseConfig";

export async function toggleCommentLike(postId: string, commentId: string, userId: string) {
  const ref = doc(db, "posts", postId, "comments", commentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const likedBy = data.likedBy ?? [];
  const alreadyLiked = likedBy.includes(userId);

  if (alreadyLiked) {
    // UNLIKE
    await updateDoc(ref, {
      likedBy: arrayRemove(userId),
      likes: (data.likes || 1) - 1,
    });
  } else {
    // LIKE
    await updateDoc(ref, {
      likedBy: arrayUnion(userId),
      likes: (data.likes || 0) + 1,
    });
  }
}
