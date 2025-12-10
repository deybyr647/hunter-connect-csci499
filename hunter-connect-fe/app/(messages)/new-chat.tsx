import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, FlatList, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { searchUsers } from "@/components/api/friends/searchUsers";
import { createConversationIfAbsent } from "@/components/api/messages/createConversation";
import { auth } from "@/components/api/util/firebaseConfig";

export default function NewChatScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (!text.trim()) return setResults([]);

    const users = await searchUsers(text);
    setResults(users.filter((u) => u.uid !== user?.uid));
  };

  const startChat = async (otherId: string) => {
    if (!user) return;

    const convoId = await createConversationIfAbsent(user.uid, otherId);
    router.replace(`/Messages?id=${convoId}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F2F7" }}>
      
        {/* HEADER */}
        <View
        style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 14,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        }}
        >
        <TouchableOpacity
            style={{ width: 60 }}
            onPress={() => router.back()}
        >
            <Ionicons name="chevron-back" size={24} color="#5A31F4" />
        </TouchableOpacity>

        <Text style={{ fontSize: 20, fontWeight: "700", color: "#3C2E7E" }}>
            New Message
        </Text>

        {/* Spacer so the title stays centered */}
        <View style={{ width: 60 }} />
        </View>

      {/* SEARCH BAR */}
      <View style={{ padding: 16 }}>
        <TextInput
          placeholder="Search users..."
          value={query}
          onChangeText={handleSearch}
          style={{
            backgroundColor: "#EFE9FF",
            padding: 12,
            borderRadius: 10,
          }}
        />
      </View>

      {/* USER RESULTS */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => startChat(item.uid)}
            style={{
              backgroundColor: "#fff",
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#E5E5EA",
            }}
          >
            <Text style={{ fontSize: 16, color: "#000" }}>@{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
