interface UserInterface {
  uid: string;
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
  username: string;

  // Friend system fields
  incomingRequests: string[];
  outgoingRequests: string[];
  friends: string[];

  preferences?: {
    academicYear: string;
    courses: string[] | null;
    interests: string[] | null;
    skills: string[] | null;
  };
}

/* ---------------- CREATE USER ---------------- */
const createUser = async (body: UserInterface, bearerToken: string) => {
  const { uid, email, name, username } = body;
  const { firstName, lastName } = name;

  const createUserRequest: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      uid,
      firstName,
      lastName,
      email,
      username
    }),
  };

  try {
    const req = await fetch("http://localhost:8080/api/users", createUserRequest);
    if (!req.ok) throw new Error("Failed to create user");
    console.log("User created.");
  } catch (error) {
    return Promise.reject(error);
  }
};

/* ---------------- UPDATE USER ---------------- */
const updateUser = async (body: UserInterface, bearerToken: string) => {
  const { uid, email, name, preferences } = body;

  const updateUserRequest: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      uid,
      firstName: name.firstName,
      lastName: name.lastName,
      email,
      preferences,
    }),
  };

  try {
    const req = await fetch("http://localhost:8080/api/users", updateUserRequest);
    if (!req.ok) throw new Error("Failed to update user");
    console.log("User updated.");
  } catch (error) {
    return Promise.reject(error);
  }
};

/* ---------------- GET USER ---------------- */
const getUser = async (uid: string | undefined, bearerToken: string | undefined) => {
  const getUserRequest: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    }
  };

  try {
    const req = await fetch(`http://localhost:8080/api/users/${uid}`, getUserRequest);
    const data = await req.json();

    if (req.status === 200) {
      console.log("GET USER:", data);

      const normalized: UserInterface = {
        uid: data.uid,
        email: data.email,
        name: {
          firstName: data.firstName,
          lastName: data.lastName
        },
        username: data.username,

        // Normalize lists – prevent null from blowing up UI
        incomingRequests: data.incomingRequests ?? [],
        outgoingRequests: data.outgoingRequests ?? [],
        friends: data.friends ?? [],

        preferences: data.preferences ?? undefined
      };

      return normalized;
    }

    return undefined;
  } catch (error) {
    return Promise.reject(error);
  }
};

/* ---------------- GET ALL USERS ---------------- */
const getAllUsers = async (bearerToken: string) => {
  const getAllUsersRequest: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
  };

  try {
    const req = await fetch("http://localhost:8080/api/users/", getAllUsersRequest);
    const json = await req.json();

    if (req.status === 200) {
      console.log("ALL USERS:", json);
      return json.map((u: any) => ({
        uid: u.uid,
        email: u.email,
        name: {
          firstName: u.firstName,
          lastName: u.lastName
        },
        username: u.username,
        incomingRequests: u.incomingRequests ?? [],
        outgoingRequests: u.outgoingRequests ?? [],
        friends: u.friends ?? [],
        preferences: u.preferences ?? undefined
      })) as UserInterface[];
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export { UserInterface, createUser, updateUser, getUser, getAllUsers };
