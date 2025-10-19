import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="welcome"
        options={{
            title: "Welcome",
            headerShown: false, // ✅ hides the "(auth)/welcome" bar
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Sign In", // You can still give other screens custom titles
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Sign Up",
        }}
      />
    </Stack>
  );
}