import { arrayUnion, doc, updateDoc } from "firebase/firestore";

import { db } from "../firebaseConfig";

export async function sendFriendRequest(fromUid: string, toUid: string) {
  if (fromUid === toUid) throw new Error("Cannot friend yourself.");

  const fromRef = doc(db, "users", fromUid);
  const toRef = doc(db, "users", toUid);

  await updateDoc(fromRef, {
    outgoingRequests: arrayUnion(toUid),
  });

  await updateDoc(toRef, {
    incomingRequests: arrayUnion(fromUid),
  });

  return true;
}
