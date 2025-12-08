import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

import { db } from "../firebaseConfig";

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
