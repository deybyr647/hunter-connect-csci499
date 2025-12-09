import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "../util/firebaseConfig";
import { Conversation } from "./types";

export function listenToConversations(
  userId: string,
  callback: (convos: Conversation[]) => void
) {
  const q = query(
    collection(db, "conversations"),
    orderBy("lastMessageAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    const list: Conversation[] = [];

    snap.forEach((docSnap) => {
      const d = docSnap.data();
      if (!d.participants?.includes(userId)) return;

      list.push({
        id: docSnap.id,
        lastMessage: d.lastMessage ?? "",
        lastMessageAt: d.lastMessageAt ?? null,
        participants: d.participants ?? [],
        participantData: d.participantData ?? {},
        unreadCount: d.unreadCount ?? 0,
      });
    });

    callback(list);
  });
}
