import { useState } from "react";
import Popover from "../components/LogPopover";
import { Button } from "../../../@/components/ui/button";
import AccountDataCard from "../components/AccountDataCard";
import ProfileCard from "../components/ProfileCard";
import { useUsername } from "../components/AccountContext";

function Account() {
  const AccountCardDate = [
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

  const [PopoverOpener, SetPopoverOpener] = useState(false);
  const { username } = useUsername();
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
        {1 < 0 ? (
          <Button className="SignInButton">Log Out</Button>
        ) : (
          <Button
            className="SignInButton"
            onClick={() => SetPopoverOpener(!PopoverOpener)}
          >
            Sign In
          </Button>
        )}
      </div>
      {PopoverOpener && (
        <div className="barrier" onClick={() => SetPopoverOpener(false)} />
      )}
      <Popover open={PopoverOpener}></Popover>
    </>
  );
}

export default Account;
