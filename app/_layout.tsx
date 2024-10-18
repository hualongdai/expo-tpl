import { Stack, useRouter } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/supabase";
import { RootSiblingParent } from "react-native-root-siblings";
import * as SplashScreen from "expo-splash-screen"; 
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    getCurrentUser().then((user) => {
      if (isMounted) {
        setIsLoading(false);
        if (user) {
          router.push("/(tabs)");
        } else {
          router.push("/login");
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <RootSiblingParent>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </RootSiblingParent>
  );
}
