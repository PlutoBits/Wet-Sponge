import Face from "../components/Face";
import MusicCard from "../components/MusicCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Config/FirebaseConfig";
import { useQuery } from "@tanstack/react-query";

type MusicItems = {
  id: string;
  title?: string;
  image?: string;
};

function Music() {
  const fetchMusic = async () => {
      const snapshot = await getDocs(collection(db, "Music"));
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<MusicItems, "id">),
      }));
    };
  const result = useQuery({ queryKey: ["music"], queryFn: fetchMusic });

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
        {result.data ? (
          result.data.map((Data, key) => (
            <MusicCard
              title={Data.title}
              image={Data.image}
              index={key}
              key={key}
            ></MusicCard>
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

export default Music;
