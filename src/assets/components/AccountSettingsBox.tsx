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
      onClick={onClick}
    >
      {ConentIcon}
      <p>{Conent}</p>
    </button>
  );
}

export default AccountSettingsBox;
