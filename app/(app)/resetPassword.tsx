import React, { useState } from "react";
import { View, StyleSheet, TextInput, Keyboard } from "react-native";
import {
  Button,
  WhiteSpace,
  WingBlank,
  Flex,
  Text,
  Toast,
} from "@ant-design/react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getResetEmail } from "@/utils/supabase";

export default function ResetPassword() {
  const params = useLocalSearchParams<{ email: string }>();
  const [email, setEmail] = useState(params.email || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendEmail = async () => {
    Keyboard.dismiss();
    setLoading(true);
    const { error } = await getResetEmail(email, 'updatePassword');
    if (!error) {
      Toast.show("重置密码邮件已发送");
    } else {
      Toast.show("发送失败，请检查邮箱地址");
    }
    setLoading(false);
    
  };

  return (
    <View style={styles.container}>
      <WingBlank>
        <View style={styles.blank} />
        <Flex direction="column" align="start">
          <Text style={styles.title}>忘记密码？</Text>
          <Text style={styles.subtitle}>
            请在下面输入邮箱地址以接收重置密码的邮件
          </Text>
          <WhiteSpace size="xl" />
        </Flex>
        <TextInput
          style={styles.input}
          placeholder="邮箱地址"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <WhiteSpace size="xl" />
        <Button disabled={loading} type="primary" onPress={sendEmail}>
          {loading ? "发送中..." : "发送"}
        </Button>
      </WingBlank>
    </View>
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
