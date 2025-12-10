import { Stack } from "expo-router";

import TopHeader from "@/components/TopHeader/TopHeader";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="Profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Events"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Posts"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Tags"
        options={{
          headerShown: false,
        }}
      />

      {/* NEW SCREENS FOR FRIENDS SYSTEM */}
      <Stack.Screen
        name="Friends"
        options={{
          header: () => <TopHeader />,
        }}
      />
      <Stack.Screen
        name="friendRequests"
        options={{
          header: () => <TopHeader />,
        }}
      />
      <Stack.Screen
        name="searchUsers"
        options={{
          header: () => <TopHeader />,
        }}
      />
    </Stack>
  );
}
