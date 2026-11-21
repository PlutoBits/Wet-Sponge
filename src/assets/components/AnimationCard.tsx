import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "../../../@/components/ui/button";
import { MdOutlineQueue } from "react-icons/md";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoBookmarkOutline } from "react-icons/io5";
import { RiShareForwardLine } from "react-icons/ri";
import { useRef } from "react"
import { toast } from "react-toastify";

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
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = () => {
    menuRef.current?.hidePopover();
  };
  const inWork = () => {
    toast.info("Under Work")
  }
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
            <span className="AnimationCardDetails1">
              <span>
                <div className="AnimationCardDetails1main">
                  <FaPlay size={11} />
                  {formatNumber(Views)}
                </div>
                <div className="AnimationCardDetails1main">
                  <FaHeart size={13} />
                  {formatNumber(likes)}
                </div>
              </span>
              <div className="AnimationCardDetails3">
                <Button 
                  popoverTarget={`${index}AnimationMenu`} 
                  className="AnimationMenuButton"
                  style={{ anchorName: `--animation-menu-${index}` }}
                >
                  <BsThreeDotsVertical />
                </Button>
              </div>
            </span>
          </div>
        </div>
      </motion.div>
      <div
        popover="auto"
        className="AnimationMenu"
        id={`${index}AnimationMenu`}
        style={{ positionAnchor: `--animation-menu-${index}` }}
        ref={menuRef}
        >
          <ul className="AnimationMenuList">
            <button onClick={() => {closeMenu(), inWork()}}><MdOutlineQueue /><p>Add to queue</p></button>
            <button onClick={() => {closeMenu(), inWork()}}><MdOutlineWatchLater /><p>Save to watch later</p></button>
            <button onClick={() => {closeMenu(), inWork()}}><IoBookmarkOutline /><p>Save to playlist</p></button>
            <button onClick={() => {closeMenu(), inWork()}}><RiShareForwardLine /><p>Share</p></button>
          </ul>
      </div>
    </>
  );
}

export default AnimationCard;
