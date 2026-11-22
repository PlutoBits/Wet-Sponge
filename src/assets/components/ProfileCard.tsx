import { useUser } from "./AccountContext";

function ProfileCard() {
  const { UserData } = useUser();

  return (
    <div className="ProfileCard">
      <div className="ProfileCardRight">
        <div className="Iconback">
          <div className="Icon">
            <UserData.Profile />
          </div>
        </div>
      </div>
      <div className="ProfileCardRight">
        <div className="ProfileCardRightTop">
          <div className="username">{UserData.displayName}</div>
        </div>
        <div className="ProfileCardRightBottom">
          <p className="Following">Following {UserData.Followings}</p>
          <p className="Follows">Follows {UserData.Followers}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
