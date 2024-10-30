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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, Toast } from "@ant-design/react-native";
import { useNavigation, useLocalSearchParams } from "expo-router";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useChatContext, IMessage } from "@/hooks/chat";
import { useUser } from "@/hooks/user";
import { supabase } from "@/utils/supabase";
import { formatTime } from "@/utils/chat";


const ChatScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);;

  const navigation = useNavigation();
  const { contactName, contactId, userId, avatarUrl } = useLocalSearchParams();
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
      index === 0 || item.timestamp - messages[index - 1].timestamp > 300000; // 5 minutes
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
    if (inputText.trim()) {
      const { error } = await supabase.from("messages").insert([
        {
          text: inputText.trim(),
          username: contactName,
          user_id: userId,
          contact_id: contactId,
        },
      ]);
      if (error) {
        Toast.show('发送失败，请重试');
        return;
      }
      setInputText("");
      flatListRef.current?.scrollToEnd({ animated: true });
    }
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