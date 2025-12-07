import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export async function getFriendRequests(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { incoming: [], outgoing: [] };

  const data = snap.data();

  return {
    incoming: data.incomingRequests || [],
    outgoing: data.outgoingRequests || [],
  };
}
