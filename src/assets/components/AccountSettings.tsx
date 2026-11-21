import { useEffect, useRef, useState } from "react";
import { useProfile } from "./AccountContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../Config/FirebaseConfig";
import { onSnapshot, doc, setDoc } from "firebase/firestore";

import { FaRegUser } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import { VscDebugConnected } from "react-icons/vsc";
import { GoShieldCheck } from "react-icons/go";
import { FaCamera } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaSave } from "react-icons/fa";

function AccountSettingsBox({
  Conent,
  ConentIcon,
  index,
  Change,
  TabRef,
  onClick,
}: {
  Conent: string;
  ConentIcon: any;
  index: number;
  Change: string;
  TabRef: React.RefObject<(HTMLButtonElement | null)[]>;
  onClick: () => void;
}) {
  return (
    <button
      className={
        Change == Conent ? `AccountSettingsBox ActiveBox` : "AccountSettingsBox"
      }
      ref={(el) => {
        TabRef.current[index] = el;
      }}
      onClick={() => onClick}
    >
      {ConentIcon}
      <p>{Conent}</p>
    </button>
  );
}
function ProfileCard({
  className,
  pen,
  AccountData,
}: {
  className?: string;
  pen?: boolean;
  AccountData: { username: string; display: string; Bio: string };
}) {
  const { profileIcon } = useProfile();
  const [inEdit, SetEdit] = useState(false);
  const [Bio, setBio] = useState("");
  async function handleBioChange() {
    const user = auth.currentUser;
    if (!user) return;
    if (Bio !== AccountData.Bio) {
      await setDoc(
        doc(db, "publicUserInfo", user.uid),
        { Bio: Bio },
        { merge: true },
      );
      setBio(Bio);
    }
  }
  return (
    <div className="AccountSettingsProfileCard">
      <div className={`AccountSettingsProfileCardIcon ${className}`}>
        {profileIcon}
        {pen && (
          <button className="PenButton">
            <FaCamera />
          </button>
        )}
      </div>
      <div className={`AccountSettingsProfileCardInfo ${className}`}>
        <p className="z c">{AccountData.username}</p>
        <p className="AccountSettingsProfileCardInfoFollow cc">
          {pen ? (
            inEdit ? (
              <form onSubmit={() => handleBioChange()}>
                <input
                  placeholder={AccountData.Bio}
                  onChange={(e) => setBio(e.target.value)}
                  value={Bio}
                ></input>
                <button
                  className="PenButtonBio"
                  onClick={(e) => {
                    e.preventDefault();
                    handleBioChange();
                    SetEdit(false);
                  }}
                  type="submit"
                >
                  {inEdit ? <FaSave /> : <FaPen />}
                </button>
              </form>
            ) : (
              <>
                {AccountData.Bio}
                {pen && (
                  <button
                    className="PenButtonBio"
                    onClick={() => SetEdit(!inEdit)}
                  >
                    {inEdit ? <FaSave /> : <FaPen />}
                  </button>
                )}
              </>
            )
          ) : (
            <>
              {AccountData.Bio}
              {pen && (
                <button
                  className="PenButtonBio"
                  onClick={() => SetEdit(!inEdit)}
                >
                  {inEdit ? <FaSave /> : <FaPen />}
                </button>
              )}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function AccountSettings({ open }: { open: boolean }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [Change, setChange] = useState("Profile");
  const [AccountData, SetAccountData] = useState({
    username: "",
    display: "",
    Bio: "",
  });
  const tabs = [
    { name: "Profile", icon: <FaRegUser /> },
    { name: "Detail", icon: <TbListDetails /> },
    { name: "Connections", icon: <VscDebugConnected /> },
    { name: "Security", icon: <GoShieldCheck /> },
  ];
  const activeIndex = tabs.findIndex((tab) => tab.name === Change);
  const TabRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorTop, setIndicatorTop] = useState(0);
  useEffect(() => {
    if (!menuRef.current) return;

    if (open) {
      menuRef.current.showPopover();
    } else {
      menuRef.current.hidePopover();
    }
  }, [open]);
  useEffect(() => {
    let unsubSnap: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      unsubSnap = onSnapshot(doc(db, "publicUserInfo", user.uid), (snap) => {
        if (snap.exists()) {
          SetAccountData((prev) => ({
            ...prev,
            display: snap.data()?.displayName,
            username: snap.data()?.username,
            Bio: snap.data()?.Bio ?? "Add a status..",
          }));
        }
      });
    });

    return () => {
      unsubAuth();
      if (unsubSnap) unsubSnap();
    };
  }, []);

  useEffect(() => {
    (console.log(activeIndex), [activeIndex]);
  });
  useEffect(() => {
    const btn = TabRef.current[activeIndex];
    if (btn) {
      setIndicatorTop(btn.offsetTop);
    }
  }, [activeIndex]);
  return (
    <div
      className="AccountSettings"
      id="AccountSettings"
      popover="manual"
      ref={menuRef}
    >
      <div className="AccountSettingsContainer">
        <div className="AccountSettingsContainerLeft">
          <ProfileCard AccountData={AccountData} />
          <div className="Line"></div>
          <span>
            <div
              className="AccountSettingsActiveIndicator"
              style={{ top: indicatorTop }}
            />
            {tabs.map((tab, i) => (
              <AccountSettingsBox
                Conent={tab.name}
                ConentIcon={tab.icon}
                key={i}
                index={i}
                Change={Change}
                TabRef={TabRef}
                onClick={() => setChange(tab.name)}
              />
            ))}
          </span>
        </div>
        <div className="AccountSettingsContainerRight bigg">
          {Change == "Profile" ? (
            <>
              <div className="SettingsRightInfo">
                <h1>Profile</h1>
                <p>Manage your public profile and how you appear to others.</p>
              </div>
              <div className="Linee Line"></div>
              <ProfileCard
                className="big"
                pen={true}
                AccountData={AccountData}
              />
            </>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
