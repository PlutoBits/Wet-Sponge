import { Link } from "react-router-dom";
import { options } from "../types/Types";

function Home() {
  return (
    <>
      <div className="hero-page">
        <p className="handing">SQEEEZING OUT ART.</p>
        <h1 className="title-home">Spongies</h1>
        <p className="aboutwebsite">
          Stories, animations, and music created by Wet Sponge.
        </p>
        <div className="button-grid">
          {options.map((option, index) => (
            <Link to={option.path} key={index} className="button">
              {option.icon}
              {option.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
