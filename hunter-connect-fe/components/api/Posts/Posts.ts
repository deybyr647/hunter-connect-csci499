import { Timestamp } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/api/Firebase/firebaseConfig";

interface PostInterface {
  content: string;
  creatorName: string;
  likes: number;
  likedBy?: string[];
  location: string;
  tags: {
    courses: string[];
    general: string[];
  };
  timestamp: Timestamp | Date;
  title: string;
  postID: string;
  userID: string;
}
export async function getPostById(id: string) {
  const snap = await getDoc(doc(db, "posts", id));
  if (!snap.exists()) return null;

  return {
    postID: snap.id,   
    ...snap.data()
  };
}
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

const createPost = async (
  body: Partial<PostInterface>,
  bearerToken: string
) => {
  // We extract only what we need to send.
  // Backend sets userID from token, timestamp if missing, and generates postID.
  const { content, title, location, tags } = body;

  const createPostRequest: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      content,
      title,
      location,
      tags,
    }),
    mode: "cors",
    credentials: "omit",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const req = await fetch(`${API_URL}/api/posts`, createPostRequest);
    const json = await req.json();

    if (req.status === 201) {
      console.log(json);
      console.log("Successful POST data to backend");
      return json;
    } else {
      console.error("Create post failed", json);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const updatePost = async (
  body: Partial<PostInterface>,
  bearerToken: string
) => {
  const { postID, content, title, location, tags } = body;

  if (!postID) {
    throw new Error("Post ID is required for update");
  }

  const updatePostRequest: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      content,
      title,
      location,
      tags,
    }),
    mode: "cors",
    credentials: "omit",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    // Note: The ID is passed in the URL, matching the backend handler
    const req = await fetch(
      `${API_URL}/api/posts/${postID}`,
      updatePostRequest
    );
    const json = await req.json();

    if (req.status === 200) {
      console.log(json);
      console.log("Successful PUT data to backend");
      return json;
    } else {
      console.error("Update post failed", json);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const getPost = async (postID: string, bearerToken: string) => {
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
    const req = await fetch(`${API_URL}/api/posts/${postID}`, getPostRequest);

    if (req.status === 200) {
      const json: PostInterface = await req.json();
      console.log(json);
      console.log("Successful GET data from backend");
      return json;
    } else {
      console.error("Get post failed", req.status);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const getAllPosts = async (bearerToken: string) => {
  const getAllPostsRequest: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`, // Added auth header
      Accept: "application/json",
    },
    mode: "cors",
    credentials: "omit",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer-when-downgrade",
  };

  try {
    const req = await fetch(`${API_URL}/api/posts`, getAllPostsRequest);

    if (req.status === 200) {
      const json: PostInterface[] = await req.json();
      console.log("Fetched " + json.length + " posts");
      return json;
    } else {
      console.error("Get all posts failed", req.status);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export { PostInterface, createPost, updatePost, getPost, getAllPosts };
