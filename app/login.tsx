import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Toast from "react-native-root-toast";
import { Link, useRouter } from "expo-router";
import { signInByEmail } from "@/utils/supabase";
import GoogleSignIn from '@/utils/auth/google.auth'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLoginSuccess  = () => {
    router.replace('/(tabs)');
  }

  const handleLogin = async () => {
    const { error } = await signInByEmail(email, password);
    if (error) {
      Toast.show(error.message);
    } else {
      handleLoginSuccess();
    }
  };

  

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Link href="/register" replace style={styles.link}>
          Don't have an account? Register here
        </Link>
      </View>
      <View style={styles.fastLoginContainer}>
        <GoogleSignIn loginSuccessCallback={handleLoginSuccess} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loginContainer: {
    padding: 20,
    alignSelf: "stretch",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  button: {
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
  link: {
    marginTop: 20,
    color: "#007AFF",
  },

  fastLoginContainer: {
    alignSelf: "stretch",
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
