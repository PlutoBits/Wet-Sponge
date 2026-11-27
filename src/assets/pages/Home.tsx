import { Link } from "react-router-dom";
import { options } from "../types/Types";
import { useAnimation, useManga, useMusic } from "../../Config/Functions";
import Face from "../components/Face";
import AnimationCard from "../components/AnimationCard";
import MangaCard from "../components/MangaCard";
import MusicCard from "../components/MusicCard";

function Home() {
  const {
    data: Animation = [],
    isLoading: isAnimationLoading,
    error: AnimationError,
  } = useAnimation();
  const {
    data: Manga = [],
    isLoading: isMangaLoading,
    error: mangaError,
  } = useManga();
  const {
    data: Music = [],
    isLoading: isMusicLoading,
    error: musicError,
  } = useMusic();

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
      <div className="Shows">
        <div className="ShowRow">
          <div className="ShowTitleRow">
            <div className="ShowTitle">Animations</div>
          </div>
          <div className="ShowColumn">
            {isAnimationLoading ? (
              <Face
                type="happy"
                text="Loading"
                width={260}
                heigth={227}
                padding={80}
              />
            ) : AnimationError ? (
              <Face
                type="sad"
                text="can't find data"
                width={260}
                heigth={227}
              />
            ) : Animation ? (
              Animation.map((Data, key) => (
                <AnimationCard
                  key={key}
                  Image={Data.image}
                  title={Data.title}
                  Views={Data.views}
                  likes={Data.likes}
                  timeStamp={Data.timeStamp}
                  index={key}
                />
              ))
            ) : (
              <Face type="sad" text="ahhhh" width={260} heigth={480} />
            )}
          </div>
        </div>
        <div className="ShowRow">
          <div className="ShowTitleRow">
            <div className="ShowTitle">Manga</div>
          </div>
          <div className="ShowColumn">
            {isMangaLoading ? (
              <Face
                type="happy"
                text="Loading"
                width={260}
                heigth={227}
                padding={80}
              />
            ) : mangaError ? (
              <Face
                type="sad"
                text="can't find data"
                width={260}
                heigth={227}
              />
            ) : Manga ? (
              Manga.map((Manga, key) => (
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
            ) : (
              <Face type="sad" text="ahhhh" width={260} heigth={480} />
            )}
          </div>
        </div>
        <div className="ShowRow">
          <div className="ShowTitleRow">
            <div className="ShowTitle">Manga</div>
          </div>
          <div className="ShowColumn">
            {isMusicLoading ? (
              <Face
                type="happy"
                text="Loading"
                width={260}
                heigth={227}
                padding={80}
              />
            ) : musicError ? (
              <Face
                type="sad"
                text="can't find data"
                width={260}
                heigth={227}
              />
            ) : Music ? (
              Music.map((Data, key) => (
                <MusicCard
                  title={Data.title}
                  image={Data.image}
                  index={key}
                  key={key}
                ></MusicCard>
              ))
            ) : (
              <Face type="sad" text="ahhhh" width={260} heigth={480} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
