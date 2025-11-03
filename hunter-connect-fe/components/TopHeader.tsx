import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExternalLink } from "./ExternalLink";
import { MonoText } from "./StyledText";
import { Text, View } from "./Themed";

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2",
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
  },
  rightSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

const TopHeader = () => {
  const router = useRouter();

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <FontAwesome name={"graduation-cap"} size={24} color="black" />
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.title}>Hunter Connect</Text>
        </View>

        <View style={styles.rightSection}>
          <FontAwesome name={"bell-o"} size={24} color="black" />
          <FontAwesome name={"comment-o"} size={24} color="black" />
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <FontAwesome name={"user-circle-o"} size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TopHeader;
