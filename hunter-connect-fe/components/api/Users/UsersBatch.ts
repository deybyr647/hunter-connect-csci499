import { auth } from "@/components/api/Firebase/firebaseConfig";

import { getUser } from "./Users";

export const getUsersByUIDs = async (uids: string[]) => {
  if (!uids || uids.length === 0) return [];

  const token = (await auth.currentUser?.getIdToken()) ?? "";

  return await Promise.all(
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
};
