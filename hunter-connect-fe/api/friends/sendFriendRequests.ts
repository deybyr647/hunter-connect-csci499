import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

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
