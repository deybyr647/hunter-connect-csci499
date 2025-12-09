import { Stack } from "expo-router";

import TopHeader from "@/components/TopHeader/TopHeader";

export default function MessagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="messages"
        options={{
          title: "Messages",
          header: () => <TopHeader />,
          headerShown: true,
        }}
      />
    </Stack>
  );
}
