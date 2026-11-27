import { createContext, useContext, useState, useEffect } from "react";
import { type ReactNode } from "react";
import type { UserData } from "../types/Types";
import { DefaultUserRef } from "../types/Types";
import { auth } from "../../Config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { FaShieldDog } from "react-icons/fa6";
import { FaShieldCat } from "react-icons/fa6";
import { Timestamp } from "firebase/firestore/lite";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../Config/FirebaseConfig";

const Pet = Math.random() < 0.5 ? "Dowg" : "Cat";
export const Profile = Pet === "Dowg" ? FaShieldDog : FaShieldCat;

const UserContext = createContext<{
  UserData: UserData;
  SetUserData: React.Dispatch<React.SetStateAction<UserData>>;
} | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [UserData, SetUserData] = useState<UserData>(DefaultUserRef);
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        SetUserData({
          createdAt: Timestamp.now(),
          username: Pet.toLowerCase(),
          displayName: Pet,
          email: "",
          Bio: Pet === "Dowg" ? "A Dowg" : "A Cat",
          Profile: Profile,
          Followers: 0,
          Followings: 0,
        });
        return;
      }
      const unsubSnap = onSnapshot(
        doc(db, "publicUserInfo", user.uid),
        (snap) => {
          const data = snap.data();
          SetUserData({
            createdAt: data?.createdAt ?? Timestamp.now(),
            username: data?.username || Pet,
            displayName: data?.displayName || Pet,
            email: data?.email ?? "",
            Bio: data?.Bio || (Pet === "Dowg" ? "A Dowg" : "A Cat"),
            Profile: Profile,
            Followers: data?.Followers ?? 0,
            Followings: data?.Followings ?? 0,
          });
          if (user.email && user.email !== data?.email) {
            setDoc(
              doc(db, "publicUserInfo", user.uid),
              { email: user.email },
              { merge: true },
            );
            setDoc(
              doc(db, "User", user.uid),
              { email: user.email },
              { merge: true },
            );
          }
        },
      );
      return () => unsubSnap();
    });
    return () => unsubAuth();
  }, []);

  return (
    <UserContext.Provider value={{ UserData, SetUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
