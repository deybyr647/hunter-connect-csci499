import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export async function acceptFriendRequest(myUid: string, fromUid: string) {
  const myRef = doc(db, "users", myUid);
  const fromRef = doc(db, "users", fromUid);

  // Remove request + add to friends list
  await updateDoc(myRef, {
    incomingRequests: arrayRemove(fromUid),
    friends: arrayUnion(fromUid),
  });

  await updateDoc(fromRef, {
    outgoingRequests: arrayRemove(myUid),
    friends: arrayUnion(myUid),
  });

  return true;
}
