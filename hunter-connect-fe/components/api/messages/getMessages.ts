import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "../util/firebaseConfig";
import { Message } from "./types";

export function listenToMessages(
  conversationId: string,
  callback: (msgs: Message[]) => void
) {
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
