import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../Firebase/firebaseConfig";

export async function createConversation(
  userA: string,
  userB: string,
  participantData: any
) {
  const ref = await addDoc(collection(db, "conversations"), {
    participants: [userA, userB],
    participantData,
    lastMessage: "",
    lastMessageAt: serverTimestamp(),
  });

  return ref.id;
}
