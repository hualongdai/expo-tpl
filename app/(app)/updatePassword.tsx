import React, { useState } from "react";
import { View, SafeAreaView, StyleSheet, TextInput } from "react-native";
import {
  Button,
  WhiteSpace,
  WingBlank,
  Flex,
  Text,
  Toast,
} from "@ant-design/react-native";
import { useRouter } from "expo-router";
import { updatePassword } from "@/utils/supabase";

export default function UpdatePassword() {
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (password !== password2) {
      Toast.show("两次密码不一致，请确认后重试");
      return;
    }
    setLoading(true);
    const { error } = await updatePassword(password2);
    console.log('updatePassword', error);
    if (!error) {
      Toast.show("修改密码成功");
      router.replace("/(tabs)");
    } else {
      Toast.show("重置密码失败");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <WingBlank>
        <View style={styles.blank} />
        <TextInput
          style={styles.input}
          placeholder="新密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <WhiteSpace size="sm" />
        <TextInput
          style={styles.input}
          placeholder="再次输入新密码"
          value={password2}
          onChangeText={setPassword2}
          secureTextEntry
        />
        <WhiteSpace size="xl" />
        <Button disabled={loading} type="primary" onPress={submit}>
          {loading ? "提交中..." : "提交"}
        </Button>
      </WingBlank>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  blank: {
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
  input: {
    height: 40,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
});
