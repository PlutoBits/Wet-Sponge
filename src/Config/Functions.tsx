import {
  getDocs,
  getDoc,
  collection,
  Timestamp,
  doc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "./FirebaseConfig";
import { useQuery } from "@tanstack/react-query";
import type { UserData } from "../assets/types/Types";
import {
  updateEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export type MangaItems = {
  id: string;
  chapter?: number;
  comments?: number;
  image?: string;
  releasedate?: Timestamp;
  title?: string;
  likes?: number;
};
export type MusicItems = {
  id: string;
  title?: string;
  image?: string;
};
export type AnimationItems = {
  image?: string;
  title?: string;
  views?: number;
  likes?: number;
  comments?: number;
  timeStamp?: string;
};

async function fetchManga() {
  const snap = await getDocs(collection(db, "Manga"));
  return snap.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as MangaItems,
  );
}
export function useManga() {
  return useQuery({
    queryKey: ["manga"],
    queryFn: fetchManga,
  });
}
async function fetchMusic() {
  const snap = await getDocs(collection(db, "Music"));
  return snap.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as MusicItems,
  );
}
export function useMusic() {
  return useQuery({
    queryKey: ["Music"],
    queryFn: fetchMusic,
  });
}

async function fetchAnimation() {
  const snap = await getDocs(collection(db, "Animations"));
  return snap.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as AnimationItems,
  );
}
export function useAnimation() {
  return useQuery({
    queryKey: ["Animations"],
    queryFn: fetchAnimation,
  });
}
export async function fetchUserData(
  uid: string,
): Promise<Omit<UserData, "Profile">> {
  const snap = await getDoc(doc(db, "publicUserInfo", uid));
  const data = snap.data();
  return {
    createdAt: data?.createdAt ?? Timestamp.now(),
    username: data?.username || "",
    displayName: data?.displayName || "",
    email: data?.email ?? "",
    Bio: data?.Bio ?? "",
    Followers: data?.Followers ?? 0,
    Followings: data?.Followings ?? 0,
  };
}
export async function UpdateBio(newBio: string) {
  const user = auth.currentUser;
  if (!user) return;

  await setDoc(
    doc(db, "publicUserInfo", user.uid),
    { Bio: newBio },
    { merge: true },
  );
}
export const UpdateUsername = (username: string, uid: string) => {
  return Promise.all([
    setDoc(
      doc(db, "publicUserInfo", uid),
      { username: username },
      { merge: true },
    ),
    setDoc(doc(db, "User", uid), { username: username }, { merge: true }),
  ]);
};
export const UpdateDisplayName = (displayName: string, uid: string) => {
  return Promise.all([
    setDoc(
      doc(db, "publicUserInfo", uid),
      { displayName: displayName },
      { merge: true },
    ),
    setDoc(doc(db, "User", uid), { displayName: displayName }, { merge: true }),
  ]);
};
export const UpdateEmail = async (email: string, uid: string) => {
  const user = auth.currentUser;
  if (!user) return;
  (await updateEmail(user, email),
    await Promise.all([
      setDoc(doc(db, "publicUserInfo", uid), { email: email }, { merge: true }),
      setDoc(doc(db, "User", uid), { email: email }, { merge: true }),
    ]));
};

export const getEmailFromUsername = async ({
  username,
}: {
  username: string;
}) => {
  const q = query(
    collection(db, "publicUserInfo"),
    where("username", "==", username),
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    return null;
  }
  const email = snap.docs[0].data().email;
  return email;
};

export const sendVerification = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
};

export async function SetUpUser({
  uid,
  username,
  email,
}: {
  uid: string;
  username: string;
  email: string;
}) {
  const userDoc = await getDoc(doc(db, "User", uid));
  if (userDoc.exists()) return;

  await setDoc(
    doc(db, "publicUserInfo", uid),
    {
      Bio: "",
      createdAt: Timestamp.now(),
      displayName: username,
      email: email,
      username: username.toLowerCase(),
    },
    { merge: true },
  );
  await setDoc(
    doc(db, "User", uid),
    {
      Bio: "",
      createdAt: Timestamp.now(),
      displayName: username,
      email: email,
      username: username.toLowerCase(),
    },
    { merge: true },
  );
}
export async function isUsernameTaken(username: string) {
  const q = query(
    collection(db, "publicUserInfo"),
    where("username", "==", username.toLowerCase()),
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function LoginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const username = user.displayName
      ? user.displayName.toLowerCase().replace(/[^a-z0-9_]/g, "_")
      : user.email!.split("@")[0];
    await SetUpUser({ uid: user.uid, username, email: user.email! });
    return "true";
  } catch (error) {
    console.error("Error during Google login:", error);
    return getPlainError(error);
  }
}

export async function classicSignUp({
  password,
  email,
  username,
}: {
  password: string;
  email: string;
  username: string;
}) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  await SetUpUser({
    uid: userCredential.user.uid,
    username: username,
    email: email,
  });
}
export async function classicLogin({
  password,
  email,
}: {
  password: string;
  email: string;
}) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
}

export function getPlainError(error: unknown): string {
  console.error(error);
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  switch (code) {
    case "auth/email-already-in-use":
      return "Email in use.";
    case "auth/invalid-email":
      return "That email doesn't look right.";
    case "auth/weak-password":
      return "Password is too weak.";
    case "auth/user-not-found":
      return "User doesn't exist.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Wrong email or password or User doesn't exist.";
    case "auth/too-many-requests":
      return "Too many attempts.";
    case "auth/network-request-failed":
      return "Database can't be reached.";
    case "auth/operation-not-allowed":
      return "Operation rejected.";
    case "auth/popup-closed-by-user":
      return "Sign-in cancelled.";
    case "auth/popup-blocked":
      return "Allow pop-ups for this site, then try again.";
    case "auth/unauthorized-domain":
      return "Something went wrong, try again.";
    case "auth/requires-recent-login":
      return "Please sign in again, then try again.";
    case "auth/user-disabled":
      return "This account is disabled.";
    case "permission-denied":
      return "You don't have permission to do that.";
    case "unavailable":
      return "Database can't be reached.";
    default:
      return "Error unknown.";
  }
}
