import { useEffect, useState } from "react";
import { AccountCardDate } from "../types/Types";
import Popover from "../components/LogPopover";
import { Button } from "../../../@/components/ui/button";
import AccountDataCard from "../components/AccountDataCard";
import AccountSettings from "../../assets/components/AccountSettings";
import ProfileCard from "../components/ProfileCard";
import { useUsername } from "../components/AccountContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../Config/FirebaseConfig";
import { IoSettingsOutline } from "react-icons/io5";

function Account() {
  const [PopoverOpener, SetPopoverOpener] = useState(false);
  const [SettingPopoverOpener, SetSettingPopoverOpener] = useState(false);
  const { username } = useUsername();
  const [IsUserLogged, SetUserLogged] = useState(false);

  useEffect(() => {
    const cell = onAuthStateChanged(auth, (user) => {
      if (user) {
        SetUserLogged(true);
      } else {
        SetUserLogged(false);
      }
      return cell;
    });
  }, []);
  const LogOut = async () => {
    await signOut(auth);
  };
  return (
    <>
      <div className="intro" style={{ paddingBottom: `25px` }}>
        <div className="handing">ACCOUNT</div>
        <div className="title" style={{ padding: `0px 0px 12px 0px` }}>
          {username}
        </div>
        <div className="aboutwebsite" style={{ padding: `0px 0px 20px 0px` }}>
          {"Somthing"}
        </div>
        <div
          className="AboutContainer"
          style={{ paddingBottom: `1px`, margin: `10px 0` }}
        >
          <ProfileCard></ProfileCard>
          {AccountCardDate.map((data, key) => {
            return (
              <AccountDataCard
                title={data.name}
                DataMap={data.DataMap}
                key={key}
              />
            );
          })}
        </div>
        {IsUserLogged ? (
          <div className="SignOutArea">
            <Button className="SignInButton" onClick={LogOut}>
              Log Out
            </Button>
            <Button
              className="SettingsBtn"
              onClick={() => SetSettingPopoverOpener(true)}
            >
              <IoSettingsOutline />
            </Button>
          </div>
        ) : (
          <div className="SignOutArea">
            <Button
              className="SignInButton"
              onClick={() => SetPopoverOpener(!PopoverOpener)}
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
      {PopoverOpener && (
        <div className="barrier" onClick={() => SetPopoverOpener(false)} />
      )}
      <Popover open={PopoverOpener}></Popover>
      {SettingPopoverOpener && (
        <div
          className="barrier"
          onClick={() => SetSettingPopoverOpener(false)}
        />
      )}
      <AccountSettings open={SettingPopoverOpener} />
    </>
  );
}

export default Account;
