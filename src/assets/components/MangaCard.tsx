import type { Timestamp } from "firebase/firestore/lite";
import Face from "./Face";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaRegComment } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { Button } from "../../../@/components/ui/button";

type props = {
  chapter?: number;
  comments?: number;
  image?: string;
  releasedate?: Timestamp;
  title?: string;
  likes?: number;
  className?: string;
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

function MangaCard({
  chapter,
  comments,
  image,
  releasedate,
  title,
  likes,
  className,
  index = 0,
}: props) {
  const [imageError, setImageError] = useState(false);
  const [LikeStatus, setLike] = useState(false);
  const [commentStatus, setcomment] = useState(false);
  const [saveStatus, setSave] = useState(false);
  return (
    <motion.div
      className={`MangaCard ${className}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.2,
        delay: index * 0.1,
      }}
    >
      <div className="Top">
        {image && !imageError ? (
          <img
            src={image}
            alt={title}
            className="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="imageError">
            <Face
              width={260}
              heigth={360}
              classis="cover"
              padding={70}
              text="Item Not Found!"
              type="sad"
            ></Face>
          </div>
        )}
      </div>
      <div className="bottom">
        <span>
          {title ? (
            <h1 className="MangaTitle">{title}</h1>
          ) : (
            <h1 className="MangaTitle">Title Not Found</h1>
          )}
          {releasedate ? (
            <p className="releasedate">
              Chapter {chapter} /{" "}
              {releasedate?.toDate().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          ) : (
            <p className="releasedate">Chapter --- / --- --, ----</p>
          )}
        </span>
        <div className="option">
          <span className="firstOptions">
            <span>
              {comments !== undefined ? (
                <Button
                  onClick={() => {
                    setcomment(!commentStatus);
                  }}
                  className="buttonOption"
                >
                  {commentStatus ? <FaComment /> : <FaRegComment />}
                </Button>
              ) : (
                <Button className="buttonOption" disabled={true}>
                  <FaComment />
                </Button>
              )}
              {comments ? formatNumber(comments) : <p>--</p>}
            </span>
            <span>
              {likes ? (
                <Button
                  onClick={() => {
                    setLike(!LikeStatus);
                  }}
                  className="buttonOption"
                >
                  {LikeStatus ? <FaHeart /> : <FaRegHeart />}
                </Button>
              ) : (
                <Button className="buttonOption" disabled={true}>
                  <FaHeart />
                </Button>
              )}
              {likes ? formatNumber(likes) : <p>--</p>}
            </span>
          </span>
          <span className="secondOptions">
            {image && !imageError && title ? (
              <Button
                className="buttonOption"
                onClick={() => setSave(!saveStatus)}
              >
                {saveStatus ? <FaBookmark /> : <FaRegBookmark />}
              </Button>
            ) : (
              <Button className="buttonOption" disabled={true}>
                <FaBookmark />
              </Button>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default MangaCard;
