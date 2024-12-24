import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import { supabaseUrl, supabaseAnonKey } from "@/config";

const redirectTo = makeRedirectUri();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const signUpByEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${redirectTo}(tabs)`,
    },
  });
  return { data, error };
};

export const getResetEmail = async (email: string, redirectPathname: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${redirectTo}${redirectPathname}`,
  });
  return { data, error };
};

export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};

export const signInByEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentUserBySession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user;
};

export const getContacts = async () => {
  const { data, error } = await supabase.from("contacts").select("*");
  return { data, error };
}

export const getContactByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("contacts")
    .select("id, user_id, wechat_id, nick_name, remark, avatar_url")
    .eq("user_id", userId);
  return { data: data ? data[0] : {}, error };
}

export const querySessionIsExist = async (senderUserId: string, receiverUserId: string) => {
  const { data, error } = await supabase
    .from("sessions")
    .select()
    .contains("user_id_list", [senderUserId, receiverUserId]);
  return { data, error }
}

export const updateSessionData = async (
  senderUserId: string,
  receiverUserId: string,
  text: string,
  optType: 'new' | 'update',
  sessionId?: string
) => {
  if (!optType) {
    return { data: [], error: { message: "先指定optType" } };
  }
  if (optType === "new") {
    const { data, error } = await supabase.from("sessions").insert([
      {
        user_id_list: [senderUserId, receiverUserId],
        last_message: text,
      },
    ]).select();
    return { data, error };
  } else {
    const { data, error } = await supabase
      .from("sessions")
      .update({
        last_message: text,
      })
      .eq("id", sessionId);
    return { data, error };
  }
};