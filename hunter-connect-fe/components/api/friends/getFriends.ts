import { doc, getDoc } from "firebase/firestore";

import { db } from "../Firebase/firebaseConfig";

export async function getFriends(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return [];

  return snap.data().friends || [];
}
