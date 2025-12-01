/* import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/Landing.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
*/

import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const dummyPosts = [
  {
    id: "1",
    user: "Alice",
    avatar: "https://www.w3schools.com/howto/img_avatar2.png",
    content: "Just finished my final project! 😎",
    likes: 12,
  },
  {
    id: "2",
    user: "Bob",
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    content: "I think I'm addicted to boba.",
    likes: 7,
  },
  {
    id: "3",
    user: "Charlie",
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    content: "Anyone up for a coffee meetup this weekend?",
    likes: 5,
  },
  {
    id: "4",
    user: "Dana",
    avatar: "https://www.w3schools.com/howto/img_avatar2.png",
    content: "Burried under hw -- help!",
    likes: 20,
  },
  {
    id: "5",
    user: "Eli",
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    content: "Coding all night but lowkey loving it 😅",
    likes: 15,
  },
  {
    id: "6",
    user: "Fiona",
    avatar: "https://www.w3schools.com/howto/img_avatar2.png",
    content: "Just baked some cookies 🍪 Who wants some?",
    likes: 9,
  },
  {
    id: "7",
    user: "George",
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    content: "Anyone else watching the new season of Bridgerton?",
    likes: 4,
  },
  {
    id: "8",
    user: "Hannah",
    avatar: "https://www.w3schools.com/howto/img_avatar2.png",
    content: "Feeling productive today! 💪",
    likes: 11,
  },
  {
    id: "9",
    user: "Ian",
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    content: "Throwback to summer vibes 🌞",
    likes: 18,
  },
  {
    id: "10",
    user: "Jade",
    avatar: "https://www.w3schools.com/howto/img_avatar2.png",
    content: "Trying out a new recipe tonight! 🍝",
    likes: 6,
  },
];


export default function Landing() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Feed</Text>

      <FlatList
        data={dummyPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <View style={styles.userInfo}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <Text style={styles.username}>{item.user}</Text>
            </View>

            <Text style={styles.content}>{item.content}</Text>

            <View style={styles.actions}>
              <Pressable style={styles.actionBtn}>
                <FontAwesome name="heart" size={18} color="#ff4d4d" />
                <Text style={styles.likeText}>{item.likes}</Text>
              </Pressable>
              <Pressable style={styles.actionBtn}>
                <FontAwesome name="comment-o" size={18} color="#555" />
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  post: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "600",
    fontSize: 16,
  },
  content: {
    fontSize: 15,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 15,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  likeText: {
    color: "#555",
  },
});