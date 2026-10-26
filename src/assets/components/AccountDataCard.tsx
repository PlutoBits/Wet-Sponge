type props = {
  title?: string;
  DataMap?: { name: string }[];
};

function AccountDataCard({ title, DataMap = [] }: props) {
  return (
    <div className="AccountDataCard">
      <div className="AccountDataCardTop">
        <h1 className="AccountDataCardTitle">{title}</h1>
      </div>
      <div className="AccountDataCardbottom">
        {DataMap.length <= 3 ? (
          DataMap.map((Data, key) => (
            <p key={key} className="AccountDataCardParagraph">
              {Data.name}
            </p>
          ))
        ) : (
          <>
            {DataMap.slice(0, 2).map((Data, key) => (
              <p key={key} className="AccountDataCardParagraph">
                {Data.name}
              </p>
            ))}
            <p>
              <a className="AccountDataCardParagraph TypeLink">View all...</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AccountDataCard;
