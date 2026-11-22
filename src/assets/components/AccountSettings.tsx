import { useEffect, useRef, useState } from "react";
import { useUser } from "./AccountContext";
import AccountSettingsBox from "./AccountSettingsBox";
import ProfileCard from "./AccountSettingProfileCard";

import { FaRegUser } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import { VscDebugConnected } from "react-icons/vsc";
import { GoShieldCheck } from "react-icons/go";

function AccountSettings({ open }: { open: boolean }) {
  const { UserData } = useUser();
  const menuRef = useRef<HTMLDivElement>(null);
  const [Change, setChange] = useState("Profile");
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
          <ProfileCard
            AccountData={{
              username: UserData.username,
              display: UserData.displayName,
              Bio: UserData.Bio,
            }}
          />
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
                AccountData={{
                  username: UserData.username,
                  display: UserData.displayName,
                  Bio: UserData.Bio,
                }}
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
