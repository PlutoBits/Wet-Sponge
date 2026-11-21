import MangaCard from "../components/MangaCard";
import Face from "../components/Face";
import { useManga } from "../../Config/Functions";

function Manga() {
  const { data: manga = [], isLoading, error } = useManga();
  return (
    <>
      <div className="intro">
        <div className="handing">MANGA</div>
        <div className="title">
          Original chapters from the Wet Sponge shelf.
        </div>
        <div className="aboutwebsite">
          Read vertically, save progress, and keep the studio library close.
        </div>
      </div>
      <div className="Container">
        {manga ? (
          manga.map((Manga, key) => (
            <MangaCard
              key={key}
              chapter={Manga.chapter}
              comments={Manga.comments}
              image={Manga.image}
              releasedate={Manga.releasedate}
              title={Manga.title}
              likes={Manga.likes}
              index={key}
            ></MangaCard>
          ))
        ) : isLoading ? (
          <Face
            type="happy"
            text="Loading"
            width={260}
            heigth={480}
            padding={80}
          />
        ) : error ? (
          <Face type="sad" text="Data fetch failed" width={260} heigth={480} />
        ) : (
          <Face type="sad" text="ahhhh" width={260} heigth={480} />
        )}
      </div>
    </>
  );
}

export default Manga;
