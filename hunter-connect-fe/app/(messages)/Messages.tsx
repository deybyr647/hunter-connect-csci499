import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Text as RNText,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "@/components/util/Themed";
import { listenToConversations } from "@/components/api/messages/getConversations";
import { listenToMessages } from "@/components/api/messages/getMessages";
import { sendMessage } from "@/components/api/messages/sendMessage";
import { Conversation, Message } from "@/components/api/messages/types";
import { auth, db } from "@/components/api/Firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

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
  const [inputHeight, setInputHeight] = useState(40); // default collapsed height

  const flatListRef = useRef<FlatList>(null);
  const { id } = useLocalSearchParams();
  useEffect(() => {
    if (id) setSelectedConversationId(String(id));
  }, [id]);
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

  // If URL has an id and we haven't loaded the conversation yet, show loading
  if (id && !selectedConversation) {
    return (
      <SafeAreaView style={styles.container}>
        <RNText style={{ marginTop: 20, textAlign: "center", color: "#000" }}>
          Loading chat...
        </RNText>
      </SafeAreaView>
    );
  }

  /* ==================================================================== */
  /* ============================ CHAT VIEW ============================== */
  /* ==================================================================== */

  const resetUnread = async (conversationId: string) => {
    if (!user) return;

    const convoRef = doc(db, "conversations", conversationId);

    try {
      await updateDoc(convoRef, {
        [`unread.${user.uid}`]: 0
      });
    } catch (e) {
      console.log("Failed to reset unread:", e);
    }
  };


  if (selectedConversation) {
    const otherId = selectedConversation.participants.find(
      (p) => p !== user?.uid
    );
    const otherUser = otherId
      ? selectedConversation.participantData?.[otherId]
      : null;
    return (

      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderBottomColor: "#E5E5EA",
          }}
        >
          <TouchableOpacity
            style={{ width: 60 }}
            onPress={() => {
              setSelectedConversationId(null);
              router.push("/Messages");
            }}
          >
            <Ionicons name="chevron-back" size={26} color="#5A31F4" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.chatHeaderTitle}>
              @{otherUser?.username}
            </Text>

            {/* OPTIONAL — subtle active status line */}
            <Text style={styles.chatHeaderSubtitle}>
              {otherUser?.status?.state === "online" ? (
                "Active now"
              ) : otherUser?.status?.last_changed ? (
                `Last seen ${new Date(otherUser.status.last_changed).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              ) : (
                "Last seen recently"
              )}
            </Text>
          </View>

          <View style={{ width: 60 }} />
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
              const displayName = isMe ? "You" : otherUser?.username ?? "User";

              return (
                <View
                  style={[
                    bubbleStyles.container,
                    isMe
                      ? bubbleStyles.currentUserContainer
                      : bubbleStyles.otherUserContainer,
                  ]}
                >
                  {/* Username + Timestamp Row */}
                  <View style={bubbleStyles.headerRow}>
                    <Text
                      style={[
                        bubbleStyles.nameText,
                        isMe ? bubbleStyles.currentUserName : bubbleStyles.otherUserName,
                      ]}
                    >
                      {displayName}
                    </Text>

                    <Text style={bubbleStyles.headerTimestamp}>
                      {item.timestamp?.toDate
                        ? item.timestamp.toDate().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </Text>
                  </View>

                  {/* Bubble */}
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
                </View>
              );
            }}

            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
          />

          {/* Message Input */}

          <View style={styles.inputContainer}>
            <TextInput
              multiline
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              style={[styles.input, { height: inputHeight }]}
              textAlignVertical="top"
              blurOnSubmit={false}
              returnKeyType="send"
              underlineColorAndroid="transparent"
              selectionColor="#6B4CF6"

              onContentSizeChange={(e) => {
                const newHeight = e.nativeEvent.contentSize.height;
                setInputHeight(Math.min(newHeight, 120)); // grows but stops at maxHeight
              }}

              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key !== "Enter") return;

                const before = inputText;

                requestAnimationFrame(() => {
                  const after = inputText;
                  const newlineAdded = after.length > before.length && after.endsWith("\n");

                  if (newlineAdded) {
                    setInputText(after); // allow newline
                  } else if (inputText.trim().length > 0) {
                    handleSend();
                  }
                });
              }}
            />

            {/* SEND BUTTON */}
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
      <View style={styles.searchWrapper}>
        <FontAwesome name="search" size={16} color="#8E8E93" style={{ marginLeft: 10 }} />

        <TextInput
          style={styles.searchInput}
          placeholder="  Search messages..."
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity onPress={() => router.push("/new-chat")} style={styles.newChatIcon}>
          <FontAwesome name="commenting" size={16} color="#fff" />
        </TouchableOpacity>
      </View>


      {/* Conversation List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const otherId = item.participants.find((p) => p !== user?.uid);
          const u = item.participantData?.[otherId];
          const unread = item.unread?.[user.uid] ?? 0;
          return (
            <TouchableOpacity
              style={styles.conversationCard}
              onPress={() => {
                resetUnread(item.id);
                setSelectedConversationId(item.id);
              }}
            >
              <View style={styles.cardRow}>

                {/* Avatar */}
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarBubble}>
                    <RNText style={styles.avatarInitial}>
                      {u?.username?.[0]?.toUpperCase() ?? "?"}
                    </RNText>
                  </View>

                  {u?.status?.state === "online" && <View style={styles.onlineDot} />}
                </View>

                {/* Middle Section */}
                <View style={styles.cardMiddle}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.cardUsername}>@{u?.username}</Text>

                    <View style={styles.timestampContainer}>
                      <Text style={styles.timestampText}>
                        {item.lastMessageAt?.toDate
                          ? item.lastMessageAt.toDate().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </Text>

                      {/* NEW CLEAN DOT BADGE */}
                      {unread > 0 && <View style={styles.unreadDot} />}
                    </View>
                  </View>

                  {/* Last Message */}
                  <Text style={styles.lastMessageText} numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

/* --------------------------- STYLES --------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  conversationCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 16,

    // Shadow for depth
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  /* -------------------- AVATAR -------------------- */

  avatarContainer: {
    position: "relative",
    marginRight: 14,
  },

  avatarBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFE9FF",
    justifyContent: "center",
    alignItems: "center",
  },

  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3C2E7E",
    letterSpacing: 0.3,
    marginBottom: 2,
  },

  chatHeaderSubtitle: {
    fontSize: 12,
    color: "#6B4CF6",
    marginTop: -2,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9F9FC",
    borderTopWidth: 1,
    borderTopColor: "#E6E6EE",
  },

  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,     
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DAD7F2",
    fontSize: 16,
    textAlignVertical: "top",  
  },

  sendButton: {
    backgroundColor: "#6B4CF6",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  sendButtonDisabled: {
    backgroundColor: "#CFCDEB",
  },
  
  messageList: {
    paddingVertical: 12,
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFE9FF",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    paddingVertical: 8,
    borderRadius: 12,
    position: "relative",
  },

  newChatIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#6B4CF6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  avatarInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6B4CF6",
  },

  onlineDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#34C759",
    bottom: -2,
    right: -2,
    borderWidth: 2,
    borderColor: "#fff",
  },
  
  
/* -------------------- TEXT AREA -------------------- */

  cardMiddle: {
    flex: 1,
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardUsername: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3C2E7E",
  },

  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  timestampText: {
    fontSize: 12,
    color: "#8E8E93",
  },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6B4CF6",
  },

  lastMessageText: {
    marginTop: 4,
    fontSize: 14,
    color: "#8E8E93",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const bubbleStyles = StyleSheet.create({
  container: {
    maxWidth: "78%",
    marginVertical: 6,
    paddingHorizontal: 10,
  },

  /* Alignment Containers */
  currentUserContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  otherUserContainer: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },

  /* Base Bubble Style */
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxWidth: "100%",

    // Add slight depth
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  /* OUTGOING (You) */
  currentUserBubble: {
    backgroundColor: "#D6CCFF", // softer purple than before
    borderBottomRightRadius: 6, // chat-tail effect
  },
  currentUserText: {
    color: "#6B4CF6",
    fontSize: 16,
    lineHeight: 20,
  },

  /* INCOMING (Other Person) */
  otherUserBubble: {
    backgroundColor: "#F4F2FF",
    borderBottomLeftRadius: 6, // chat-tail effect
  },
  otherUserText: {
    color: "#3C2E7E",
    fontSize: 16,
    lineHeight: 20,
  },

  /* Timestamp */
  timestamp: {
    marginTop: 2,
    fontSize: 11,
    color: "#8E8E93",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },

  nameText: {
    fontSize: 13,
    fontWeight: "700",
  },

  currentUserName: {
    color: "#6B4CF6",
    marginRight: 6,
  },

  otherUserName: {
    color: "#3C2E7E",
    marginRight: 6,
  },

  headerTimestamp: {
    fontSize: 11,
    color: "#8E8E93",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },

});

