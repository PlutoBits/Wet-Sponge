import { useProfile, useUsername, useAccountData } from "./AccountContext";

function ProfileCard() {
  const { profileIcon } = useProfile();
  const { username } = useUsername();
  const { follows, following } = useAccountData();

  return (
    <div className="ProfileCard">
      <div className="ProfileCardRight">
        <div className="Iconback">
          <div className="Icon">{profileIcon}</div>
        </div>
      </div>
      <div className="ProfileCardRight">
        <div className="ProfileCardRightTop">
          <div className="username">{username}</div>
        </div>
        <div className="ProfileCardRightBottom">
          <p className="Following">Following {following}</p>
          <p className="Follows">Follows {follows}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
