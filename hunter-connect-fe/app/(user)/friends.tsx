import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { auth } from "@/api/firebaseConfig";

import { getFriends } from "@/api/friends/getFriends";
import { getFriendRequests } from "@/api/friends/getFriendRequests";
import { searchUsers } from "@/api/friends/searchUsers";
import { sendFriendRequest } from "@/api/friends/sendFriendRequests";
import { acceptFriendRequest } from "@/api/friends/acceptFriendRequest";
import { declineFriendRequest } from "@/api/friends/declineFriendRequest";
import { removeFriend } from "@/api/friends/removeFriend";

export default function FriendsScreen() {
  const [tab, setTab] = useState<"friends" | "requests" | "search">("friends");

  const [friends, setFriends] = useState<any[]>([]);
  const [incoming, setIncoming] = useState<any[]>([]);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    loadData();
  }, [uid]);

  const loadData = async () => {
    const friendsList = await getFriends(uid!);
    const requests = await getFriendRequests(uid!);

    setFriends(friendsList);
    setIncoming(requests.incoming);
    setOutgoing(requests.outgoing);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    const res = await searchUsers(searchTerm.trim());
    setResults(res.filter((u) => u.uid !== uid));
  };

  const tabs = ["friends", "requests", "search"];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F7F9FC" }}>
      {/* Top Tabs */}
      <View style={styles.tabRow}>
        {tabs.map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => setTab(key as any)}
            style={[
              styles.tab,
              tab === key && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                tab === key && styles.activeTabText,
              ]}
            >
              {key === "friends"
                ? "Friends"
                : key === "requests"
                ? "Requests"
                : "Search"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FRIENDS TAB */}
      {tab === "friends" && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Your Friends</Text>

          {friends.length === 0 ? (
            <Text style={styles.emptyText}>You don't have any friends yet 😔</Text>
          ) : (
            friends.map((friend) => (
              <View key={friend} style={styles.card}>
                <Text style={styles.cardTitle}>{friend}</Text>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={async () => {
                    await removeFriend(uid!, friend);
                    loadData();
                  }}
                >
                  <Text style={styles.removeBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}

      {/* REQUESTS TAB */}
      {tab === "requests" && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Incoming Requests</Text>

          {incoming.length === 0 ? (
            <Text style={styles.emptyText}>No incoming requests.</Text>
          ) : (
            incoming.map((req) => (
              <View key={req} style={styles.card}>
                <Text style={styles.cardTitle}>{req}</Text>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={async () => {
                      await acceptFriendRequest(uid!, req);
                      loadData();
                    }}
                  >
                    <Text style={styles.acceptText}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.declineBtn}
                    onPress={async () => {
                      await declineFriendRequest(uid!, req);
                      loadData();
                    }}
                  >
                    <Text style={styles.declineText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <Text style={[styles.sectionHeader, { marginTop: 20 }]}>
            Outgoing Requests
          </Text>

          {outgoing.length === 0 ? (
            <Text style={styles.emptyText}>No pending outgoing requests.</Text>
          ) : (
            outgoing.map((req) => (
              <View key={req} style={styles.card}>
                <Text style={styles.cardTitle}>{req}</Text>
                <Text style={styles.pendingText}>Pending…</Text>
              </View>
            ))
          )}
        </View>
      )}

      {/* SEARCH TAB */}
      {tab === "search" && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Search Users</Text>

          <TextInput
            placeholder="Search by email"
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.input}
          />

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>

          {results.map((user) => (
            <View key={user.uid} style={styles.card}>
              <Text style={styles.cardTitle}>{user.email}</Text>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={async () => {
                  await sendFriendRequest(uid!, user.uid);
                  loadData();
                }}
              >
                <Text style={styles.addBtnText}>Add Friend</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#E6E6E6",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#4B7BEC",
  },
  tabText: {
    color: "#555",
    fontSize: 15,
    fontWeight: "600",
  },
  activeTabText: {
    color: "white",
  },
  section: {
    padding: 18,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptyText: {
    color: "gray",
    fontStyle: "italic",
    marginTop: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f3f3f3",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  removeBtn: {
    backgroundColor: "#eb3b5a",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  removeBtnText: {
    color: "white",
    fontWeight: "600",
  },
  acceptBtn: {
    backgroundColor: "#20bf6b",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  acceptText: { color: "white", fontWeight: "600" },
  declineBtn: {
    backgroundColor: "#eb3b5a",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  declineText: { color: "white", fontWeight: "600" },
  pendingText: {
    color: "gray",
    fontStyle: "italic",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  searchBtn: {
    backgroundColor: "#4B7BEC",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  searchText: { color: "white", textAlign: "center", fontWeight: "600" },
  addBtn: {
    backgroundColor: "#3867d6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addBtnText: { color: "white", fontWeight: "600" },
});
