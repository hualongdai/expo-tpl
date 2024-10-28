import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Text,
  Flex,
  WhiteSpace,
  WingBlank,
  Icon,
  Button,
  Toast
} from "@ant-design/react-native";
import { nativeApplicationVersion } from "expo-application";
import { useUser } from '@/hooks/user';
// import * as ImagePicker from "expo-image-picker";
import type { IconNames } from '@ant-design/react-native/lib/icon';
import { signOut } from '@/utils/supabase';
import { useRouter } from 'expo-router'

const UserProfileScreen = () => {
  const menuItems: { title: string; icon: IconNames; onPress: () => void }[] = [
    { title: "保证金", icon: "safety", onPress: () => {} },
    { title: "我的推广", icon: "share-alt", onPress: () => {} },
    { title: "客服中心", icon: "customer-service", onPress: () => {} },
    { title: "意见反馈", icon: "form", onPress: () => {} },
    { title: "设置", icon: "setting", onPress: () => {} },
  ];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user }  = useUser();
  const [image, setImage] = useState<string | null>(null);

  const getAvatarText = () => {
    const defaultAvatarText = 'A';
    if (!user) return defaultAvatarText;
    const { name } = user.user_metadata;
    const avatarText = name? name[0] : user.user_metadata.email[0];
    if (avatarText && typeof avatarText === 'string') return avatarText.toUpperCase();
    return defaultAvatarText;
  };

  const logout = async () => {
    const { error } = await signOut();
    if (!error) {
      router.replace("/login");
      return;
    }
    Toast.info('退出登录失败')
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]} />
      <WingBlank size="lg">
        <View style={styles.avatarBox}>
          <View style={styles.avatar}>
            {user && user.user_metadata.avatar_url ? (
              <Image source={user.user_metadata.avatar_url} />
            ) : (
              <Text style={styles.avatarText}>{getAvatarText()}</Text>
            )}
          </View>
          <Text style={styles.profileName}>
            {user
              ? user.user_metadata.name || user.user_metadata.email
              : "未登录用户"}
          </Text>
        </View>
        <WhiteSpace size="lg" />
        <View style={styles.card}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.item}>
              <Flex direction="row">
                <Icon
                  name={item.icon}
                  size={20}
                  color="#9496A1"
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontSize: 16 }}>{item.title}</Text>
              </Flex>
              <Icon name="right" size={10} />
            </TouchableOpacity>
          ))}
        </View>
      </WingBlank>
      <WhiteSpace size="lg" />
      <WingBlank size="lg">
        <Button style={styles.signOut} onPress={logout}>退出登录</Button>
      </WingBlank>
      <WhiteSpace size="lg" />
      <Flex direction="row" align="center" justify="center">
        <Text style={styles.versionText}>
          版本号：{nativeApplicationVersion}
        </Text>
      </Flex>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#3274F9",
    height: 190,
  },
  avatarBox: {
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: -60,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: "flex-start",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    color: "#3274F9",
    fontWeight: 600,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
  },
  item: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  versionText: {
    fontSize: 12,
    color: "#9496A1",
  },
  signOut: {
    borderWidth: 0,
  }
});

export default UserProfileScreen;
