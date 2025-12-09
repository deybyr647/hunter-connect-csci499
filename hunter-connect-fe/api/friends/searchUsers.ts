import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebaseConfig";

export async function searchUsers(searchTerm: string) {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return [];

  const usersRef = collection(db, "users");

  // Username prefix search (e.g., "lu" matches "lucy", "luna", etc.)
  const q = query(
    usersRef,
    where("username", ">=", term),
    where("username", "<=", term + "\uf8ff")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const data = doc.data();

    return {
      uid: doc.id,
      ...data,
      fullName: `${data.firstName} ${data.lastName}`.trim(),
    };
  });
}
