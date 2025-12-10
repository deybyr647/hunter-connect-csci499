import { AuthProvider, useAuth } from "@/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
// Added hooks
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

import TopHeader from "@/components/TopHeader/TopHeader";
import { setupPresence } from "@/components/api/util/presence";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Handle Protected Routes
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Not logged in -> Redirect to login
      router.replace("/(auth)");
    } else if (user && inAuthGroup) {
      // Logged in -> Redirect to home
      router.replace("/(tabs)/Landing");
      // Setup presence only when user is confirmed logged in
      setupPresence();
    }
  }, [user, loading, segments]);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5A31F4" />
      </View>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(tabs)"
          options={{ header: () => <TopHeader />, headerShown: true }}
        />
        <Stack.Screen name="(user)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(messages)"
          options={{
            header: () => <TopHeader />,
            headerShown: true,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Wrap the navigation logic with the Auth Provider
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
