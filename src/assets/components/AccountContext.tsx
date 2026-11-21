import { createContext, useContext, useState, useEffect } from "react";
import { type ReactNode } from "react";
import type { UserData } from "../types/Types";
import { auth, db } from "../../Config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FaShieldDog } from "react-icons/fa6";
import { FaShieldCat } from "react-icons/fa6";

const UserContext = createContext<{
  UserData: UserData;
  SetUserData: React.Dispatch<React.SetStateAction<UserData>>;
} | null>(null);

export async function UserProvider({ children }: { children: ReactNode }) {
  const [UserData, SetUserData] = useState({
    username: "",
    DisplayName: "",
    Bio: "",
    Followers: 0,
    Followings: 0,
  });

  return (
    <UserContext.Provider value={{ UserData, SetUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  useContext(UserContext);
}
