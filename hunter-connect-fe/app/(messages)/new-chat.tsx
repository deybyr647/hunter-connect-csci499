import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth } from "@/components/api/Firebase/firebaseConfig";
import { searchUsers } from "@/components/api/friends/searchUsers";
import { createConversationIfAbsent } from "@/components/api/messages/createConversation";

export default function NewChatScreen() {
  const router = useRouter();
  const { user } = useAuth();

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
          onPress={() => router.push("/Messages")}
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
            <Text style={{ fontSize: 16, color: "#000" }}>
              @{item.username}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
