import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import {
  Button,
  WhiteSpace,
  WingBlank,
  Flex,
  Text,
  Icon,
  Toast,
} from "@ant-design/react-native";
import { useRouter } from "expo-router";
import { signInByEmail } from "@/utils/supabase";
import signInByGoogle from '@/utils/auth/google.auth'

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLoginByGoogle = () => {
    signInByGoogle({
      loginSuccessCallback: handleLoginSuccess,
    })
  }

  const handleLoginSuccess = () => {
    router.replace("/(tabs)");
  };

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await signInByEmail(email, password);
    setLoading(false);
    if (error) {
      Toast.show(error.message);
    } else {
      Toast.show({ content: "登录成功", onClose: handleLoginSuccess });
    }
  };

  const gotoRegisterPage = () => {
    router.replace('/register')
  }

  const gotoGetPasswordPage = () => {
    router.push({ pathname: "/resetPassword", params: { email }});
  }

  return (
    <SafeAreaView style={styles.container}>
      <WingBlank>
        <Flex direction="column" align="center">
          <View style={styles.logoPlaceholder} />
          <WhiteSpace size="lg" />
          <Text style={styles.title}>欢迎</Text>
          <Text style={styles.subtitle}>快点登录吧</Text>
          <WhiteSpace size="xl" />
        </Flex>
        <TextInput
          style={styles.input}
          placeholder="邮箱"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <WhiteSpace size="sm" />
        <TextInput
          style={styles.input}
          placeholder="密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <WhiteSpace size="xl" />
        <Button type="primary" disabled={loading} onPress={handleLogin}>
          登录
        </Button>
        <WhiteSpace size="lg" />
        <Flex justify="between">
          <TouchableOpacity onPress={gotoGetPasswordPage}>
            <Text style={styles.link}>忘记密码?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={gotoRegisterPage}>
            <Text style={[styles.link, styles.primaryText]}>新用户注册</Text>
          </TouchableOpacity>
        </Flex>
        <WhiteSpace size="xl" />
        <Flex justify="center" align="center">
          <View style={styles.line} />
          <Text style={styles.dividerText}>其他方式登录</Text>
          <View style={styles.line} />
        </Flex>
        <WhiteSpace size="lg" />
        <Flex justify="around">
          <Button style={styles.socialButton}>
            <Icon name="wechat" />
          </Button>
          <Button style={styles.socialButton}>
            <Icon name="apple" />
          </Button>
          <Button style={styles.socialButton} onPress={handleLoginByGoogle}>
            <Icon name="google" />
          </Button>
        </Flex>
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
  logoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#ccc",
    borderRadius: 50,
    marginTop: 30
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
  link: {
    color: "#999",
  },
  primaryText: {
    color: '#141414'
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e8e8e8",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#888",
  },
  socialButton: {
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 24,
    paddingLeft:0,
    paddingRight:0,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});