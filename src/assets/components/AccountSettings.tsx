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
  getPlainError,
  LogOut,
} from "../../Config/Functions";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../Config/FirebaseConfig";
import { toast } from "react-toastify";

function AccountSettings({
  open,
  onClose,
}: {
  open: boolean;
  onClose?: () => void;
}) {
  const wasSignedIn = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const TabRef = useRef<(HTMLButtonElement | null)[]>([]);
  const { UserData, SetUserData } = useUser();
  const [Change, setChange] = useState("Profile");
  const [indicatorTop, setIndicatorTop] = useState(0);
  const [SiderType, setSiderType] = useState("none");
  const tabs = [
    { name: "Profile", icon: <FaRegUser /> },
    { name: "Detail", icon: <TbListDetails /> },
    { name: "Connections", icon: <VscDebugConnected /> },
    { name: "Security", icon: <GoShieldCheck /> },
  ];
  const activeIndex = tabs.findIndex((tab) => tab.name === Change);
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

  const CloseMenu = () => {
    onClose?.();
    menuRef.current?.hidePopover();
  };

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
        /^[a-zA-Z0-9_]+$/,
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
    Password: z.string().min(1, "Enter your current password."),
  });
  const EmailForm = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: { Email: "", Password: "" },
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        wasSignedIn.current = true;
      } else if (wasSignedIn.current) {
        toast.info("You've been signed out. Sign in again.");
      }
    });
    return unsub;
  }, []);

  const handleSaveEmail = async (data: { Email: string; Password: string }) => {
    const user = auth.currentUser;
    if (!user || !user.email) return;
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        data.Password,
      );
      await reauthenticateWithCredential(user, credential);
      await UpdateEmail(data.Email);
      EmailForm.setError("Email", {
        message: "check your new email to verify",
      });
    } catch (error) {
      EmailForm.setError("Email", { message: getPlainError(error) });
      return;
    }
  };
  const handleSaveUsername = async (data: { Username: string }) => {
    const user = auth.currentUser;
    if (!user) return;
    const name = data.Username.toLowerCase();
    if (await isUsernameTaken(name)) {
      UsernameForm.setError("Username", { message: "Username is taken" });
      return;
    }
    await UpdateUsername(name, user.uid);
    SetUserData((prev) => ({ ...prev, username: name }));
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
                      <p>
                        {SiderType === "username"
                          ? "Enter Your New Username"
                          : SiderType === "displayname"
                            ? "Change Your New DisplayName"
                            : SiderType === "email"
                              ? "You will be logged out from every device after Updating email"
                              : "UnknowProperties"}
                      </p>
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
                          {UsernameForm.formState.errors.Username && (
                            <p>
                              {UsernameForm.formState.errors.Username.message}
                            </p>
                          )}
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
                          {DisplayNameForm.formState.errors.DisplayName && (
                            <p>
                              {
                                DisplayNameForm.formState.errors.DisplayName
                                  .message
                              }
                            </p>
                          )}
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
                              <>
                                <p>New Email</p>
                                <input
                                  {...field}
                                  placeholder={UserData.email}
                                />
                              </>
                            )}
                          />
                          <Controller
                            name="Password"
                            control={EmailForm.control}
                            render={({ field }) => (
                              <>
                                <p>Current Password</p>
                                <input
                                  {...field}
                                  placeholder={"password"}
                                  autoComplete="new-password"
                                  type="password"
                                />
                              </>
                            )}
                          />

                          {EmailForm.formState.errors.Email && (
                            <p>{EmailForm.formState.errors.Email.message}</p>
                          )}
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
