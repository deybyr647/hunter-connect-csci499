import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../Firebase/firebaseConfig";

export async function initUserSocial(uid: string) {
  const ref = doc(db, "users", uid);

  const snap = await getDoc(ref);
  if (snap.exists()) return; // Prevent overwriting

  await setDoc(ref, {
    friends: [],
    incomingRequests: [],
    outgoingRequests: [],
  });
}
