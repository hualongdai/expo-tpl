import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { signOut, getCurrentUser } from "@/utils/supabase";
import { User } from '@supabase/supabase-js'
import { useColorScheme } from "@/hooks/useColorScheme";



export default function Mine() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then(user => {
      setUser(user);
    });
  }, []);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      setUser(null);
      router.replace("/login");
    }
  };

  if (!user) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#f5f5f5",
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 20,
    },
    text: {
      color: colorScheme === "light" ? "#000000" : "#FFFFFF",
      fontSize: 18,
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    button: {
      width: "100%",
      height: 40,
      backgroundColor: "#007AFF",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <>
        <Image
          source={{
            uri:
              user.user_metadata.avatar_url ||
              "https://via.placeholder.com/100",
          }}
          style={styles.avatar}
        />
        <Text style={styles.text}>Welcome, {user.email}</Text>
      </>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}


