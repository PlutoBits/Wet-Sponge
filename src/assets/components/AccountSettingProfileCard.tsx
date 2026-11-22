import { FaCamera } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { useUser } from "./AccountContext";
import { useState } from "react";
import { UpdateBio } from "../../Config/Functions";

function ProfileCard({
  className,
  pen,
  AccountData,
}: {
  className?: string;
  pen?: boolean;
  AccountData: { username: string; display: string; Bio: string };
}) {
  const { UserData } = useUser();
  const { SetUserData } = useUser();
  const [inEdit, SetEdit] = useState(false);
  const [Bio, setBio] = useState(AccountData.Bio);
  return (
    <div className="AccountSettingsProfileCard">
      <div className={`AccountSettingsProfileCardIcon ${className}`}>
        <UserData.Profile />
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
              <>
                <input
                  placeholder={AccountData.Bio}
                  onChange={(e) => setBio(e.target.value)}
                  value={Bio}
                ></input>
                <button
                  className="PenButtonBio"
                  onClick={async (e) => {
                    e.preventDefault();
                    await UpdateBio(Bio);
                    SetEdit(false);
                  }}
                  type="submit"
                >
                  {inEdit ? <FaSave /> : <FaPen />}
                </button>
              </>
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

export default ProfileCard;
