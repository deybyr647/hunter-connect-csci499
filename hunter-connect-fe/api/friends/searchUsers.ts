import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebaseConfig";

export async function searchUsers(searchTerm: string) {
  if (!searchTerm.trim()) return [];

  const usersRef = collection(db, "users");

  // Basic search (Firestore doesn't allow contains text search)
  const q = query(
    usersRef,
    where("email", ">=", searchTerm),
    where("email", "<=", searchTerm + "\uf8ff")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));
}
