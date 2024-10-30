import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  Text,
  SearchBar,
  Badge,
} from "@ant-design/react-native";
import { useChatContext, IMessage } from '@/hooks/chat';
import { useUser } from '@/hooks/user';
import { getAvatarText } from '@/utils';
import { formatTime } from "@/utils/chat";
import { useRouter } from 'expo-router';

const MessagesScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const { messages, unViewedMessageCount } = useChatContext();
  console.log("messages", messages, unViewedMessageCount);

  // 将 messages 数组里的message，按照user_id 进行分组, 并将每个分组的第一条消息作为预览消息，如果user_id 是当前用户，则丢弃这个条消息
  const groupedMessages = (messages: IMessage[]) =>
    Object.values(
      messages.reduce((acc, message) => {
        if (message.user_id !== user?.user_id) {
          const userId = message.user_id;
          acc[userId] = message;
        }
        return acc;
      }, {} as Record<string, IMessage>)
    );

  const gotoChatPage = (data: IMessage) => {
    router.push({
      pathname: "/chat",
      params: {
        contactName: data.username,
        contactId: data.contact_id,
        userId: data.user_id,
        avatarUrl: data.avatar_url,
      },
    });
  };

  const renderMessageItem = ({ item }: { item: IMessage }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => gotoChatPage(item)}
    >
      {item.avatar_url ? (
        <Image source={{ uri: item.avatar_url }} style={styles.messageAvatar} />
      ) : (
        <View style={styles.messageAvatar}>
          <Text>{getAvatarText(item.username)}</Text>
        </View>
      )}
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageName}>{item.username}</Text>
          <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
        </View>
        <Text style={styles.messagePreview} numberOfLines={1}>
          {item.text}
        </Text>
      </View>
      <Badge text={unViewedMessageCount} style={styles.unreadBadge} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar placeholder="搜索" />
      <FlatList
        data={groupedMessages(messages)}
        renderItem={renderMessageItem}
        keyExtractor={(item) => `${item.id}`}
        style={styles.messageList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    marginTop: 5,
    fontSize: 12,
  },
  messageList: {
    flex: 1,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  messageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDEDED",
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  messageName: {
    fontWeight: "bold",
  },
  messageTime: {
    color: "#999",
    fontSize: 12,
  },
  messagePreview: {
    color: "#666",
  },
  unreadBadge: {
    marginLeft: 10,
  },
});

export default MessagesScreen;
