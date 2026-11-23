import { useMusic } from "../../Config/Functions";
import Face from "../components/Face";
import MusicCard from "../components/MusicCard";

function Music() {
  const { data: Music = [], isLoading, error } = useMusic();
  return (
    <>
      <div className="intro">
        <div className="handing">MUSIC</div>
        <div className="title">
          Albums, singles, playlists, and OST from the studio.
        </div>
        <div className="aboutwebsite">
          Browse while the bottom player carries the queue across the site.
        </div>
      </div>
      <div className="Container">
        {isLoading ? (
          <Face
            type="happy"
            text="Loading"
            width={260}
            heigth={480}
            padding={80}
          />
        ) : error ? (
          <Face type="sad" text="Data fetch failed" width={260} heigth={480} />
        ) : Music ? (
          Music.map((Data, key) => (
            <MusicCard
              title={Data.title}
              image={Data.image}
              index={key}
              Motion={true}
              key={key}
            ></MusicCard>
          ))
        ) : (
          <Face type="sad" text="ahhhh" width={260} heigth={480} />
        )}
      </div>
    </>
  );
}

export default Music;
