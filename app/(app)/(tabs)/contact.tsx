import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { List, SearchBar } from "@ant-design/react-native";
import { getContacts } from '@/utils/supabase';
import { getAvatarText } from "@/utils";
import { useRouter } from "expo-router";

const Item = List.Item;

interface IContact {
  /** 联系人ID */
  id: number;
  /**
   * 用户ID
   * @description 用户关联 supabase.auth.user.id
   */
  user_id: string;
  /** 微信ID */
  wechat_id: string;
  /** 昵称 */
  nick_name: string;
  /** 头像URL */
  avatar_url: string;
  /** 备注 */
  remark: string;
}

interface IContactSection {
  key: string;
  title: string;
  items: IContact[];
}

const ContactScreen: React.FC = () => {
  const [contacts, setContacts] = useState<IContactSection[]>([]);
  const router = useRouter();

  useEffect(() => {
    const initData = async () => {
      const { data, error } = await getContacts();
      if (!error) {
        const sortedData = (data || []).reduce((acc, contact) => {
          const firstLetter = getAvatarText(contact.remark || contact.nick_name);
          if (!acc[firstLetter]) {
            acc[firstLetter] = {
              key: firstLetter,
              title: firstLetter,
              items: [],
            };
          }
          acc[firstLetter].items.push(contact);
          return acc;
        }, {});
        const sortedContacts = Object.values(sortedData) as IContactSection[];
        setContacts(sortedContacts);
      }
    };
    initData();
  }, []);

  const gotoChatPage = (contact: IContact) => {
    router.push({
      pathname: "/chat",
      params: {
        contactId: contact.id,
        userId: contact.user_id,
        contactName: contact.remark || contact.nick_name,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        style={styles.searchBar}
        placeholder="搜索"
        autoCapitalize="none"
      />
      <ScrollView>
        <List>
          {contacts.map((section) => {
            return (
              <View key={section.key}>
                <Text style={styles.sectionHeader}>{section.title}</Text>
                {section.items.map((item, index: number) => (
                  <Item
                    key={index}
                    arrow="empty"
                    onPress={() => gotoChatPage(item)}
                  >
                    <View style={styles.contactItem}>
                      {item.avatar_url ? (
                        <Image
                          source={{
                            uri: item.avatar_url,
                          }}
                          style={styles.avatar}
                        />
                      ) : (
                        <View style={styles.avatar}>
                          <Text>
                            {getAvatarText(item.remark || item.nick_name)}
                          </Text>
                        </View>
                      )}
                      <Text>{item.remark || item.nick_name}</Text>
                    </View>
                  </Item>
                ))}
              </View>
            );
          })}
        </List>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchBar: {
    backgroundColor: 'transparent'
  },
  header: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#EDEDED",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },
  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    fontSize: 14,
    color: "#888888",
    backgroundColor: "#FFFFFF",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDEDED",
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
});

export default ContactScreen;
