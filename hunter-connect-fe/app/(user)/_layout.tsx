import { Stack } from "expo-router";
import TopHeader from "@/components/TopHeader";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="myEvents"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="myPosts"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="tags"
        options={{
          headerShown: false,
        }}
      />

      {/* NEW SCREENS FOR FRIENDS SYSTEM */}
      <Stack.Screen
        name="friends"
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
