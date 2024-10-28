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

type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
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
  const [user, setUser] = useState<User | null>(null);
  const value = { user, setUser };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};