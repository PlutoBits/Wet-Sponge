import {
  Home,
  Manga,
  Animation,
  Music,
  Cafe,
  About,
  Account,
  Terms,
} from "../pages/path";
import { Timestamp } from "firebase/firestore/lite";

import type { IconType } from "react-icons";
export type UserData = {
  username: string;
  displayName: string;
  Bio: string;
  email: string;
  createdAt: Timestamp;
  Followers: number;
  Followings: number;
  Profile: IconType;
};
import { FaShieldDog } from "react-icons/fa6";
export const DefaultUserRef: UserData = {
  createdAt: Timestamp.now(),
  displayName: "",
  Bio: "",
  email: "",
  username: "",
  Profile: FaShieldDog,
  Followers: 0,
  Followings: 0,
};
export const PagesContent = [
  {
    name: "/Home",
    element: <Home />,
  },
  {
    name: "/Manga",
    element: <Manga />,
  },
  {
    name: "/Animation",
    element: <Animation />,
  },
  {
    name: "/Music",
    element: <Music />,
  },
  {
    name: "/Cafe",
    element: <Cafe />,
  },
  {
    name: "/About",
    element: <About />,
  },
  {
    name: "/Account",
    element: <Account />,
  },
  {
    name: "/Terms",
    element: <Terms />,
  },
];

export const AccountCardDate = [
  {
    name: "Reading History",
    DataMap: [
      { name: "Rain Arc Signal" },
      { name: "Subway Loop: Pilot" },
      { name: "Ink Wave" },
    ],
  },
  {
    name: "Watch History",
    DataMap: [
      { name: "Rain Arc Signal" },
      { name: "Subway Loop: Pilot" },
      { name: "Ink Wave" },
    ],
  },
  {
    name: "Listening History",
    DataMap: [
      { name: "Rain Arc Signal" },
      { name: "Subway Loop: Pilot" },
      { name: "Ink Wave" },
    ],
  },
  {
    name: "Saved Manga",
    DataMap: [
      { name: "Rain Arc Signal" },
      { name: "Subway Loop: Pilot" },
      { name: "Ink Wave" },
    ],
  },
  {
    name: "Saved Videos",
    DataMap: [
      { name: "Rain Arc Signal" },
      { name: "Subway Loop: Pilot" },
      { name: "Ink Wave" },
      { name: "Rain Arc Signal" },
      { name: "Subway Loop: Pilot" },
      { name: "Ink Wave" },
      { name: "Rain Arc Signal" },
      { name: "Subway Loop: Pilot" },
      { name: "Ink Wave" },
    ],
  },
  {
    name: "Saved Music",
    DataMap: [
      { name: "Rain Arc Signal" },
      { name: "Subway Loop: Pilot" },
      { name: "Ink Wave" },
    ],
  },
];

export const ArticleData = [
  {
    Articletitle: "Manager",
    Articledescription: "SHRI",
  },
  {
    Articletitle: "Founder",
    Articledescription: "PAIRIO / G7",
  },
  {
    Articletitle: "Co-Founders",
    Articledescription: "CRISPY / ZEN / SHRI",
  },
  {
    Articletitle: "Developer",
    Articledescription: "PlutoBits",
  },
];
export const ButtonData = [
  {
    Name: "Contact",
    url: "/404",
  },
  {
    Name: "Privacy Policy",
    url: "/404",
  },
  {
    Name: "Terms of Service",
    url: "/terms",
  },
  {
    Name: "Discord",
    url: "https://discord.gg/WbNGbu4WzB",
  },
  {
    Name: "Instagram",
    url: "https://www.instagram.com/wetsponge_st?igsi=MXBtbXJ5NThwMjZwOA==",
  },
  {
    Name: "YouTube",
    url: "https://www.youtube.com/@wetSpongest",
  },
];

import { GoVideo } from "react-icons/go";
import { LuMusic4 } from "react-icons/lu";
import { Profile } from "../components/AccountContext";
import { MdBookmarkBorder } from "react-icons/md";
export const options = [
  {
    name: "Read Manga",
    path: "/Manga",
    icon: <MdBookmarkBorder />,
  },
  {
    name: "Watch Animation",
    path: "/Animation",
    icon: <GoVideo />,
  },
  {
    name: "Listen Music",
    path: "/Music",
    icon: <LuMusic4 />,
  },
];
