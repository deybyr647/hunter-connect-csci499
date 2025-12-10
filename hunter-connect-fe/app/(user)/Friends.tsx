import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getUsersByUIDs } from "@/components/api/Users/UsersBatch";
import { acceptFriendRequest } from "@/components/api/friends/acceptFriendRequest";
import { declineFriendRequest } from "@/components/api/friends/declineFriendRequest";
import { getFriendRequests } from "@/components/api/friends/getFriendRequests";
import { getFriends } from "@/components/api/friends/getFriends";
import { removeFriend } from "@/components/api/friends/removeFriend";
import { searchUsers } from "@/components/api/friends/searchUsers";
import { sendFriendRequest } from "@/components/api/friends/sendFriendRequests";
import { auth, db } from "@/components/api/Firebase/firebaseConfig";

export default function FriendsScreen() {
  const [tab, setTab] = useState<"friends" | "requests" | "search">("friends");

  const [friends, setFriends] = useState<any[]>([]);
  const [incoming, setIncoming] = useState<any[]>([]);
  const [incomingCount, setIncomingCount] = useState(0);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const uid = auth.currentUser?.uid;

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    const res = await searchUsers(searchTerm.trim());
    setResults(res.filter((u) => u.uid !== uid));
  };

  useEffect(() => {
    if (!uid) return;
    loadData();
  }, [uid]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.data();
      const incoming = data?.incomingRequests ?? [];
      setIncomingCount(incoming.length);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (tab === "search" && searchTerm.trim().length > 0) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 300); // wait 300ms after user stops typing

    return () => clearTimeout(delay);
  }, [searchTerm, tab]);

  const loadData = async () => {
    const friendsUIDs = await getFriends(uid!);
    const requests = await getFriendRequests(uid!);

    const friendProfiles = await getUsersByUIDs(friendsUIDs);
    const incomingProfiles = await getUsersByUIDs(requests.incoming);
    const outgoingProfiles = await getUsersByUIDs(requests.outgoing);

    setFriends(friendProfiles);
    setIncoming(incomingProfiles);
    setOutgoing(outgoingProfiles);
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
            style={[styles.tab, tab === key && styles.activeTab]}
          >
            <View style={{ position: "relative", alignItems: "center" }}>
              <Text
                style={[styles.tabText, tab === key && styles.activeTabText]}
              >
                {key === "friends"
                  ? "Friends"
                  : key === "requests"
                    ? "Requests"
                    : "Search"}
              </Text>

              {/* 🔴 Badge Only for Requests Tab */}
              {key === "requests" && incomingCount > 0 && (
                <View style={styles.requestDot} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* FRIENDS TAB */}
      {tab === "friends" && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Your Friends</Text>

          {friends.length === 0 ? (
            <Text style={styles.emptyText}>
              You don't have any friends yet 😔
            </Text>
          ) : (
            friends.map((friend) => (
              <View key={friend.uid} style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{friend.fullName}</Text>
                  <Text style={styles.cardEmail}>@{friend.username}</Text>
                </View>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={async () => {
                    await removeFriend(uid!, friend.uid);
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
              <View key={req.uid} style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{req.fullName}</Text>
                  <Text style={styles.cardEmail}>@{req.username}</Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={async () => {
                      await acceptFriendRequest(uid!, req.uid);
                      loadData();
                    }}
                  >
                    <Text style={styles.acceptText}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.declineBtn}
                    onPress={async () => {
                      await declineFriendRequest(uid!, req.uid);
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
              <View key={req.uid} style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{req.fullName}</Text>
                  <Text style={styles.cardEmail}>@{req.username}</Text>
                </View>
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
            placeholder="Search by username"
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.input}
            autoCapitalize="none"
          />

          {results.length === 0 && searchTerm.trim().length > 0 && (
            <Text style={{ color: "gray", marginTop: 10 }}>
              No users found…
            </Text>
          )}

          {results.map((user) => {
            const isFriend = friends.some((f) => f.uid === user.uid);
            const isOutgoing = outgoing.some((o) => o.uid === user.uid);
            const isIncoming = incoming.some((i) => i.uid === user.uid);

            let buttonLabel = "Send Request";
            let buttonStyle = styles.addBtn;
            let textStyle = styles.addBtnText;

            if (isFriend) {
              buttonLabel = "Friends ✓";
              buttonStyle = styles.tagGreen;
              textStyle = styles.tagGreenText;
            } else if (isOutgoing) {
              buttonLabel = "Pending…";
              buttonStyle = styles.pendingBtn;
              textStyle = styles.pendingBtnText;
            } else if (isIncoming) {
              buttonLabel = "Respond";
              buttonStyle = styles.pendingBtn;
              textStyle = styles.pendingBtnText;
            }

            return (
              <View key={user.uid} style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{user.fullName}</Text>
                  <Text style={styles.cardEmail}>@{user.username}</Text>
                </View>

                <TouchableOpacity
                  disabled={isFriend || isOutgoing}
                  style={buttonStyle}
                  onPress={async () => {
                    if (isIncoming) {
                      // Redirect to requests tab
                      setTab("requests");
                      return;
                    }

                    if (isFriend || isOutgoing) {
                      // Do nothing
                      return;
                    }

                    // Default behavior → Send friend request
                    await sendFriendRequest(uid!, user.uid);
                    setOutgoing((prev) => [...prev, user]);
                    loadData();
                  }}
                >
                  <Text style={textStyle}>{buttonLabel}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },

  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  activeTab: {
    backgroundColor: "#EFE9FF",
  },

  tabText: {
    color: "#444",
    fontSize: 15,
    fontWeight: "600",
  },

  activeTabText: {
    color: "#5A31F4",
    fontWeight: "500",
  },

  section: {
    padding: 20,
  },

  sectionHeader: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1A1A1A",
  },

  emptyText: {
    color: "#777",
    fontStyle: "italic",
    marginTop: 6,
  },

  /* Cards */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  cardEmail: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },

  pendingBtn: {
    backgroundColor: "#EFE9FF", // soft lavender
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  pendingBtnText: {
    color: "#6B4CF6",
    fontWeight: "600",
    fontSize: 14,
    fontStyle: "italic",
  },

  tagGreen: {
    backgroundColor: "#E8F9EF",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  tagGreenText: {
    color: "#0F6F3C",
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "italic",
  },

  actionBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#5A31F4",
  },

  actionText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  removeBtn: {
    backgroundColor: "#E8E0FF",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  removeBtnText: {
    color: "#5A31F4",
    fontWeight: "600",
  },

  acceptBtn: {
    backgroundColor: "#EFE9FF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20, // pill shape
  },

  acceptText: {
    color: "#5A31F4",
    fontWeight: "600",
    fontSize: 14,
  },

  declineBtn: {
    backgroundColor: "#FFE8EE",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  declineText: {
    color: "#E44860",
    fontWeight: "600",
    fontSize: 14,
  },

  pendingText: {
    color: "#5A31F4",
    fontWeight: "600",
    fontStyle: "italic",
  },

  /* Search Input */
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#FFF",
    marginBottom: 14,
  },

  addBtn: {
    backgroundColor: "#5A31F4",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  addBtnText: {
    color: "#FFF",
    fontWeight: "600",
  },

  disabledBtn: {
    backgroundColor: "#C7B7FF",
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    flexShrink: 1,
  },

  requestDot: {
    position: "absolute",
    top: -4,
    right: -12,
    width: 8,
    height: 8,
    backgroundColor: "#5A31F4", // Hunter Purple
    borderRadius: 50,

    shadowColor: "#5A31F4",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
});
