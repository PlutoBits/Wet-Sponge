import { useAnimation } from "../../Config/Functions";
import AnimationCard from "../components/AnimationCard";
import Face from "../components/Face";

function Animation() {
  const { data: Animation = [], isLoading, error } = useAnimation();
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
        {isLoading ? (
          <Face
            type="happy"
            text="Loading"
            width={260}
            heigth={480}
            padding={80}
          />
        ) : error ? (
          <Face type="sad" text="can't find data" width={260} heigth={480} />
        ) : Animation ? (
          Animation.map((Data, key) => (
            <AnimationCard
              key={key}
              Image={Data.image}
              title={Data.title}
              Views={Data.views}
              likes={Data.likes}
              timeStamp={Data.timeStamp}
              Motion={true}
              index={key}
            />
          ))
        ) : (
          <Face type="sad" text="ahhhh" width={260} heigth={480} />
        )}
      </div>
    </>
  );
}

export default Animation;
