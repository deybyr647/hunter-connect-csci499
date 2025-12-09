import { db } from "@/api/firebaseConfig";
import { Message } from "./types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export function listenToMessages(conversationId: string, callback: (msgs: Message[]) => void) {
  const msgRef = collection(db, "conversations", conversationId, "messages");
  const q = query(msgRef, orderBy("timestamp"));

  return onSnapshot(q, (snap) => {
    const msgs: Message[] = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Message[];

    callback(msgs);
  });
}
