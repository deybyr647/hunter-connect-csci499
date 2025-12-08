interface UserInterface {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;

  // Friend system fields
  incomingRequests: string[];
  outgoingRequests: string[];
  friends: string[];

  preferences?: {
    academicYear: string;
    courses: string[];
    interests: string[];
    skills: string[];
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
      mode: "cors",
      credentials: "omit",
      cache: "no-cache",
      redirect: "follow",
      referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const req = await fetch("http://localhost:8080/api/users", createUserRequest);
    const json = await req.json();
    console.log("User created.");
    return json;
  } catch (error) {
    return Promise.reject(error);
  }
};

/* ---------------- UPDATE USER ---------------- */
const updateUser = async (body: UserInterface, bearerToken: string) => {
  const { uid, email, name, preferences } = body;
  const { firstName, lastName } = name;

  const updateUserRequest: RequestInit = {
    method: "PUT",
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
      preferences,
    }),
      mode: "cors",
      credentials: "omit",
      cache: "no-cache",
      redirect: "follow",
      referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const req = await fetch("http://localhost:8080/api/users", updateUserRequest);
    const json = await req.json();

    console.log("User updated.");
    return json;
  } catch (error) {
    return Promise.reject(error);
  }
};

/* ---------------- GET USER ---------------- */
const getUser = async (uid: string, bearerToken: string) => {
  const getUserRequest: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
      mode: "cors",
      credentials: "omit",
      cache: "no-cache",
      redirect: "follow",
      referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const req = await fetch(`http://localhost:8080/api/users/${uid}`, getUserRequest);
    const data: UserInterface = await req.json();
    return data;
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
      mode: "cors",
      credentials: "omit",
      cache: "no-cache",
      redirect: "follow",
      referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const req = await fetch("http://localhost:8080/api/users", getAllUsersRequest);
    const json: UserInterface[] = await req.json();
      console.log("Successful GET data from backend");
      return json;
  } catch (error) {
    return Promise.reject(error);
  }
};

export { UserInterface, createUser, updateUser, getUser, getAllUsers };
