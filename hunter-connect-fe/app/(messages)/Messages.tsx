import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "@/components/util/Themed";
import { listenToConversations } from "@/components/api/messages/getConversations";
import { listenToMessages } from "@/components/api/messages/getMessages";
import { sendMessage } from "@/components/api/messages/sendMessage";
import { Conversation, Message } from "@/components/api/messages/types";
import { auth } from "@/components/api/Firebase/firebaseConfig";

export default function MessagesScreen() {
  const user = auth.currentUser;
  const router = useRouter();

  /* ---------------- STATE ---------------- */
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");

  const flatListRef = useRef<FlatList>(null);

  /* ------------ LISTEN TO CONVERSATIONS ------------ */
  useEffect(() => {
    if (!user) return;
    const unsub = listenToConversations(user.uid, setConversations);
    return unsub;
  }, [user]);

  /* ------------ LISTEN TO MESSAGES ------------ */
  useEffect(() => {
    if (!selectedConversationId) return;

    const unsub = listenToMessages(selectedConversationId, (msgs) => {
      setMessages(msgs);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    });

    return unsub;
  }, [selectedConversationId]);

  /* ------------ SEND MESSAGE ------------ */
  const handleSend = async () => {
    if (!inputText.trim() || !user || !selectedConversationId) return;

    await sendMessage(selectedConversationId, user.uid, inputText);
    setInputText("");
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  /* ==================================================================== */
  /* ============================ CHAT VIEW ============================== */
  /* ==================================================================== */

  if (selectedConversation) {
    const otherId = selectedConversation.participants.find(
      (p) => p !== user?.uid
    );
    const otherUser = otherId
      ? selectedConversation.participantData?.[otherId]
      : null;

    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity
            onPress={() => setSelectedConversationId(null)}
            style={styles.chatBackButton}
          >
            <FontAwesome name="chevron-left" size={20} color="#2E1759" />
          </TouchableOpacity>

          <View style={styles.chatHeaderCenter}>
            <Text style={styles.chatHeaderTitle}>
              {otherUser?.username ?? "Unknown User"}
            </Text>
            <Text style={styles.chatHeaderSubtitle}>Active now</Text>
          </View>

          <TouchableOpacity style={styles.chatInfoButton}>
            <FontAwesome name="info-circle" size={22} color="#2E1759" />
          </TouchableOpacity>
        </View>

        {/* Chat Body */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isMe = item.senderId === user?.uid;
              return (
                <View
                  style={[
                    bubbleStyles.container,
                    isMe
                      ? bubbleStyles.currentUserContainer
                      : bubbleStyles.otherUserContainer,
                  ]}
                >
                  <View
                    style={[
                      bubbleStyles.bubble,
                      isMe
                        ? bubbleStyles.currentUserBubble
                        : bubbleStyles.otherUserBubble,
                    ]}
                  >
                    <Text
                      style={[
                        bubbleStyles.messageText,
                        isMe
                          ? bubbleStyles.currentUserText
                          : bubbleStyles.otherUserText,
                      ]}
                    >
                      {item.text}
                    </Text>
                  </View>

                  <Text style={bubbleStyles.timestamp}>
                    {item.timestamp?.toDate
                      ? item.timestamp.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </Text>
                </View>
              );
            }}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
          />

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <FontAwesome name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  /* ==================================================================== */
  /* ===================== CONVERSATION LIST VIEW ======================= */
  /* ==================================================================== */

  const filtered = conversations.filter((c) => {
    const otherId = c.participants.find((p) => p !== user?.uid);
    const username = c.participantData?.[otherId]?.username || "";
    return username.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome
          name="search"
          size={16}
          color="#8E8E93"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Conversation List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const otherId = item.participants.find((p) => p !== user?.uid);
          const u = item.participantData?.[otherId];

          return (
            <TouchableOpacity
              style={styles.conversationCard}
              onPress={() => setSelectedConversationId(item.id)}
            >
              <Text style={styles.conversationName}>
                {u?.username ?? "Unknown User"}
              </Text>
              <Text style={styles.conversationLast}>{item.lastMessage}</Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

/* --------------------------- STYLES --------------------------- */

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#E9E9EB",
    margin: 16,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  conversationCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  conversationName: {
    fontSize: 17,
    fontWeight: "600",
  },
  conversationLast: {
    marginTop: 4,
    color: "#8E8E93",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "#fff",
  },
  chatBackButton: { padding: 4 },
  chatHeaderCenter: { flex: 1, alignItems: "center" },
  chatHeaderTitle: { fontSize: 17, fontWeight: "600" },
  chatHeaderSubtitle: { fontSize: 13, color: "#34C759" },
  chatInfoButton: { padding: 4 },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: "#2E1759",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#C7C7CC",
  },
  messageList: {
    paddingVertical: 12,
  },
};

const bubbleStyles = {
  container: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    marginVertical: 6,
  },
  currentUserContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  otherUserContainer: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  currentUserBubble: { backgroundColor: "#2E1759" },
  otherUserBubble: { backgroundColor: "#E9E9EB" },
  messageText: { fontSize: 16 },
  currentUserText: { color: "#fff" },
  otherUserText: { color: "#000" },
  timestamp: {
    marginTop: 2,
    fontSize: 12,
    color: "#8E8E93",
  },
};
