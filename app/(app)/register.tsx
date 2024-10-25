import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import {
  WingBlank,
  Button,
  Flex,
  Toast,
} from "@ant-design/react-native";
import { Link, useRouter } from "expo-router";
import { signUpByEmail } from "@/utils/supabase";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const { error } = await signUpByEmail(email, password);
    if (error) {
      Toast.show(error.message);
    } else {
      Toast.show("注册成功");
      router.replace("/login");
    }
  };

  return (
    <View style={styles.container}>
      <WingBlank>
        <Flex direction="column" align="center">
          <Text style={styles.title}>注册</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
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
        </Flex>
        <Button type="primary" onPress={handleRegister}>注册</Button>
        <Link href="/login" replace style={styles.link}>
          已有账户? 点击登录
        </Link>
      </WingBlank>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  link: {
    marginTop: 20,
    color: "#007AFF",
    alignSelf: 'flex-end'
  },
});
