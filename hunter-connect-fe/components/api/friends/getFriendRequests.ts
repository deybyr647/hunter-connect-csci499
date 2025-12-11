import { doc, getDoc } from "firebase/firestore";

import { db } from "../Firebase/firebaseConfig";

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
