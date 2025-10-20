import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExternalLink } from "./ExternalLink";
import { MonoText } from "./StyledText";
import { Text, View } from "./Themed";

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

const TopHeader = () => {
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <FontAwesome name={"graduation-cap"} size={24} color="black" />
        <Text style={styles.title}>Hunter Connect</Text>
        <FontAwesome name={"bell-o"} size={24} color="black" />
        <FontAwesome name={"comment-o"} size={24} color="black" />
        <FontAwesome name={"user-circle-o"} size={24} color="black" />
      </View>
    </SafeAreaView>
  );
};

export default TopHeader;
