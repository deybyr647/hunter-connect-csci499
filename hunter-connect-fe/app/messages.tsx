import React, { useState, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
  senderName?: string;
}

interface ConversationCardProps {
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  avatarUrl?: string;
  isOnline?: boolean;
  onPress: () => void;
}

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isCurrentUser: boolean;
  senderName?: string;
}

function ConversationCard({
  name,
  lastMessage,
  timestamp,
  unreadCount = 0,
  avatarUrl,
  isOnline = false,
  onPress,
}: ConversationCardProps) {
  return (
    <TouchableOpacity
      style={conversationStyles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={conversationStyles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={conversationStyles.avatar} />
        ) : (
          <View style={conversationStyles.avatarPlaceholder}>
            <FontAwesome name="user" size={24} color="#8E8E93" />
          </View>
        )}
        {isOnline && <View style={conversationStyles.onlineIndicator} />}
      </View>

      <View style={conversationStyles.contentContainer}>
        <View style={conversationStyles.headerRow}>
          <Text style={conversationStyles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={conversationStyles.timestamp}>{timestamp}</Text>
        </View>

        <View style={conversationStyles.messageRow}>
          <Text
            style={[
              conversationStyles.lastMessage,
              unreadCount > 0 && conversationStyles.unreadMessage,
            ]}
            numberOfLines={2}
          >
            {lastMessage}
          </Text>
          {unreadCount > 0 && (
            <View style={conversationStyles.unreadBadge}>
              <Text style={conversationStyles.unreadCount}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MessageBubble({
  message,
  timestamp,
  isCurrentUser,
  senderName,
}: MessageBubbleProps) {
  return (
    <View
      style={[
        bubbleStyles.container,
        isCurrentUser
          ? bubbleStyles.currentUserContainer
          : bubbleStyles.otherUserContainer,
      ]}
    >
      {!isCurrentUser && senderName && (
        <Text style={bubbleStyles.senderName}>{senderName}</Text>
      )}
      <View
        style={[
          bubbleStyles.bubble,
          isCurrentUser
            ? bubbleStyles.currentUserBubble
            : bubbleStyles.otherUserBubble,
        ]}
      >
        <Text
          style={[
            bubbleStyles.messageText,
            isCurrentUser
              ? bubbleStyles.currentUserText
              : bubbleStyles.otherUserText,
          ]}
        >
          {message}
        </Text>
      </View>
      <Text style={bubbleStyles.timestamp}>{timestamp}</Text>
    </View>
  );
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    lastMessage: "See you at the study group tomorrow!",
    timestamp: "2m ago",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "CS Study Group",
    lastMessage: "John Doe: I'll be there!",
    timestamp: "15m ago",
    unreadCount: 0,
    isOnline: false,
  },
];

const MOCK_MESSAGES: { [key: string]: Message[] } = {
  "1": [
    {
      id: "1",
      text: "Hey! How's the Computer Science assignment going?",
      timestamp: "10:30 AM",
      isCurrentUser: false,
      senderName: "Sarah Johnson",
    },
    {
      id: "2",
      text: "Going well! Just finished the algorithm part.",
      timestamp: "10:32 AM",
      isCurrentUser: true,
    },
    {
      id: "3",
      text: "That's great! I'm stuck on problem 3. Any tips?",
      timestamp: "10:33 AM",
      isCurrentUser: false,
      senderName: "Sarah Johnson",
    },
    {
      id: "4",
      text: "Sure! Try using a hashmap for that one.",
      timestamp: "10:35 AM",
      isCurrentUser: true,
    },
    {
      id: "5",
      text: "It makes the lookup much faster.",
      timestamp: "10:35 AM",
      isCurrentUser: true,
    },
    {
      id: "6",
      text: "Oh that makes sense! Thanks so much!",
      timestamp: "10:37 AM",
      isCurrentUser: false,
      senderName: "Sarah Johnson",
    },
    {
      id: "7",
      text: "See you at the study group tomorrow!",
      timestamp: "10:38 AM",
      isCurrentUser: false,
      senderName: "Sarah Johnson",
    },
  ],
  "2": [
    {
      id: "1",
      text: "Hey everyone! Anyone have notes from last lecture?",
      timestamp: "Yesterday 3:45 PM",
      isCurrentUser: false,
      senderName: "Mike",
    },
    {
      id: "2",
      text: "I do! I'll share them in a bit",
      timestamp: "Yesterday 3:50 PM",
      isCurrentUser: false,
      senderName: "Alex",
    },
    {
      id: "3",
      text: "Thanks Alex! Really appreciate it",
      timestamp: "Yesterday 3:52 PM",
      isCurrentUser: true,
    },
    {
      id: "4",
      text: "Don't forget we're meeting tomorrow at 2pm!",
      timestamp: "Today 9:15 AM",
      isCurrentUser: false,
      senderName: "Sarah",
    },
    {
      id: "5",
      text: "I'll be there!",
      timestamp: "Today 9:20 AM",
      isCurrentUser: true,
    },
  ],
};

export default function MessagesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] =
    useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConversationPress = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setMessages(MOCK_MESSAGES[conversationId] || []);
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
    setMessages([]);
    setInputText("");
  };

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      isCurrentUser: true,
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId,
  );

  // Chat View
  if (selectedConversationId && selectedConversation) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.chatHeader}>
          <TouchableOpacity
            onPress={handleBackToList}
            style={styles.chatBackButton}
          >
            <FontAwesome name="chevron-left" size={20} color="#2E1759" />
          </TouchableOpacity>

          <View style={styles.chatHeaderCenter}>
            <Text style={styles.chatHeaderTitle}>
              {selectedConversation.name}
            </Text>
            <Text style={styles.chatHeaderSubtitle}>Active now</Text>
          </View>

          <TouchableOpacity style={styles.chatInfoButton}>
            <FontAwesome name="info-circle" size={24} color="#2E1759" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome name="comments-o" size={64} color="#C7C7CC" />
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start the conversation!</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MessageBubble
                  message={item.text}
                  timestamp={item.timestamp}
                  isCurrentUser={item.isCurrentUser}
                  senderName={item.senderName}
                />
              )}
              contentContainerStyle={styles.messageList}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />
          )}

          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <FontAwesome name="plus-circle" size={28} color="#8E8E93" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              placeholderTextColor="#8E8E93"
              multiline
              maxLength={1000}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim().length === 0 && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={inputText.trim().length === 0}
            >
              <FontAwesome
                name="send"
                size={20}
                color={inputText.trim().length > 0 ? "#fff" : "#C7C7CC"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Conversation List View
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.searchContainer}>
        <FontAwesome
          name="search"
          size={16}
          color="#8E8E93"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8E8E93"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <FontAwesome name="times-circle" size={16} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationCard
            name={item.name}
            lastMessage={item.lastMessage}
            timestamp={item.timestamp}
            unreadCount={item.unreadCount}
            isOnline={item.isOnline}
            onPress={() => handleConversationPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="comments-o" size={64} color="#C7C7CC" />
            <Text style={styles.emptyText}>No conversations found</Text>
            <Text style={styles.emptySubtext}>
              Start a new conversation to connect with others
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const bubbleStyles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 12,
    maxWidth: "80%",
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
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 2,
  },
  currentUserBubble: {
    backgroundColor: "#2E1759",
  },
  otherUserBubble: {
    backgroundColor: "#E9E9EB",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: "#fff",
  },
  otherUserText: {
    color: "#000",
  },
  timestamp: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
  },
  senderName: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 2,
    marginLeft: 4,
    fontWeight: "600",
  },
});

const conversationStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E9E9EB",
    justifyContent: "center",
    alignItems: "center",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#34C759",
    borderWidth: 2,
    borderColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 14,
    color: "#8E8E93",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 15,
    color: "#8E8E93",
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: "#000",
    fontWeight: "500",
  },
  unreadBadge: {
    backgroundColor: "#2E1759",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9E9EB",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 15,
    color: "#C7C7CC",
    marginTop: 8,
    textAlign: "center",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  chatBackButton: {
    padding: 4,
  },
  chatHeaderCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  chatHeaderTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
  chatHeaderSubtitle: {
    fontSize: 13,
    color: "#34C759",
    marginTop: 2,
  },
  chatInfoButton: {
    padding: 4,
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  attachButton: {
    padding: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  sendButton: {
    backgroundColor: "#2E1759",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    marginBottom: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "#E9E9EB",
  },
});
