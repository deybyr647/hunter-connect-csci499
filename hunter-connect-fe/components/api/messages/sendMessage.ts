import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db } from "../util/firebaseConfig";

export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string
) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const convoRef = doc(db, "conversations", conversationId);
  const msgRef = collection(convoRef, "messages");

  //  Write message
  await addDoc(msgRef, {
    text: trimmed,
    senderId,
    timestamp: serverTimestamp(),
  });

  //  Fetch conversation to find receiverId
  const convoSnap = await getDoc(convoRef);
  const convo = convoSnap.data();

  if (!convo) return;

  const participants: string[] = convo.participants || [];
  const receiverId = participants.find((p) => p !== senderId);

  //  Build unread field name: unread.uid
  const unreadField = `unread.${receiverId}`;

 
  await updateDoc(convoRef, {
    lastMessage: trimmed,
    lastMessageAt: serverTimestamp(),

    // Increment unread count for the OTHER user
    [unreadField]: increment(1),

    // Ensure sender unread stays at 0 (optional)
    [`unread.${senderId}`]: 0,
  });
}
