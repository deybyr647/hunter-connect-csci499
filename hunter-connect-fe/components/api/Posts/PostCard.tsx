import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import {Timestamp} from "firebase/firestore";

const styles = StyleSheet.create({
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

interface PostCardProps {
    content: string;
    title: string;
    author: string;
    timestamp: Timestamp;
    imageURL?: string;
    likes?: number;
}

const PostCard = ({content, title, author, timestamp}: PostCardProps) => {
    return(
        <View style={styles.post}>
            <View style={styles.userInfo}>
                <Image source={{ uri: "https://www.w3schools.com/howto/img_avatar2.png" }} style={styles.avatar} />
                <Text style={styles.username}>{author}</Text>
            </View>

            <Text style={styles.content}>{content}</Text>

            <View style={styles.actions}>
                <Pressable style={styles.actionBtn}>
                    <FontAwesome name="heart" size={18} color="#ff4d4d" />
                    <Text style={styles.likeText}>{5}</Text>
                </Pressable>
                <Pressable style={styles.actionBtn}>
                    <FontAwesome name="comment-o" size={18} color="#555" />
                </Pressable>
            </View>
        </View>
    )
}

export { PostCardProps };
export default PostCard;