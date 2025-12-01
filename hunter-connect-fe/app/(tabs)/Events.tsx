/* import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function EventScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/Events.tsx" />
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
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";

const dummyEvents = [
  {
    id: "1",
    name: "Girls Who Code Python Workshop",
    date: "Nov 20, 2025",
    time: "3:00 PM - 5:00 PM",
    location: "Hunter College, Room 204",
  },
  {
    id: "2",
    name: "ACM Club Meetup",
    date: "Nov 22, 2025",
    time: "4:00 PM - 6:00 PM",
    location: "Hunter College, Room N702",
  },
  {
    id: "3",
    name: "Hunter Career Fair Prep",
    date: "Nov 25, 2025",
    time: "1:00 PM - 3:00 PM",
    location: "Hunter College, Career Center",
  },
  {
    id: "4",
    name: "Google Networking Event",
    date: "Nov 28, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Hunter College, Cafeteria",
  },
];

export default function Events() {
  const handleRegister = (eventName: string) => {
    // This can later link to a registration form or API
    alert(`Registered for ${eventName}! 🎉`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>

      <FlatList
        data={dummyEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventInfo}>
              📅 {item.date} | ⏰ {item.time}
            </Text>
            <Text style={styles.eventInfo}>📍 {item.location}</Text>

            <Pressable
              style={styles.registerBtn}
              onPress={() => handleRegister(item.name)}
            >
              <Text style={styles.registerText}>Register</Text>
            </Pressable>
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
  eventCard: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  eventInfo: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
  },
  registerBtn: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  registerText: {
    color: "#fff",
    fontWeight: "600",
  },
});
