import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import {createPost, getAllPosts, PostInterface} from "@/components/api/Posts/Posts";
import { auth, db } from "@/components/api/Firebase/firebaseConfig";
import PostCard from "@/components/PostCard/PostCard";
import {courseList} from "@/components/util/OnboardingOptions";
import {generalTagList} from "@/components/util/TagOptions";

export default function Landing() {
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");

  const [generalTags, setGeneralTags] = useState<string[]>([]);
  const [courseTags, setCourseTags] = useState<string[]>([]);

  const [generalOpen, setGeneralOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);

  const listModeConfig = Platform.OS === "web" ? "FLATLIST" : "MODAL";

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
          const bearerToken = await user.getIdToken();
        const fetchedPosts = await getAllPosts(bearerToken);
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    })();
  }, []);

  const handleCreatePost = async () => {
    if (!user) return;
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    try {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      let creatorName = "Unknown";

      if (userSnap.exists()) {
        const d = userSnap.data();
        creatorName = `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim();
      }

      const docRef = await addDoc(collection(db, "posts"), {
        uid: "",
        userID: user.uid,
        content,
        title,
        location,
        timestamp: serverTimestamp(),
        creatorName,
        likes: 0,
        tags: {
          general: generalTags,
          courses: courseTags,
        },
      });

      const newPost: PostInterface = {
        postID: docRef.id,
        userID: user.uid,
        content,
        title,
        location,
        timestamp: new Date(),
        creatorName,
        likes: 0,
        tags: {
          general: [...generalTags],
          courses: [...courseTags],
        },
      };

      setPosts((prev) => [newPost, ...prev]);

      setShowCreatePost(false);
      setTitle("");
      setContent("");
      setLocation("");
      setGeneralTags([]);
      setCourseTags([]);

      alert("Post Created!");
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post");
    }
  };

  return (
    <Animated.View
      entering={SlideInRight.duration(250)}
      exiting={SlideOutRight.duration(200)}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* HEADER */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Your Feed</Text>

            <TouchableOpacity
              style={styles.createPostCompact}
              onPress={() => setShowCreatePost(!showCreatePost)}
            >
              <Ionicons name="add-circle-outline" size={18} color="#5A31F4" />
              <Text style={styles.createPostText}>Create Post</Text>
            </TouchableOpacity>
          </View>

          {/* CREATE FORM */}
          {showCreatePost && (
            <View style={styles.createBox}>
              <TextInput
                style={styles.input}
                placeholder="Post Title"
                value={title}
                onChangeText={setTitle}
              />

              <TextInput
                style={[styles.input, { height: 100 }]}
                multiline
                placeholder="What's on your mind?"
                value={content}
                onChangeText={setContent}
              />

              <TextInput
                style={styles.input}
                placeholder="Location (optional)"
                value={location}
                onChangeText={setLocation}
              />

              {/* GENERAL TAGS */}
              <Text style={styles.label}>General Tags</Text>
              <View
                style={{
                  zIndex: generalOpen ? 3000 : 1,
                  marginBottom: generalOpen ? 200 : 10,
                }}
              >
                <DropDownPicker
                  open={generalOpen}
                  value={null}
                  items={generalTagList}
                  setOpen={(open) => {
                    setGeneralOpen(open);
                    setCourseOpen(false);
                  }}
                  setValue={() => {}}
                  onSelectItem={(item) => {
                    if (!item.value) return;

                    if (!generalTags.includes(item.value)) {
                      setGeneralTags([...generalTags, item.value]);
                    }
                  }}
                  placeholder="Select general tags..."
                  listMode={listModeConfig}
                  modalAnimationType="slide"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {generalTags.map((tag, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.tagPurple}
                    onPress={() =>
                      setGeneralTags(generalTags.filter((t) => t !== tag))
                    }
                  >
                    <Text style={styles.tagPurpleText}>
                      {tag} <Text style={styles.remove}>✕</Text>
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* COURSE TAGS */}
              <Text style={styles.label}>Course Tags</Text>
              <View
                style={{
                  zIndex: courseOpen ? 2000 : 1,
                  marginBottom: courseOpen ? 200 : 10,
                }}
              >
                <DropDownPicker
                  open={courseOpen}
                  value={null}
                  items={courseList}
                  setOpen={(open) => {
                    setCourseOpen(open);
                    setGeneralOpen(false);
                  }}
                  setValue={() => {}}
                  onSelectItem={(item) => {
                    if (!item.value || item.selectable === false) return;

                    if (!courseTags.includes(item.value)) {
                      setCourseTags([...courseTags, item.value]);
                    }
                  }}
                  placeholder="Select course tags..."
                  listMode={listModeConfig}
                  searchable
                  modalAnimationType="slide"
                  style={styles.dropdown}
                  dropDownContainerStyle={{
                    ...styles.dropdownContainer,
                    maxHeight: 400,
                  }}
                />
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {courseTags.map((tag, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.tagGreen}
                    onPress={() =>
                      setCourseTags(courseTags.filter((t) => t !== tag))
                    }
                  >
                    <Text style={styles.tagGreenText}>
                      {tag} <Text style={styles.remove}>✕</Text>
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreatePost}
              >
                <Text style={styles.createButtonText}>Create Post</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* POSTS FEED */}
          {loading ? (
            <ActivityIndicator size="large" color="#5A31F4" />
          ) : (
              posts?.map(PostCard)
          )}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },

  scrollContent: {
    paddingBottom: 50,
    alignItems: "center",
  },

  /* Header */
  pageHeader: {
    width: "100%",
    maxWidth: 700,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  createPostCompact: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFE9FF",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  createPostText: {
    marginLeft: 6,
    color: "#5A31F4",
    fontWeight: "600",
  },

  /* Create Form */
  createBox: {
    width: "100%",
    maxWidth: 700,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#FFF",
  },

  label: {
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 14,
  },

  dropdown: {
    borderColor: "#CCC",
    borderRadius: 10,
    backgroundColor: "#FFF",
  },

  dropdownContainer: {
    borderColor: "#CCC",
    borderRadius: 10,
  },

  createButton: {
    backgroundColor: "#6B4CF6",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  createButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  /* Post Card */
  post: {
    width: "100%",
    maxWidth: 700,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: {
    marginRight: 10,
  },

  username: {
    fontWeight: "600",
    fontSize: 16,
    color: "#222",
  },

  timestamp: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  postTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#222",
  },

  content: {
    fontSize: 15,
    marginBottom: 12,
    color: "#444",
    lineHeight: 20,
  },

  actions: {
    flexDirection: "row",
    gap: 15,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  likeText: {
    color: "#555",
    fontSize: 14,
  },

  /* Tags */
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 8,
  },

  tagPurple: {
    backgroundColor: "#EFE9FF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },

  tagPurpleText: {
    color: "#6B4CF6",
    fontSize: 12,
    fontWeight: "600",
  },

  tagGreen: {
    backgroundColor: "#E8F9EF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },

  tagGreenText: {
    color: "#0F6F3C",
    fontSize: 12,
    fontWeight: "600",
  },

  remove: {
    color: "#999",
    marginLeft: 4,
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  cardDetail: {
    marginLeft: 6,
    fontSize: 14,
    color: "#444",
  },
});
