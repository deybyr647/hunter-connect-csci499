import { db } from "../Firebase/firebaseConfig";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  doc,
} from "firebase/firestore";

export async function createConversationIfAbsent(uid1: string, uid2: string) {
  const ref = collection(db, "conversations");

  // Check existing conversation
  const q = query(ref, where("participants", "array-contains", uid1));
  const snap = await getDocs(q);

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    if (data.participants.includes(uid2)) {
      return docSnap.id;
    }
  }

  // Fetch user profiles for participantData
  const user1Doc = await getDoc(doc(db, "users", uid1));
  const user2Doc = await getDoc(doc(db, "users", uid2));

  const user1 = user1Doc.data() || {};
  const user2 = user2Doc.data() || {};

  // Create conversation with participantData
  const newConvo = await addDoc(ref, {
    participants: [uid1, uid2],
    participantData: {
      [uid1]: user1,
      [uid2]: user2,
    },
    lastMessage: "",
    updatedAt: serverTimestamp(),
  });

  return newConvo.id;
}
