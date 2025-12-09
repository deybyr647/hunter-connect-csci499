import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../util/firebaseConfig";

export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string
) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const msgRef = collection(db, "conversations", conversationId, "messages");

  await addDoc(msgRef, {
    text: trimmed,
    senderId,
    timestamp: serverTimestamp(),
  });

  // update last message preview
  await updateDoc(doc(db, "conversations", conversationId), {
    lastMessage: trimmed,
    lastMessageAt: serverTimestamp(),
  });
}
