import MangaCard from "../components/MangaCard";
import Face from "../components/Face";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Config/FirebaseConfig";
import { useQuery } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore/lite";

type MangaItems = {
  id: string;
  chapter?: number;
  comments?: number;
  image?: string;
  releasedate?: Timestamp;
  title?: string;
  likes?: number;
};

function Manga() {
  const fetchManga = async () => {
    const snapshot = await getDocs(collection(db, "Manga"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<MangaItems, "id">),
    }));
  };
  const result = useQuery({ queryKey: ["manga"], queryFn: fetchManga });

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
        {result.data ? (
          result.data.map((Manga, key) => (
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
        ) : result.isLoading ? (
          <Face
            type="happy"
            text="Loading"
            width={260}
            heigth={480}
            padding={80}
          />
        ) : result.error ? (
          <Face type="sad" text="Data fetch failed" width={260} heigth={480} />
        ) : (
          <Face type="sad" text="ahhhh" width={260} heigth={480} />
        )}
      </div>
    </>
  );
}

export default Manga;
