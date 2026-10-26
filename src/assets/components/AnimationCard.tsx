import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

type Props = {
  Image?: string;
  title?: string;
  Views?: number;
  likes?: number;
  comments?: number;
  timeStamp?: string;
  index?: number;
};

function formatNumber(num?: number) {
  if (num === undefined) return "0";
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

function AnimationCard({
  Image,
  title,
  Views,
  likes,
  timeStamp,
  index = 0,
}: Props) {
  return (
    <>
      <motion.div
        className={"AnimationCard"}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.2,
          delay: index * 0.1,
        }}
      >
        <div className="AnimationCardTop">
          <div
            className="AnimationCardImage"
            style={{ background: `url(${Image})` }}
          >
            <code className="timeStamp">{timeStamp}</code>
          </div>
        </div>
        <div className="AnimationCardbottom">
          <h1 className="AnimationCardtitle">{title}</h1>
          <div className="AnimationCardDetails">
            <span>
              <FaPlay size={11} />
              {formatNumber(Views)}
            </span>{" "}
            <span>
              <FaHeart size={13} />
              {formatNumber(likes)}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default AnimationCard;
