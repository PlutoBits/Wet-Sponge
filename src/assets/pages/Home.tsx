import { Link } from "react-router-dom";
import { GoVideo } from "react-icons/go";
import { LuMusic4 } from "react-icons/lu";
import { MdBookmarkBorder } from "react-icons/md";

function Home() {
  const options = [
    {
      name: "Read Manga",
      path: "/Manga",
      icon: <MdBookmarkBorder />,
    },
    {
      name: "Watch Animation",
      path: "/Animation",
      icon: <GoVideo />,
    },
    {
      name: "Listen Music",
      path: "/Music",
      icon: <LuMusic4 />,
    },
  ];
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
