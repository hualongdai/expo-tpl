import { Tabs } from "expo-router";
import React from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ChatContextProvider } from "@/hooks/chat";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ChatContextProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "消息",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={
                  focused
                    ? "chatbubble-ellipses"
                    : "chatbubble-ellipses-outline"
                }
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="contact"
          options={{
            title: "通讯录",
            headerShown: true,
            headerStyle: {
              backgroundColor: "transparent",
            },
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "people-sharp" : "people-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="mine"
          options={{
            title: "我的",
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome5
                name={focused ? "user-alt" : "user"}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </ChatContextProvider>
  );
}
