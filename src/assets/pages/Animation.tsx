import AnimationCard from "../components/AnimationCard";
import Face from "../components/Face";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Config/FirebaseConfig";
import { useQuery } from "@tanstack/react-query";

type AnimationItems = {
  image?: string;
  title?: string;
  views?: number;
  likes?: number;
  comments?: number;
  timeStamp?: string;
};

function Animation() {
  const fetchAnimation = async () => {
    const snapshot = await getDocs(collection(db, "Animations"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<AnimationItems, "id">),
    }));
  };

  const result = useQuery({ queryKey: ["animation"], queryFn: fetchAnimation });
  return (
    <>
      <div className="intro">
        <div className="handing">ANIMATION</div>
        <div className="title">
          Cinematic shorts, episodes, and studio process.
        </div>
        <div className="aboutwebsite">
          A streaming-style room for Wet Sponge motion work.
        </div>
      </div>
      <div className="AnimationContainer">
        {result.isSuccess ? (
          result.data.map((Data, key) => (
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
        ) : result.isFetching ? (
          <Face
            type="happy"
            text="Loading"
            width={260}
            heigth={480}
            padding={80}
          />
        ) : result.isError ? (
          <Face type="sad" text="can't find data" width={260} heigth={480} />
        ) : (
          <Face type="sad" text="ahhhh" width={260} heigth={480} />
        )}
      </div>
    </>
  );
}

export default Animation;
