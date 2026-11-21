import { getDocs, collection, Timestamp } from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { useQuery } from "@tanstack/react-query";

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
