import {
  getDocs,
  getDoc,
  collection,
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./FirebaseConfig";
import { useQuery } from "@tanstack/react-query";
import type { UserData } from "../assets/types/Types";
import { updateEmail } from "firebase/auth";

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
