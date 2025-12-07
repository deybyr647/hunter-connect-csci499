interface UserInterface {
  uid: string;
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
  preferences?: {
    academicYear: string;
    courses: string[] | null;
    interests: string[] | null;
    skills: string[] | null;
  };
}

const createUser = async (body: UserInterface, bearerToken: string) => {
  const { uid, email, name } = body;
  const { firstName, lastName } = name;

  const createUserRequest: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      uid: uid,
      firstName: firstName,
      lastName: lastName,
      email: email,
    }),
    mode: "cors",
    credentials: "omit",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const req = await fetch(
      "http://localhost:8080/api/users",
      createUserRequest
    );

    const json: UserInterface = await req.json();

    if (req.status === 200) {
      console.log(json);
      console.log("Successful POST data to backend");
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

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
      uid: uid,
      firstName: firstName,
      lastName: lastName,
      email: email,
      preferences: preferences,
    }),
    mode: "cors",
    credentials: "omit",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const req = await fetch(
      "http://localhost:8080/api/users",
      updateUserRequest
    );

    const json: UserInterface = await req.json();

    if (req.status === 200) {
      console.log(json);
      console.log("Successful PUT data to backend");
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const getUser = async (uid: string | undefined, bearerToken: string | undefined) => {

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
    const req = await fetch(
      `http://localhost:8080/api/users/${uid}`,
      getUserRequest
    );

    const json: UserInterface = await req.json();

    if (req.status === 200) {
      console.log(json);
      console.log("Successful GET data from backend");
      return json;
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const getAllUsers = async (bearerToken: string) => {
  const getAllUsersRequest: RequestInit = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${bearerToken}`,
    },
    mode: "cors",
    credentials: "omit",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const req = await fetch(
      `http://localhost:8080/api/users/`,
      getAllUsersRequest
    );

    const json: UserInterface[] = await req.json();

    if (req.status === 200) {
      console.log(json);
      console.log("Successful GET data from backend");
      return json;
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export { UserInterface, createUser, updateUser, getUser, getAllUsers };
