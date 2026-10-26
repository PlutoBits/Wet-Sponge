import NotFoundItem from "../components/Face";

function NotFoundPage() {
  return (
    <>
      {
        <div className="showFellBackground">
          {Array.from({ length: 80 }).map((_, index) => {
            const size = Math.floor(Math.random() * 50) + 2;
            const allreadyfallen = Math.floor(Math.random() * 100);
            return (
              <div
                className="ShowBall"
                key={index}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${Math.floor(Math.random() * 6)}s`,
                  position: "absolute",
                  left: `${Math.floor(Math.random() * 100)}%`,
                  top: `${allreadyfallen}px`,
                }}
              />
            );
          })}
        </div>
      }
      <div className="NotFoundShall">
        <NotFoundItem heigth={70} type="sad" />
        <h1 className="title">PAGE NOT FOUND</h1>
        <p className="handing">
          You went too deep into Wet Sponge that you came to an end.
        </p>
        <h1 className="aboutwebsite">404</h1>
      </div>
    </>
  );
}

export default NotFoundPage;
