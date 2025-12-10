import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { setupPresence } from "@/components/api/util/presence";
import { auth } from "@/components/api/util/firebaseConfig";
import TopHeader from "@/components/TopHeader/TopHeader";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
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

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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

  useEffect(() => {
    let initialized = false;

    const unsub = auth.onAuthStateChanged((user) => {
      if (user && !initialized) {
        initialized = true;   // prevent multiple listeners
        setupPresence();
      }
    });

    return unsub;
  }, []);


  return <RootLayoutNav />;
}
