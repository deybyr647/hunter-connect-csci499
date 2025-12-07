interface PostInterface {
  uid: string;
  bearerToken: string;
  userID: string;
  content: string;
  title: string;
  timestamp: Date;
}

const createPost = async (body: PostInterface) => {
  const { uid, userID, bearerToken, content, title, timestamp } = body;

  const createPostRequest: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      uid: uid,
      userID: userID,
      bearerToken: bearerToken,
      content: content,
      title: title,
      timestamp: timestamp,
    }),
    mode: "cors",
    credentials: "omit",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const req = await fetch(
      "http://localhost:8080/api/posts",
      createPostRequest
    );
    const json = await req.json();

    if (req.status === 200) {
      console.log(json);
      console.log("Successful POST data to backend");
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const updatePost = async (body: PostInterface) => {
  const { uid, userID, bearerToken, content, title, timestamp } = body;

  const updatePostRequest: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      uid: uid,
      userID: userID,
      bearerToken: bearerToken,
      content: content,
      title: title,
      timestamp: timestamp,
    }),
    mode: "cors",
    credentials: "omit",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const req = await fetch(
      "http://localhost:8080/api/posts",
      updatePostRequest
    );
    const json = await req.json();

    if (req.status === 200) {
      console.log(json);
      console.log("Successful PUT data to backend");
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const getPost = async (body: PostInterface) => {
  const { uid, bearerToken } = body;

  const getPostRequest: RequestInit = {
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
      getPostRequest
    );
    const json = await req.json();

    if (req.status === 200) {
      console.log(json);
      console.log("Successful GET data from backend");
      return json;
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const getAllPosts = async () => {
  const getAllPostsRequest: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
      `http://localhost:8080/api/users/`,
      getAllPostsRequest
    );
    const json = await req.json();

    if (req.status === 200) {
      console.log(json);
      console.log("Successful GET data from backend");
      return json;
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export { PostInterface, createPost, updatePost, getPost, getAllPosts };
