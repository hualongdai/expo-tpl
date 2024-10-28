import { Stack, useRouter } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/supabase";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserProvider } from "@/hooks/user";
import { Provider } from "@ant-design/react-native";
import { User} from '@supabase/supabase-js'

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        console.log("getCurrentUser", user);
        if (user) {
          router.replace("/(tabs)");
        } else {
          router.replace("/login");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  

  return (
    <Provider
      theme={{ brand_primary: "#3274F9", primary_button_fill: "#3274F9" }}
    >
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <UserProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="login"
              options={{ headerShown: false, title: "登录" }}
            />
            <Stack.Screen
              name="register"
              options={{ headerShown: false, title: "注册" }}
            />
            <Stack.Screen
              name="resetPassword"
              options={{ headerShown: false, title: "忘记密码" }}
            />
            <Stack.Screen
              name="updatePassword"
              options={{ title: "重置密码" }}
            />
          </Stack>
        </UserProvider>
      </ThemeProvider>
    </Provider>
  );
}
