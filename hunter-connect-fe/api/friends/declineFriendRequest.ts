import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

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
