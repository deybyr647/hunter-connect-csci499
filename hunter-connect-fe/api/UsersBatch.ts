import { auth } from "@/api/firebaseConfig";

import { getUser } from "./Users";

export async function getUsersByUIDs(uids: string[]) {
  if (!uids || uids.length === 0) return [];

  const token = (await auth.currentUser?.getIdToken()) ?? "";

  const users = await Promise.all(
    uids.map(async (id) => {
      try {
        const profile = await getUser(id, token);

        if (!profile) {
          return {
            uid: id,
            fullName: "Unknown User",
            email: "",
          };
        }

        return {
          uid: id,
          fullName: `${profile.firstName} ${profile.lastName}`,
          email: profile.email,
          username: profile.username,
        };
      } catch (error) {
        return {
          uid: id,
          fullName: "Unknown User",
          email: "",
        };
      }
    })
  );

  return users;
}
