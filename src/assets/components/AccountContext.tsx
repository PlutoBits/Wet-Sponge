import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../../Config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { FaShieldDog } from "react-icons/fa6";
import { FaShieldCat } from "react-icons/fa6";

const UseProfileContext = createContext<{
  profileIcon: React.ReactNode;
} | null>(null);
const IsloggedInContext = createContext<{ isLoggedIn: boolean } | null>(null);
const UsernameContext = createContext<{ username: string } | null>(null);
const AccountDataContext = createContext<{
  follows: number;
  following: number;
} | null>(null);
const [Animal] = Math.random() < 0.5 ? ["Dowg"] : ["Cat"];

function ProfileWarp({ children }: { children: React.ReactNode }) {
  const profileIcon = Animal === "Dowg" ? <FaShieldDog /> : <FaShieldCat />;
  return (
    <UseProfileContext.Provider value={{ profileIcon }}>
      {children}
    </UseProfileContext.Provider>
  );
}
const useProfile = () => {
  const ctx = useContext(UseProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside <AccountContext>");
  return ctx;
};

function IsloggedInWarp({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const cell = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(user !== null);
    });
    return cell;
  }, []);

  return (
    <IsloggedInContext.Provider value={{ isLoggedIn }}>
      {children}
    </IsloggedInContext.Provider>
  );
}
const useIsLoggedIn = () => {
  const ctx = useContext(IsloggedInContext);
  if (!ctx) throw new Error("useIsLoggedIn must be used inside <IsloggedIn>");
  return ctx;
};
function UsernameWarp({ children }: { children: React.ReactNode }) {
  const [Username, SetUsername] = useState<string>("");

  useEffect(() => {
    const cell = onAuthStateChanged(auth, (user) => {
      if (user) {
        SetUsername(user.displayName || "");
      } else {
        SetUsername(Animal === "Dowg" ? "Dowg" : "Cat");
      }
    });
    return cell;
  }, []);

  return (
    <UsernameContext.Provider value={{ username: Username }}>
      {children}
    </UsernameContext.Provider>
  );
}
const useUsername = () => {
  const ctx = useContext(UsernameContext);
  if (!ctx) throw new Error("useUsername must be used inside <Username>");
  return ctx;
};

function AccountDataWrap({ children }: { children: React.ReactNode }) {
  const [follows, setFollows] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);

  useEffect(() => {
    const cell = onAuthStateChanged(auth, () => {
      setFollows(Math.floor(Math.random() * 1000));
      setFollowing(Math.floor(Math.random() * 1000));
    });
    return cell;
  }, []); //* fetch from database in the future

  return (
    <AccountDataContext.Provider value={{ follows, following }}>
      {children}
    </AccountDataContext.Provider>
  );
}

const useAccountData = () => {
  const ctx = useContext(AccountDataContext);
  if (!ctx)
    throw new Error("useAccountData must be used inside <AccountDataWrap>");
  return ctx;
};

export {
  ProfileWarp,
  useProfile,
  IsloggedInWarp,
  IsloggedInContext,
  useIsLoggedIn,
  UsernameWarp,
  useUsername,
  AccountDataWrap,
  useAccountData,
};
