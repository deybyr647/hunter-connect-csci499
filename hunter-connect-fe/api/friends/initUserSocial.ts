import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
