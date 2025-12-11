import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "@/components/api/Firebase/firebaseConfig";

export async function toggleLike(postId: string, userId: string) {
  const ref = doc(db, "posts", postId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();
  const likedBy = data.likedBy || [];

  const alreadyLiked = likedBy.includes(userId);

  if (alreadyLiked) {
    // Unlike
    await updateDoc(ref, {
      likedBy: arrayRemove(userId),
      likes: (data.likes || 1) - 1,
    });
  } else {
    // Like
    await updateDoc(ref, {
      likedBy: arrayUnion(userId),
      likes: (data.likes || 0) + 1,
    });
  }
}
