import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, FlatList, Text } from "react-native";
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
    setResults(users.filter(u => u.uid !== user?.uid));
  };

  const startChat = async (otherId: string) => {
    if (!user) return;

    const convoId = await createConversationIfAbsent(user.uid, otherId);
    router.replace(`/Messages?id=${convoId}`);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Search users..."
        value={query}
        onChangeText={handleSearch}
        style={{
          backgroundColor: "#EEE",
          padding: 12,
          borderRadius: 10,
          marginBottom: 16,
        }}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => startChat(item.uid)}
            style={{
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: "#DDD",
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
