import { arrayRemove, doc, updateDoc } from "firebase/firestore";

import { db } from "../firebaseConfig";

export async function declineFriendRequest(myUid: string, fromUid: string) {
  const myRef = doc(db, "users", myUid);
  const fromRef = doc(db, "users", fromUid);

  await updateDoc(myRef, {
    incomingRequests: arrayRemove(fromUid),
  });

  await updateDoc(fromRef, {
    outgoingRequests: arrayRemove(myUid),
  });

  return true;
}
