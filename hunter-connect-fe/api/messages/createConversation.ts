import { db } from "@/api/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function createConversation(userA: string, userB: string, participantData: any) {
  const ref = await addDoc(collection(db, "conversations"), {
    participants: [userA, userB],
    participantData,
    lastMessage: "",
    lastMessageAt: serverTimestamp(),
  });

  return ref.id;
}
