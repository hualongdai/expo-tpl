import {
  createContext,
  useContext,
  useState,
  FC,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from "react";
import { User } from "@supabase/supabase-js";

interface IContact {
  /** 联系人ID */
  contact_id: number;
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

type FullUserInfo = User['user_metadata'] & Partial<IContact>;

type UserContextType = {
  user: FullUserInfo | null;
  setUser: Dispatch<SetStateAction<FullUserInfo | null>>;
} | null;

const UserContext = createContext<UserContextType>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<FullUserInfo | null>(null);
  const value = { user, setUser };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};