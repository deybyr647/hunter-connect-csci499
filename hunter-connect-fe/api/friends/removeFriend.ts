import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

export async function removeFriend(uidA: string, uidB: string) {
  const aRef = doc(db, "users", uidA);
  const bRef = doc(db, "users", uidB);

  await updateDoc(aRef, {
    friends: arrayRemove(uidB),
  });

  await updateDoc(bRef, {
    friends: arrayRemove(uidA),
  });

  return true;
}
