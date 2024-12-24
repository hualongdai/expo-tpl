import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import D from 'dayjs'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, Toast } from "@ant-design/react-native";
import { useNavigation, useLocalSearchParams } from "expo-router";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useChatContext, IMessage } from "@/hooks/chat";
import { useUser } from "@/hooks/user";
import {
  supabase,
  querySessionIsExist,
  updateSessionData,
} from "@/utils/supabase";
import { formatTime } from "@/utils/chat";

interface ISession {
  id: string;
  user_id_list: string[];
  is_group_chat: boolean;
  last_message: string;
}

const RelationshipTypeMap = {
  'Message': 'Message',
  'SysMessage': 'SysMessage',
  'GroupMessage': 'GroupMessage',
  'RobotMessage': 'RobotMessage'
}

type RelationshipType = keyof typeof RelationshipTypeMap;

const ChatScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);;

  const navigation = useNavigation();
  const { contactName, contactId, contactUserId, avatarUrl } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const { messages } = useChatContext();
  const { user } = useUser();

  useEffect(() => {
    navigation.setOptions({
      title: contactName || "测试用户",
      headerShown: true,
      headerTextStyle: {
        fontWeight: "400",
      },
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.goBack}>
          <SimpleLineIcons name="arrow-left" size={14} color="gray" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderMessage = ({
    item,
    index,
  }: {
    item: IMessage;
    index: number;
  }) => {
    const screenWidth = Dimensions.get("window").width;
    const showTimestamp =
      index === 0 || D(item.timestamp).valueOf() - D(messages[index - 1].timestamp).valueOf() > 300000; // 5 minutes
    return (
      <View>
        {showTimestamp && (
          <Text style={styles.timestampText}>{formatTime(item.timestamp)}</Text>
        )}
        <View
          style={[
            styles.messageBubble,
            item.user_id === user?.user_id
              ? styles.userMessage
              : styles.otherMessage,
            { maxWidth: screenWidth * 0.7 },
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    const curUserId = user?.user_id;
    if (!text || !curUserId) return;
    const { data: sessionData, error: sessionError } = await querySessionIsExist(curUserId, contactUserId as string);
    if (sessionError) {
      Toast.show('查询会话记录出错，请重试')
      return;
    }
    let sessionId;
    if (sessionData?.length === 0) {
      const { data: newSessionData, error: newSessionError } = await updateSessionData(curUserId, contactUserId as string, text, 'new');
      if (newSessionError) {
        Toast.show("创建会话记录出错，请重试");
        return;
      }
      sessionId = newSessionData ? (newSessionData as unknown as ISession[])[0].id : '';
    } else {
      sessionId = (sessionData as unknown as ISession[])[0].id;
      const { error: newSessionError } = await updateSessionData(
        curUserId,
        contactUserId as string,
        text,
        "update",
        sessionId
      );
      if (newSessionError) {
        Toast.show("更新会话记录出错，请重试");
        return;
      }
    }
    const { error } = await supabase.from("messages").insert([
      {
        text,
        username: contactName,
        user_id: contactUserId as string,
        contact_id: contactId,
        session_id: sessionId,
        message_type: RelationshipTypeMap.Message,
      },
    ]);
    if (error) {
      Toast.show("发送失败，请重试");
      return;
    }
    setInputText("");
    flatListRef.current?.scrollToEnd({ animated: true });
  };  

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={styles.messageList}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View
          style={[styles.inputContainer, { paddingBottom: insets.bottom }]}
        >
          <TouchableOpacity style={styles.inputIcon}>
            <Icon name="audio" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="请输入"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />
          {inputText.trim() ? (
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.inputIcon}>
              <Icon name="plus-circle" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#2C2C2C",
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  messageList: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
  },
  userMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  otherMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#95EC69",
  },
  messageText: {
    fontSize: 16,
    color: "black",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F6F6F6",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  inputIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 5,
  },
  input: {
    flex: 1,
    height: 36,
    backgroundColor: "white",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#07C160",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ChatScreen;