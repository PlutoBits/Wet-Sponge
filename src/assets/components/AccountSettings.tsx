import { useEffect, useRef, useState } from "react";
import { useUser } from "./AccountContext";
import AccountSettingsBox from "./AccountSettingsBox";
import ProfileCard from "./AccountSettingProfileCard";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FaRegUser } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import { VscDebugConnected } from "react-icons/vsc";
import { GoShieldCheck } from "react-icons/go";
import { IoIosArrowBack } from "react-icons/io";
import OptionContainer from "./OptionContainer";
import {
  UpdateUsername,
  UpdateDisplayName,
  UpdateEmail,
  isUsernameTaken,
} from "../../Config/Functions";
import { auth } from "../../Config/FirebaseConfig";

function AccountSettings({ open }: { open: boolean; onClose?: () => void }) {
  const { UserData, SetUserData } = useUser();
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
  const [SiderType, setSiderType] = useState("none");
  const ProfileOptions = [
    {
      name: "Username",
      action: () => setSiderType("username"),
      type: UserData.username,
    },
    {
      name: "Display Name",
      action: () => setSiderType("displayname"),
      type: UserData.displayName,
    },
    {
      name: "Email",
      action: () => setSiderType("email"),
      type: UserData.email,
    },
  ];

  useEffect(() => {
    console.log(SiderType);
  }, [SiderType]);
  /* popover effect */
  useEffect(() => {
    if (!menuRef.current) return;

    if (open) {
      menuRef.current.showPopover();
    } else {
      menuRef.current.hidePopover();
    }
  }, [open]);
  /* bar effect */
  useEffect(() => {
    const btn = TabRef.current[activeIndex];
    if (btn) {
      setIndicatorTop(btn.offsetTop);
    }
  }, [activeIndex, open]);

  const UsernameSchema = z.object({
    Username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(20, "Username must be at most 20 characters.")
      .regex(
        /^[a-z0-9_]+$/,
        "Username can only contain Small letters, numbers, and underscores.",
      ),
  });
  const UsernameForm = useForm<z.infer<typeof UsernameSchema>>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: { Username: "" },
  });
  const DisplayNameSchema = z.object({
    DisplayName: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(20, "Username must be at most 20 characters.")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores.",
      ),
  });
  const DisplayNameForm = useForm<z.infer<typeof DisplayNameSchema>>({
    resolver: zodResolver(DisplayNameSchema),
    defaultValues: { DisplayName: "" },
  });
  const EmailSchema = z.object({
    Email: z.email(),
  });
  const EmailForm = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: { Email: "" },
  });

  const handleSaveEmail = async (data: { Email: string }) => {
    const user = auth.currentUser;
    if (!user) return;
    await UpdateEmail(data.Email, user.uid);
    SetUserData((prev) => ({ ...prev, email: data.Email }));
    setSiderType("none");
  };
  const handleSaveUsername = async (data: { Username: string }) => {
    const user = auth.currentUser;
    if (!user) return;
    const usernam = data.Username.toLowerCase();
    if (await isUsernameTaken(usernam)) return;
    await UpdateUsername(usernam, user.uid);
    SetUserData((prev) => ({ ...prev, username: usernam }));
    setSiderType("none");
  };
  const handleSaveDisplayName = async (data: { DisplayName: string }) => {
    const user = auth.currentUser;
    if (!user) return;
    await UpdateDisplayName(data.DisplayName, user.uid);
    SetUserData((prev) => ({ ...prev, displayName: data.DisplayName }));
    setSiderType("none");
  };

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
              <div className="ProfileContainer">
                <div
                  className={`ProfileContainerLeft ${SiderType !== "none" ? "open" : undefined}`}
                >
                  <div className="SettingsRightInfo">
                    <h1>Profile</h1>
                    <p>
                      Manage your public profile and how you appear to others.
                    </p>
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
                  <OptionContainer OptionMap={ProfileOptions} />
                </div>
                <div
                  className={`ProfileContainerRight ${SiderType !== "none" ? "open" : undefined}`}
                >
                  <button
                    onClick={() => setSiderType("none")}
                    className="SiderTypeBack"
                  >
                    <IoIosArrowBack />
                  </button>
                  <div className="ChangerContainer">
                    <div className="ChangerContainer">
                      <h1>
                        {SiderType === "username"
                          ? "Change Username"
                          : SiderType === "displayname"
                            ? "Change DisplayName"
                            : SiderType === "email"
                              ? "Change Email"
                              : "UnknowProperties"}
                      </h1>
                      {SiderType === "username" && (
                        <form
                          onSubmit={UsernameForm.handleSubmit(
                            handleSaveUsername,
                          )}
                        >
                          <Controller
                            name="Username"
                            control={UsernameForm.control}
                            render={({ field }) => (
                              <input
                                {...field}
                                placeholder={UserData.username}
                              />
                            )}
                          />
                          <button type="submit">Save</button>
                        </form>
                      )}
                      {SiderType === "displayname" && (
                        <form
                          onSubmit={DisplayNameForm.handleSubmit(
                            handleSaveDisplayName,
                          )}
                        >
                          <Controller
                            name="DisplayName"
                            control={DisplayNameForm.control}
                            render={({ field }) => (
                              <input
                                {...field}
                                placeholder={UserData.displayName}
                              />
                            )}
                          />
                          <button type="submit">Save</button>
                        </form>
                      )}
                      {SiderType === "email" && (
                        <form
                          onSubmit={EmailForm.handleSubmit(handleSaveEmail)}
                        >
                          <Controller
                            name="Email"
                            control={EmailForm.control}
                            render={({ field }) => (
                              <input {...field} placeholder={UserData.email} />
                            )}
                          />
                          <button type="submit">Save</button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
