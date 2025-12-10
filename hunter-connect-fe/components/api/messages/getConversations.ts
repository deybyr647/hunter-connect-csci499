import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../Firebase/firebaseConfig";
import { Conversation } from "./types";

export function listenToConversations(
  userId: string,
  callback: (convos: Conversation[]) => void
) {
  const q = query(
    collection(db, "conversations"),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(q, async (snap) => {
    const list: Conversation[] = [];

    // We will build conversations asynchronously
    const convoPromises = snap.docs.map(async (docSnap) => {
      const d = docSnap.data();
      if (!d.participants?.includes(userId)) return null;

      // BUILD participantData LIVE FROM FIRESTORE
      const participantData: any = {};

      await Promise.all(
        d.participants.map(async (pid: string) => {
          const uref = doc(db, "users", pid);
          const uSnap = await getDoc(uref);

          if (uSnap.exists()) {
            participantData[pid] = {
              username: uSnap.data().username,
              fullName: uSnap.data().fullName,
              status: uSnap.data().status ?? null,  // ← LIVE PRESENCE DATA
            };
          }
        })
      );

      return {
        id: docSnap.id,
        lastMessage: d.lastMessage ?? "",
        lastMessageAt: d.lastMessageAt ?? null,
        participants: d.participants ?? [],
        participantData,
        unread: d.unread || {},
      } as Conversation;
    });

    const results = await Promise.all(convoPromises);

    // Remove null items
    callback(results.filter((c) => c !== null) as Conversation[]);
  });
}
