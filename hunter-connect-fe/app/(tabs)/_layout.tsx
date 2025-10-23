import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarPosition: "top",
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarIconStyle: {
          display: "none",
          marginBottom: -2,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          textAlignVertical: "center",
          marginBottom: 0,
        },
        
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Landing"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="Discover"
        options={{
          title: "Discover",
        }}
      />

      <Tabs.Screen
        name="Events"
        options={{
          title: "Events",
        }}
      />
    </Tabs>
  );
}
