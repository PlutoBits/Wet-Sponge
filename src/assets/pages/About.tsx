import Article from "../components/Article";
import { Link } from "react-router-dom";
import { ArticleData, ButtonData } from "../types/Types";

function About() {
  return (
    <>
      <div
        className="intro"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginBottom: "auto",
        }}
      >
        <div>
          <div className="handing">ABOUT</div>
          <div className="title">Wet Sponge</div>
          <div className="aboutwebsite">
            Creating original manga, animation, and music under one creative
            studio.
          </div>
          <div className="AboutContainer">
            {ArticleData.map((Data, key) => (
              <Article
                Articletitle={Data.Articletitle}
                Articledescription={Data.Articledescription}
                index={key}
                key={key}
              ></Article>
            ))}
          </div>
        </div>
        <div className="AboutFooter">
          <div className="lineBorder"></div>
          <div className="AboutButtonGrid">
            {ButtonData.map((Data) =>
              Data.url.startsWith("https:") ? (
                <a
                  href={Data.url}
                  className="AboutButton"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {Data.Name}
                </a>
              ) : (
                <Link to={Data.url} className="AboutButton">
                  {Data.Name}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
