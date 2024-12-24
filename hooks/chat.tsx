import {
  createContext,
  FC,
  PropsWithChildren,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase";
import { RealtimeChannel, RealtimeMessage } from "@supabase/supabase-js";

export interface IMessage {
  id: number;
  text: string;
  username: string;
  timestamp: string;
  user_id: string;
  contact_id: number;
  avatar_url: string;
}
//  {"contact_id": 2, "created_at": "2024-10-30T07:17:45.09551+00:00", "id": 2, "text": "Test", "timestamp": "2024-10-30T07:17:45.09551+00:00", "user_id": "9c3c6c06-1b4b-4286-aaa1-6303d72089f5", "username": ""}

export interface ISession {
  id: number;
  user_id_list: string[];
  is_group_chat: boolean;
  last_message: string;
  group_name: string;
  receiver_user_id: string;
  last_message_time: string;
}
export interface IFullSession extends ISession {
  username: string;
  avatar_url: string;
  contact_id: number;
}

type ChatContextType = {
  messages: IMessage[];
  sessions: IFullSession[];
  loadingInitial?: boolean;
  isOnBottom?: boolean;
  error?: string;
  scrollRef?: any;
  onScroll?: (e: any) => void;
  scrollToBottom?: () => void;
  unViewedMessageCount?: number;
};

export const ChatContext = createContext<ChatContextType>({ messages: [], sessions: [], username: "" } as ChatContextType);

export const ChatContextProvider: FC<PropsWithChildren> = ({ children }) => {
  let myChannel: RealtimeChannel | null = null;

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(false);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [sessions, setSessions] = useState<IFullSession[]>([]);
  const [error, setError] = useState("");
  const [newIncomingMessageTrigger, setNewIncomingMessageTrigger] = useState<any>(null);
  const [unViewedMessageCount, setUnViewedMessageCount] = useState(0);

  const [isOnBottom, setIsOnBottom] = useState(false);
  const scrollRef = useRef<any>();


  const scrollToBottom = () => {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scrollToEnd = scrollRef.current.scrollHeight;
  }

  // const initializeUser = (session: Session) => {
  //   setSession(session);
  //   let username;
  //   if (session) {
  //     username =
  //       session.user.user_metadata.name ||
  //       session.user.user_metadata.email.replace(/@.*/, "");
  //   } else {
  //     username = AsyncStorage.getItem("username") || getRandomUsername();
  //   }
  //   setUsername(username);
  //   if (typeof username === 'string') AsyncStorage.setItem("username", username);
  // };

  const getInitialMessages = async () => {
    if (messages.length) return;
    const { data, error } = await supabase
      .from("messages")
      .select("*, contacts(remark, nick_name, avatar_url)")
      .range(0, 49)
      .order("id", { ascending: true });

    const filterData = data
      ? data.map(({ contacts, ...rest }) => ({
          ...rest,
          username: contacts.remark || contacts.nick_name,
          avatar_url: contacts.avatar_url,
        }))
      : [];
    setLoadingInitial(false);
    if (error) {
      setError(error.message);
      return;
    }
    setIsInitialLoad(true);
    setMessages(filterData);
  };

  const getInitialSessions = async () => {
    if (sessions.length) return;
    const { data, error } = await supabase
      .from("sessions")
      .select()
      .range(0, 49)
      .order("id", { ascending: true });

    const filterData = data
      ? data.map(({ contacts, ...rest }) => ({
          ...rest,
          username: contacts.remark || contacts.nick_name,
          avatar_url: contacts.avatar_url,
          contact_id: contacts.id,
        }))
      : [];
    setLoadingInitial(false);
    if (error) {
      setError(error.message);
      return;
    }
    setIsInitialLoad(true);
    setSessions(filterData);
  };

  const onScroll = async ({ target }: any) => {
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 1) {
      setUnViewedMessageCount(0);
      setIsOnBottom(true);
    } else {
      setIsOnBottom(false);
    }

    //* Load more messages when reaching top
    if (target.scrollTop === 0) {
      const { data, error } = await supabase
        .from("messages")
        .select()
        .range(messages.length, messages.length + 49)
        .order("id", { ascending: false });
      if (error) {
        setError(error.message);
        return;
      }
      target.scrollTop = 1;
      setMessages((prevMessages) => [...prevMessages, ...data]);
    }
  };

  const getMessagesAndSubscribe = async () => {
    await getInitialMessages();
    await getInitialSessions();
    if (!myChannel) {
      myChannel = supabase
        .channel("chat-channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const newMessage = payload.new as IMessage;
            console.log("payload", payload);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            //* needed to trigger react state because I need access to the username state
            setNewIncomingMessageTrigger(payload.new);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "sessions",
          },
          (payload) => {
            console.log(payload.new);
            const newSession = payload.new as IFullSession;
            setSessions((prevSessions) => [...prevSessions, newSession]);
          }
        )
        .subscribe();
    }
  };

  useEffect(() => {
    // 初始化用户名
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   initializeUser(session as Session);
    // });

    // 获取消息列表 和会话列表 和订阅他们的变化
    getMessagesAndSubscribe();

    // const {
    //   data: { subscription: authSubscription },
    // } = supabase.auth.onAuthStateChange((_event, session) => {
    //   initializeUser(session as Session);
    // });

    return () => {
      // Remove supabase channel subscription by useEffect unmount
      if (myChannel) {
        supabase.removeChannel(myChannel);
      }
      // authSubscription.unsubscribe();
    };
  }, [])

  useEffect(() => {
    if (!newIncomingMessageTrigger) return;

    if (newIncomingMessageTrigger.username === '') {
      scrollToBottom();
    } else {
      setUnViewedMessageCount((prevCount) => prevCount + 1);
    }
  }, [newIncomingMessageTrigger]);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      scrollToBottom();
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        sessions,
        loadingInitial,
        error,
        scrollRef,
        onScroll,
        scrollToBottom,
        isOnBottom,
        unViewedMessageCount,
        // session,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);