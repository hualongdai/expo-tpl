import { Stack, useRouter } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getCurrentUserBySession, getContactByUserId } from "@/utils/supabase";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useUser } from "@/hooks/user";
import { Provider as AntdProvider } from "@ant-design/react-native";
import { ChatContextProvider } from "@/hooks/chat";

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
    const initSessionInfo = async () => {
      try {
        const user = await getCurrentUserBySession();
        if (user) {
          const { data, error } = await getContactByUserId(user.id);
          if (error) {
            setUser(user.user_metadata);
          } else {
            console.log("user.user_metadata", user.user_metadata);
            setUser({ ...user.user_metadata, ...data });
          }
          router.replace("/(tabs)");
        } else {
          router.replace("/login");
        }
      } catch (error) {
        router.replace("/login");
      }
    }
    initSessionInfo();
  }, []);


  return (
    <AntdProvider
      theme={{ brand_primary: "#3274F9", primary_button_fill: "#3274F9" }}
    >
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ChatContextProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="chat" options={{ title: "聊天" }} />
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
            <Stack.Screen name="updatePassword" options={{ title: "重置密码" }} />
          </Stack>
        </ChatContextProvider>
      </ThemeProvider>
    </AntdProvider>
  );
}
