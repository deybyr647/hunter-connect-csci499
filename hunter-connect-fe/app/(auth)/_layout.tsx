import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
        screenOptions={{
            headerShown: false,
        }
            }
    >
      <Stack.Screen
        name="index"
        options={{
            title: "Welcome",
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